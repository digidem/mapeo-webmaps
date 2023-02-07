import {
  collection,
  FieldValue,
  serverTimestamp,
  writeBatch,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import * as md5 from 'js-md5'
import * as stringify from 'json-stable-stringify'
import * as EventEmitter from 'events'
import { auth, firebaseApp, db } from '../index'

type MapMetadata = {
  createdAt?: FieldValue
  description?: string
  public?: boolean
  title: string
  mapStyle?: string
  terms?: string
}

type PointsType = {
  geometry: {
    coordinates: [number, number]
    type: string
  }
  properties: {
    _id: string
    date: string
    description?: string
    image?: string
    title?: string
  }
  type: string
}

type PointType = [PointsType]

/**
 * Creates a new map - optionally pass in an id to retry creation of an existing map.
 * */

export async function createMap(metadata: MapMetadata, points: PointType, id?: string) {
  const { currentUser } = auth
  if (!currentUser) throw new Error('Not Authorized')
  const pointsWithIds = points.map((point) => ({
    ...point,
    properties: {
      ...point.properties,
      _id: md5(stringify(point)),
    },
  }))

  // For new maps, set createdAt
  if (!id) metadata.createdAt = serverTimestamp()

  // If id is set, this is a retry, so we replace the values, otherwise this
  // will create a new document
  const mapsPath = `groups/${currentUser.uid}/maps`
  const docPath = `${mapsPath}/${id}`
  const observationsPath = `${docPath}/observations`

  const observationsRef = collection(db, observationsPath)
  const pointIds = pointsWithIds.map(async (point) => {
    const q = query(observationsRef, where('properties._id', '==', point))
    if (q) {
      const observationDocs = await getDocs(q)
      console.log({ observationDocs })
    }
  })

  console.log({ userMapsRef: mapsPath })
  const observationsDoc = id ? doc(db, observationsPath, id) : doc(db, observationsPath)
  await setDoc(observationsDoc, {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA',
  })
}

// export const uploadFile = async (file: File) => {
//   updateProgress()
//   const upload = { file, bytesTransferred: 0 }
//   uploadsRef.current.set(file.hashedName, upload)

//   return new Promise((resolve, reject) => {
//     const uploadTask = uploadImage(file.hashedName, file.data)
//     upload.cancel = () => uploadTask.cancel()
//     uploadTask.on('progress', (bytesTransferred) => {
//       upload.bytesTransferred = bytesTransferred
//       updateProgress()
//     })
//     uploadTask.on('error', (e) => {
//       upload.error = e
//       reject(e)
//     })
//     uploadTask.on('complete', () => {
//       upload.bytesTransferred = file.data.byteLength
//       upload.error = null
//       updateProgress()
//       resolve()
//     })
//   })

//   function updateProgress() {
//     if (!totalBytesRef.current) return
//     const tfrd = sumMapValueProp(uploadsRef.current, 'bytesTransferred')
//     setProgress(Math.ceil((tfrd / totalBytesRef.current) * 100))
//   }
// }

// type CancellableEventEmitterType = EventEmitter & {
//   cancel: () => void
// }

/**
 * Uploads an image to firebase storage. Will skip upload if the file already
 * exists, so it should be called with a unique filename
 *
 * Returns an event emitter which will emit these events:
 * `progress` emitted with number of bytes transferred so far
 * `error` emitted with error object
 * `complete` when upload is complete
 *
 * The returned event emitter also has the method `cancel()` which will cancel
 * the download and unsubscribe all events
 */
// export const uploadImage = async (filename: string, data: File) => {
//   let cancel = false
//   const emitter = new EventEmitter() as CancellableEventEmitterType
//   emitter.cancel = () => {
//     cancel = true
//     emitter.removeAllListeners()
//   }

//   const { currentUser } = auth
//   const storage = getStorage()

//   if (!currentUser) throw new Error('Not Authorized')

//   const storeRef = ref(storage, `images/${currentUser.uid}/original/${filename}`)

//   const snapshot = await uploadBytes(storeRef, data)

//   console.log({ snapshot })

//   return emitter
// }
