import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Feature } from 'geojson'
import * as path from 'path'
import * as md5 from 'js-md5'
import * as EventEmitter from 'events'

// import { create } from 'js-md5'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from 'firebase/storage'
// import { getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, doc, writeBatch } from 'firebase/firestore'
import * as stringify from 'json-stable-stringify'
import { FirebaseError } from 'firebase/app'
import { FileType, getImagesFromFiles, getJsonFromFiles, ImageFileType } from '../helpers/file'
import { auth, db, firebaseApp } from '..'
import { getMetadata } from '../helpers/map'
import { MapMetadataType } from '../types'

// import * as api from "../api";

type PointsType = {
  features: Feature[]
  description: string
  public?: boolean
}

type CancellableEventEmitterType = EventEmitter & {
  cancel: () => void
}

export const useCreateMap = () => {
  const storage = getStorage(firebaseApp)
  const [user] = useAuthState(auth)
  const cancelRef = useRef(false)
  const uploadsRef = useRef(new Map())
  // const metadataRef = useRef<MapMetadataType | undefined>()
  // const pointsRef = useRef<Feature[] | undefined>()
  const bytesTransferredRef = useRef(0)
  const totalBytesRef = useRef(0)

  const [totalFiles, setTotalFiles] = useState(0)
  const [currentFile, setCurrentFile] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [done, setDone] = useState(false)
  // const [id, setId] = useState()

  useEffect(() => {
    // cancel uploads on unmount
    console.log({ progress, done })
  }, [progress, done])

  useEffect(
    () => () => {
      // cancel uploads on unmount
      cancelRef.current = true
      for (const upload of uploadsRef.current.values()) {
        if (typeof upload.cancel === 'function') {
          // upload.cancel()
        }
      }
    },
    [],
  )

  const createMapDoc = useCallback(
    async (files: FileType[], id?: string) => {
      if (!user) throw new Error('Not Authorized')

      const metadata = getMetadata(files)
      const mapsPath = `groups/${user.uid}/maps`

      const mapDoc = await addDoc(collection(db, mapsPath), metadata)

      return `${mapsPath}/${mapDoc.id}`
    },
    [user],
  )

  const createObservationsDocs = useCallback(async (files: FileType[], mapPath: string) => {
    const pointsJson = getJsonFromFiles(files, 'points.json') as PointsType
    const images = getImagesFromFiles(files)
    setTotalFiles(images.length)

    totalBytesRef.current = images.reduce(
      (acc, file) => (file.type === 'arraybuffer' ? acc + parseInt(file.data.byteLength) : acc),
      0,
    )

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

    images.forEach((imageFile) => {
      if (cancelRef.current) return // bail if component is unmounted
      setCurrentFile((c) => c + 1)
      try {
        uploadImage(imageFile.hashedName || '', imageFile.data)
      } catch (e) {
        // Continue uploads after a failed upload, but mark as error
        // setError(e)
      }
    })
    await batch.commit()

    console.log(`${observationsPath} set`)
  }, [])

  const uploadImage = useCallback(
    // async (filename: string, data: ArrayBuffer | string) => {
    (filename: string, data: ArrayBuffer | string) => {
      if (!user) throw new Error('Not Authorized')
      let cancel = false
      const emitter = new EventEmitter() as CancellableEventEmitterType
      emitter.cancel = () => {
        cancel = true
        emitter.removeAllListeners()
      }
      const fileMeta = { contentType: 'image/jpeg' } // TODO: Support PNG
      const storageRef = ref(storage, `images/${user.uid}/original/${filename}`)

      console.log({ storageRef, fileMeta, filename })

      //  uploadBytesResumable(storageRef, file, metadata);
      // const snapshot = await uploadBytes(storageRef, data as ArrayBuffer, fileMeta)
      const uploadTask = uploadBytesResumable(storageRef, data as ArrayBuffer, fileMeta)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

          const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${fileProgress}% done`)
          updateProgress(snapshot.bytesTransferred)
        },
        (uploadError: FirebaseError) => {
          console.log({ error: uploadError })
          setError(uploadError)
        },
        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          console.log('File available at', downloadURL)
        },
      )
    },
    [user, storage],
  )

  const createMap = useCallback(
    async (files: FileType[], id?: string) => {
      setLoading(true)
      setDone(false)
      const mapPath = await createMapDoc(files)
      await createObservationsDocs(files, mapPath)
      setLoading(false)
      setDone(true)
    },
    [createMapDoc, createObservationsDocs],
  )

  function updateProgress(bytesTransferred: number) {
    if (!totalBytesRef.current) return
    const transferred = bytesTransferredRef.current + bytesTransferred
    setProgress(Math.ceil((transferred / totalBytesRef.current) * 100))
  }

  return {
    createMap,
    progress: {
      currentFile,
      completed: progress,
      totalFiles,
      error,
      done,
      // id,
      loading,
    },
  }
}
