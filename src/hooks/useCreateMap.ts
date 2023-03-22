import { useState, useCallback, useRef, useEffect } from 'react'
import { Feature } from 'geojson'
import * as path from 'path'
import * as md5 from 'js-md5'

import { useAuthState } from 'react-firebase-hooks/auth'
import { getStorage, ref, uploadBytesResumable, UploadTask, UploadTaskSnapshot } from 'firebase/storage'
import { addDoc, collection, doc, writeBatch, getDocs } from 'firebase/firestore'
import * as stringify from 'json-stable-stringify'
import { FirebaseError } from 'firebase/app'
import { FileType, ImageFileType, getImagesFromFiles, getJsonFromFiles, unzip } from '../helpers/file'
import { auth, db, firebaseApp } from '..'
import { getMetadata } from '../helpers/map'

type PointsType = {
  features: Feature[]
  description: string
  public?: boolean
}

export type ProgressType = {
  currentFile: number
  completed: number
  totalFiles: number
  error: Error | null
  mapTitle?: string
  failedFiles: string[]
  retryFailedFiles: () => void
  loading: boolean
}

type UploadType = { file: ImageFileType; bytesTransferred: number; cancel?: UploadTask['cancel'] }

type UploadsList = { [name: string]: UploadType }

const sumMapValue = (Uploads: UploadsList) =>
  Object.values(Uploads).reduce((sum, upload) => sum + upload.bytesTransferred, 0)

export const useCreateMap = () => {
  const storage = getStorage(firebaseApp)
  const [user] = useAuthState(auth)
  const filesRef = useRef<FileType[] | null>()
  const cancelRef = useRef(false)

  const totalBytesRef = useRef(0)
  const uploadsAsObjRef = useRef<UploadsList>({})

  const [mapTitle, setMapTitle] = useState<string>()
  const [totalFiles, setTotalFiles] = useState(0)
  const [currentFile, setCurrentFile] = useState(0)
  const [failedFiles, setFailedFiles] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(
    // eslint-disable-next-line arrow-body-style
    () => {
      return () => {
        // cancel uploads on unmount
        cancelRef.current = true
        Object.values(uploadsAsObjRef).forEach((upload: UploadTask) => {
          if (typeof upload.cancel === 'function') {
            upload.cancel()
          }
        })
      }
    },
    [],
  )

  const reset = () => {
    totalBytesRef.current = 0
    uploadsAsObjRef.current = {}
    setMapTitle('')
    setTotalFiles(0)
    setCurrentFile(0)
    setFailedFiles([])
    setProgress(0)
    setLoading(false)
    setError(null)
  }

  const createMapDoc = useCallback(
    async (files: FileType[]) => {
      if (!user) throw new Error('Not Authorized')

      const metadata = getMetadata(files)
      setMapTitle(metadata.title)
      const mapsPath = `groups/${user.uid}/maps`

      const mapDoc = await addDoc(collection(db, mapsPath), metadata)

      return `${mapsPath}/${mapDoc.id}`
    },
    [user],
  )

  const uploadImage = useCallback(
    (file: ImageFileType, current: number, total: number) => {
      if (!user) throw new Error('Not Authorized')

      const upload = { file, bytesTransferred: 0 }
      uploadsAsObjRef.current = { ...uploadsAsObjRef.current, [file.hashedName]: upload }

      const handleLastUpload = () => {
        // If we on the last file, either on-success or on-error we want to unset loading state
        if (current === total) {
          setLoading(false)
          filesRef.current = null
        }
      }

      const fileMeta = { contentType: 'image/jpeg' } // TODO: Support PNG
      const storageRef = ref(storage, `images/${user.uid}/original/${file.hashedName || file.name}`)

      const uploadTask = uploadBytesResumable(storageRef, file.data, fileMeta)

      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          // Observe state change events such as progress, update the progress recorded.
          const thisUpload: UploadType = {
            ...upload,
            bytesTransferred: snapshot.bytesTransferred,
            cancel: uploadTask.cancel,
          }
          const updatedUploadList: UploadsList = { ...uploadsAsObjRef.current, [file.hashedName]: thisUpload }
          uploadsAsObjRef.current = updatedUploadList
          updateProgress(updatedUploadList)
        },
        (uploadError: FirebaseError) => {
          setFailedFiles((prevFailedFiles) => [...prevFailedFiles, file.hashedName])
          handleLastUpload()
          throw new Error(`Upload failed: ${uploadError.message}`)
        },
        () => {
          // Handle successful uploads on complete
          // If it's the last file set loading to false
          const thisUpload: UploadType = { ...upload, bytesTransferred: uploadTask.snapshot.bytesTransferred }
          const updatedUploadList: UploadsList = { ...uploadsAsObjRef.current, [file.hashedName]: thisUpload }
          uploadsAsObjRef.current = updatedUploadList
          updateProgress(updatedUploadList)
          handleLastUpload()
        },
      )
    },
    [user, storage],
  )

  const createObservationsDocs = useCallback(
    async (files: FileType[], mapPath: string) => {
      const pointsJson = getJsonFromFiles(files, 'points.json') as PointsType
      const images = getImagesFromFiles(files)

      totalBytesRef.current = images.reduce((acc, file) => acc + file.data.byteLength, 0)

      const points = pointsJson.features.map((feature) => {
        const image = images.find((file) => path.basename(file.name) === feature.properties?.image)

        if (!image && feature.properties?.image) {
          console.log(`Missing image ${feature.properties?.image as string}`)
          setError(new Error(`Missing image ${feature.properties.image as string}`))
        }

        return {
          ...feature,
          properties: { ...feature.properties, image: image ? image.hashedName : null },
        }
      })
      const pointsWithIds = points.map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          _id: md5(stringify(f)),
        },
      }))

      const batch = writeBatch(db)

      const observationsPath = `${mapPath}/observations`

      pointsWithIds.forEach((point) => {
        const pointRef = doc(db, observationsPath, point.properties._id)
        batch.set(pointRef, point)
      })

      let current = 0
      const imagesLength = images.length
      setTotalFiles(imagesLength)

      images.forEach((imageFile) => {
        if (cancelRef.current) return // bail if component is unmounted
        current += 1
        try {
          setCurrentFile(current)
          uploadImage(imageFile, current, imagesLength)
        } catch (e) {
          if (typeof e === 'string') {
            const err = e
            setError(new Error(err))
          }
        }
      })

      await batch.commit()
    },
    [uploadImage],
  )

  const deleteAllObservations = useCallback(
    async (id: string) => {
      if (!user) return
      const observationsRef = collection(db, `groups/${user.uid}/maps/${id}/observations`)
      const observations = await getDocs(observationsRef)

      const batch = writeBatch(db)

      observations.forEach((observation) => {
        console.log({ observation })
        batch.delete(observation.ref)
      })

      await batch.commit()
    },
    [user],
  )

  const createMap = useCallback(
    async (zipFile: File) => {
      if (!user) return

      setTotalFiles(0)
      setCurrentFile(0)
      setProgress(0)
      setError(null)
      uploadsAsObjRef.current = {}
      setLoading(true)
      filesRef.current = await unzip(zipFile)
      const mapPath = await createMapDoc(filesRef.current)
      await createObservationsDocs(filesRef.current, mapPath)
    },
    [createMapDoc, createObservationsDocs, user],
  )

  const updateMapData = useCallback(
    async (zipFile: File, id: string) => {
      if (!user) return

      setTotalFiles(0)
      setCurrentFile(0)
      setProgress(0)
      setError(null)
      uploadsAsObjRef.current = {}
      setLoading(true)
      filesRef.current = await unzip(zipFile)
      const mapPath = `groups/${user?.uid}/maps/${id}`
      await deleteAllObservations(id)
      await createObservationsDocs(filesRef.current, mapPath)
    },
    [deleteAllObservations, createObservationsDocs, user],
  )

  function updateProgress(uploads: UploadsList) {
    if (!totalBytesRef.current) return

    const transferred = sumMapValue(uploads)
    const currentProgress = Math.ceil((transferred / totalBytesRef.current) * 100)
    setProgress(currentProgress)
  }

  const retryFailedFiles = useCallback(() => {
    if (!failedFiles.length) return
    setLoading(true)
    let current = 0
    const imagesLength = failedFiles.length
    setTotalFiles(imagesLength)
    failedFiles.forEach((failedFileHash) => {
      const fileToUpload = filesRef.current?.find(
        (failed) => failedFileHash === failed.hashedName,
      ) as ImageFileType
      current += 1
      setCurrentFile(current)
      try {
        if (fileToUpload) {
          uploadImage(fileToUpload, current, imagesLength)
          setFailedFiles((prevFailedFiles) => prevFailedFiles.filter((file) => file !== failedFileHash))
        }
      } catch (e) {
        if (typeof e === 'string') {
          const err = e
          setError(new Error(err))
        }
      }
    })
  }, [failedFiles, uploadImage])

  return {
    createMap,
    updateMapData,
    progress: {
      mapTitle,
      currentFile,
      completed: progress,
      totalFiles,
      error,
      failedFiles,
      retryFailedFiles,
      loading,
    },
    reset,
  }
}
