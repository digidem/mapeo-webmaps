import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Feature } from 'geojson'
import * as path from 'path'
import * as md5 from 'js-md5'
// import { create } from 'js-md5'
import { useAuthState } from 'react-firebase-hooks/auth'
import { addDoc, collection, doc, FieldValue, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import * as stringify from 'json-stable-stringify'
import { FileType, getImagesFromFiles, getJsonFromFiles } from '../helpers/file'
import { auth, db } from '..'
import { getMetadata } from '../helpers/map'
import { MapMetadataType } from '../types'

// import * as api from "../api";

type PointsType = {
  features: Feature[]
  description: string
  public?: boolean
}

export const useCreateMap = () => {
  const [user] = useAuthState(auth)
  const cancelRef = useRef(false)
  const uploadsRef = useRef(new Map())
  const metadataRef = useRef<MapMetadataType | undefined>()
  const pointsRef = useRef<Feature[] | undefined>()
  const totalBytesRef = useRef(0)

  const [totalFiles, setTotalFiles] = useState(0)
  const [currentFile, setCurrentFile] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [done, setDone] = useState(false)
  // const [id, setId] = useState()

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

  const createMap = useCallback(
    async (files: FileType[], id?: string) => {
      setLoading(true)
      setDone(false)
      const mapPath = await createMapDoc(files)
      await createObservationsDocs(files, mapPath)
      setLoading(false)
      setDone(true)
    },
    [user],
  )

  const createMapDoc = useCallback(
    async (files: FileType[], id?: string) => {
      if (!user) throw new Error('Not Authorized')

      const metadata = getMetadata(files)
      const mapsPath = `groups/${user.uid}/maps`

      console.log({ mapsPath })

      const mapDoc = await addDoc(collection(db, mapsPath), metadata)

      return `${mapsPath}/${mapDoc.id}`
    },
    [user],
  )

  const createObservationsDocs = async (files: FileType[], mapPath: string) => {
    const pointsJson = getJsonFromFiles(files, 'points.json') as PointsType
    const images = getImagesFromFiles(files)

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
    console.log(observationsPath)

    pointsWithIds.forEach((point) => {
      const pointRef = doc(db, mapPath, 'observations')
      batch.set(pointRef, point)
    })

    await batch.commit()

    console.log(`${observationsPath} set`)

    // await

    // const { id: newId } = await addDoc(collection(db, observationsPath), { test: 'some junk 2000' })
  }

  // const createMap = useCallback((files: FileType[], id?: string) => {
  //   setLoading(true)
  // const images = getImagesFromFiles(files)
  //   // totalBytesRef.current = images.reduce(
  //   //   (acc: number, f: ArrayBuffer) => {
  //   //     if (f?.data) {
  //   //       return acc + f.data.byteLength
  //   //     } return 0
  //   //   },
  //   //   0
  //   // )

  //   uploadsRef.current = new Map()
  //   setTotalFiles(images.length)
  //   setCurrentFile(0)
  //   setError(null)
  //   setDone(false)
  //   setLoading(true)

  //   if (!pointsFC || !pointsFC.features || !pointsFC.features.length) {
  //     return setError(new Error('No data found in file'))
  //   }
  //   metadata.title = metadata.title || 'My Map'
  //   metadata.public = true

  //   // Keep the metadata and points around in case we need to retry map creation
  //   metadataRef.current = metadata
  //   pointsRef.current = points

  //   return { points, metadata, images }

  //   function updateProgress() {
  //     if (!totalBytesRef.current) return
  //     // const tfrd = sumMapValueProp(uploadsRef.current, "bytesTransferred");

  //     // setProgress(Math.ceil((tfrd / totalBytesRef.current) * 100));
  //     // TODO make this work
  //     if (progress < 100) {
  //       setProgress(progress + 10)
  //     }
  //   }
  // }, [])
  return {
    createMap,
    progress,
    loading,
    error,
    done,
  }
}
