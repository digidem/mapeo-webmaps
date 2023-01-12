import { auth, firebaseApp, db } from "../index"
import { collection, FieldValue, serverTimestamp, writeBatch, doc, setDoc, addDoc, query, where, getDoc, getDocs } from "firebase/firestore";
import * as md5 from "js-md5"
import * as stringify from "json-stable-stringify"
import * as EventEmitter from "events"

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
**/

export async function createMap(metadata: MapMetadata, points: PointType, id?: string) {
  const { currentUser } = auth
  if (!currentUser) throw new Error("Not Authorized")
  const pointsWithIds = points.map((point) => ({
    ...point,
    properties: {
      ...point.properties,
      _id: md5(stringify(point))
    }
  })
  )

  // For new maps, set createdAt
  if (!id) metadata.createdAt = serverTimestamp()

  // If id is set, this is a retry, so we replace the values, otherwise this
  // will create a new document
  const mapsPath = `groups/${currentUser.uid}/maps`
  const docPath = `${mapsPath}/${id}`
  const observationsPath = `${docPath}/observations`

  const observationsRef = collection(db, observationsPath)
  const pointIds = pointsWithIds.map(async (point) => {
    const q = query(observationsRef, where("properties._id", "==", point))
    if (q) {
      const observationDocs = await getDocs(q)
      console.log({ observationDocs })

    }
  })


  console.log({ userMapsRef: mapsPath })
  const observationsDoc = id ? doc(db, observationsPath, id) : doc(db, observationsPath)
  await setDoc(observationsDoc, {
    name: "Los Angeles",
    state: "CA",
    country: "USA"
  });
  // const obsRef = mapRef.collection("observations")

  // const promise = obsRef.get().then(snap => {
  //   const existingIds = snap.docs.map(doc => doc.id)
  //   const toDelete = existingIds.filter(id => !pointIds.includes(id))

  //   const batch = writeBatch(db);
  //   batch.set(mapRef, metadata)
  //   for (var point of pointsWithIds) {
  //     // Deterministic ids so that we can retry uploads
  //     batch.set(obsRef.doc(point.properties._id), point)
  //   }
  //   for (var deleteId of toDelete) {
  //     batch.delete(obsRef.doc(deleteId))
  //   }
  //   return batch.commit()
  // })

  // promise.id = mapRef.id
  // return promise
}

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
// export function uploadImage(filename: string, data) {
//   let cancel = false
//   const emitter = new EventEmitter()
//   emitter.cancel = () => {
//     cancel = true
//     emitter.removeAllListeners()
//   }

//   const { currentUser } = auth
//   const ref = firebase
//     .storage()
//     .ref()
//     .child(`images/${currentUser?.uid}/original/${filename}`)

//   ref
//     .getDownloadURL()
//     .then(() => emitter.emit("complete"))
//     .catch(() => {
//       // No download URL => this image is not uploaded yet
//       if (cancel) return
//       const fileMeta = { contentType: "image/jpeg" } // TODO: Support PNG
//       const uploadTask = ref.put(data, fileMeta)
//       const unsubscribe = uploadTask.on("state_changed", {
//         next: snapshot => emitter.emit("progress", snapshot.bytesTransferred),
//         error: e => emitter.emit("error", e),
//         complete: () => emitter.emit("complete")
//       })
//       emitter.cancel = () => {
//         unsubscribe()
//         emitter.removeAllListeners()
//         return uploadTask.cancel()
//       }
//     })
//   return emitter
// }
