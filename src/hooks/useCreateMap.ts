import { useState, useCallback, useRef, useEffect } from 'react'
import { Feature } from 'geojson'
import * as path from 'path'
import * as md5 from 'js-md5'

import { useAuthState } from 'react-firebase-hooks/auth'
import { getStorage, ref, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage'
// import { getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, doc, writeBatch } from 'firebase/firestore'
import * as stringify from 'json-stable-stringify'
import { FirebaseError } from 'firebase/app'
import { FileType, ImageFileType, getImagesFromFiles, getJsonFromFiles, unzip } from '../helpers/file'
import { auth, db, firebaseApp } from '..'
import { getMetadata } from '../helpers/map'

// import * as api from "../api";

type PointsType = {
  features: Feature[]
  description: string
  public?: boolean
}

// type CancellableEventEmitterType = EventEmitter & {
//   cancel: () => void
// }

type UploadType = { file: ImageFileType; bytesTransferred: number }

type UploadsList = { [name: string]: UploadType }

const sumMapValue = (Uploads: { [name: string]: UploadType }) =>
  Object.values(Uploads).reduce((sum, upload) => sum + upload.bytesTransferred, 0)

export const useCreateMap = () => {
  const storage = getStorage(firebaseApp)
  const [user] = useAuthState(auth)
  const cancelRef = useRef(false)
  //const uploadsRef = useRef<Map<string, UploadType>>(new Map())
  const totalBytesRef = useRef(0)
  const uploadsAsObjRef = useRef<UploadsList>({})

  const [totalFiles, setTotalFiles] = useState(0)
  const [currentFile, setCurrentFile] = useState(0)
  const [failedFiles, setFailedFiles] = useState<ImageFileType[]>([])
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // useEffect(
  //   // eslint-disable-next-line arrow-body-style
  //   () => {
  //     return () => {
  //       // cancel uploads on unmount
  //       cancelRef.current = true
  //       for (const upload of uploadsRef.current.values()) {
  //         if (typeof upload.cancel === 'function') {
  //           // upload.cancel()
  //         }
  //       }
  //     }
  //   },
  //   [],
  // )

  const createMapDoc = useCallback(
    async (files: FileType[]) => {
      if (!user) throw new Error('Not Authorized')

      const metadata = getMetadata(files)
      const mapsPath = `groups/${user.uid}/maps`

      const mapDoc = await addDoc(collection(db, mapsPath), metadata)

      return `${mapsPath}/${mapDoc.id}`
    },
    [user],
  )

  const uploadImage = useCallback(
    (file: ImageFileType, current: number, total: number) => {
      if (!user) throw new Error('Not Authorized')
      // const emitter = new EventEmitter() as CancellableEventEmitterType
      // emitter.cancel = () => {
      //   emitter.removeAllListeners()
      // }

      const upload = { file, bytesTransferred: 0 }
      //uploadsRef.current.set(file.hashedName, upload)
      uploadsAsObjRef.current = { ...uploadsAsObjRef.current, [file.hashedName]: upload }

      console.log(`Uploading ${file.name}`)

      const handleLastUpload = () => {
        // If we on the last file, either on-success or on-error we want to unset loading state
        if (current === total) {
          console.log({ current, total })
          setLoading(false)
        }
      }

      const fileMeta = { contentType: 'image/jpeg' } // TODO: Support PNG
      const storageRef = ref(storage, `images/${user.uid}/original/${file.hashedName || file.name}`)

      // // <<! DEBUG CODE START !>>
      // if (file.name.includes('3.png')) {
      //   setFailedFiles((prevFailedFiles) => [...prevFailedFiles, file])
      //   handleLastUpload()
      //   return
      // }
      // // <<! END DEBUG CODE !>>

      const uploadTask = uploadBytesResumable(storageRef, file.data, fileMeta)

      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          // Observe state change events such as progress, update the progress recorded.
          const thisUpload: UploadType = { ...upload, bytesTransferred: snapshot.bytesTransferred }
          const updatedUploadList: UploadsList = { ...uploadsAsObjRef.current, [file.hashedName]: thisUpload }
          uploadsAsObjRef.current = updatedUploadList
          updateProgress(updatedUploadList)
        },
        (uploadError: FirebaseError) => {
          console.log({ error: uploadError })
          setFailedFiles((prevFailedFiles) => [...prevFailedFiles, file])
          handleLastUpload()
          throw new Error('upload failed')
        },
        () => {
          // Handle successful uploads on complete
          // If it's the last file set loading to false
          console.log({ bytesTransferred: uploadTask.snapshot.bytesTransferred })
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
        setCurrentFile(current)
        console.log({ current })
        try {
          uploadImage(imageFile, current, imagesLength)
        } catch (e) {
          if (typeof e === 'string') {
            const err = e
            setError(new Error(err))
          }
        }
      })

      await batch.commit()

      console.log(`${observationsPath} set`)
    },
    [uploadImage],
  )

  const createMap = useCallback(
    async (files: File[]) => {
      setLoading(true)
      const unzippedFiles = await unzip(files[0])
      const mapPath = await createMapDoc(unzippedFiles)
      await createObservationsDocs(unzippedFiles, mapPath)
    },
    [createMapDoc, createObservationsDocs],
  )

  function updateProgress(uploads: UploadsList) {
    if (!totalBytesRef.current) return

    const transferred = sumMapValue(uploads)
    const currentProgress = Math.ceil((transferred / totalBytesRef.current) * 100)
    setProgress(currentProgress)

    console.log({
      currentProgress,
      totalBytesRef: totalBytesRef.current,
      transferred,
    })
  }

  const retryFailedFiles = useCallback(() => {
    if (!failedFiles.length) return
    setLoading(true)
    let current = 0
    const imagesLength = failedFiles.length
    setTotalFiles(imagesLength)
    failedFiles.forEach((failedFile) => {
      current += 1
      setCurrentFile(current)
      try {
        uploadImage(failedFile, current, imagesLength)
        setFailedFiles((prevFailedFiles) =>
          prevFailedFiles.filter((file) => file.hashedName !== failedFile.hashedName),
        )
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
    progress: {
      currentFile,
      completed: progress,
      totalFiles,
      error,
      failedFiles,
      retryFailedFiles,
      // id,
      loading,
    },
  }
}
