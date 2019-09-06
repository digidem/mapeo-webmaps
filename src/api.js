import firebase from "firebase/app";
import md5 from "js-md5";
import stringify from "json-stable-stringify";
import EventEmitter from "events";

/**
 * Creates a new map - optionally pass in an id to retry creation of an existing map.
 */
export function createMap(id, metadata, points) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Not Authorized");
  const pointsWithIds = points.map(f => ({
    ...f,
    properties: {
      ...f.properties,
      _id: md5(stringify(f))
    }
  }));
  const pointIds = pointsWithIds.map(p => p.properties._id);

  // For new maps, set createdAt
  if (!id) metadata.createdAt = firebase.firestore.FieldValue.serverTimestamp();

  const db = firebase.firestore();
  // If id is set, this is a retry, so we replace the values, otherwise this
  // will create a new document
  const mapsRef = db.collection(`groups/${user.uid}/maps`);
  const mapRef = id ? mapsRef.doc(id) : mapsRef.doc();
  const obsRef = mapRef.collection("observations");

  const promise = obsRef.get().then(snap => {
    const existingIds = snap.docs.map(doc => doc.id);
    const toDelete = existingIds.filter(id => !pointIds.includes(id));

    const batch = db.batch();
    batch.set(mapRef, metadata);
    for (var point of pointsWithIds) {
      // Deterministic ids so that we can retry uploads
      batch.set(obsRef.doc(point.properties._id), point);
    }
    for (var deleteId of toDelete) {
      batch.delete(obsRef.doc(deleteId));
    }
    return batch.commit();
  });

  promise.id = mapRef.id;
  return promise;
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
export function uploadImage(filename, data) {
  let cancel = false;
  const emitter = new EventEmitter();
  emitter.cancel = () => {
    cancel = true;
    emitter.removeAllListeners();
  };

  const user = firebase.auth().currentUser;
  const ref = firebase
    .storage()
    .ref()
    .child(`images/${user.uid}/original/${filename}`);

  ref
    .getDownloadURL()
    .then(() => emitter.emit("complete"))
    .catch(() => {
      // No download URL => this image is not uploaded yet
      if (cancel) return;
      const fileMeta = { contentType: "image/jpeg" }; // TODO: Support PNG
      const uploadTask = ref.put(data, fileMeta);
      const unsubscribe = uploadTask.on("state_changed", {
        next: snapshot => emitter.emit("progress", snapshot.bytesTransferred),
        error: e => emitter.emit("error", e),
        complete: () => emitter.emit("complete")
      });
      emitter.cancel = () => {
        unsubscribe();
        emitter.removeAllListeners();
        return uploadTask.cancel();
      };
    });
  return emitter;
}
