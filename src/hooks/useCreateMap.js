import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import path from "path";
import md5 from "js-md5";

import * as api from "../api";

const VALID_EXTS = [".png", ".jpg", ".jpeg"];

function getImagesFromFiles(files) {
  return files
    .filter(
      ({ name }) =>
        name.startsWith("images") &&
        VALID_EXTS.indexOf(path.extname(name).toLowerCase()) >= 0
    )
    .map((file) => {
      file.hashedName = md5(file.data) + path.extname(file.name);
      return file;
    });
}

function getJsonFromFiles(files, filepath) {
  const file = files.find(({ name }) => name === filepath);
  return file && file.type === "string" && JSON.parse(file.data);
}

function sumMapValueProp(map, prop) {
  let sum = 0;
  for (var value of map.values()) {
    sum += value[prop];
  }
  return sum;
}

export default function useCreateMap() {
  const cancelRef = useRef(false);
  const uploadsRef = useRef(new Map());
  const metadataRef = useRef();
  const pointsRef = useRef();
  const totalBytesRef = useRef();

  const [totalFiles, setTotalFiles] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [progress, setProgress] = useState(0);
  const [missing, setMissing] = useState(new Set());
  const [state, setState] = useState("idle");
  const [error, setError] = useState();
  const [id, setId] = useState();

  useEffect(
    () => () => {
      // cancel uploads on unmount
      cancelRef.current = true;
      for (var upload of uploadsRef.current.values()) {
        if (typeof upload.cancel === "function") {
          upload.cancel();
        }
      }
    },
    []
  );

  const retry = useCallback(async (id) => {
    let error;
    if (!metadataRef.current || !pointsRef.current || !uploadsRef.current)
      return;
    const createMapPromise = api.createMap(
      id,
      metadataRef.current,
      pointsRef.current
    );
    setId(createMapPromise.id);
    setTotalFiles(uploadsRef.current.size);
    setError(null);
    setState("loading");

    const failedFiles = Array.from(uploadsRef.current.values())
      .filter((upload) => !upload.error)
      .map((upload) => upload.file);
    setCurrentFile(uploadsRef.current.size - failedFiles.length);

    // Upload files one-by-one (Promises in serial)
    for (var file of failedFiles) {
      if (cancelRef.current) return; // bail if component is unmounted
      setCurrentFile((c) => c + 1);
      try {
        await upload(file);
      } catch (e) {
        // Continue uploads after a failed upload, but mark as error
        error = e;
      }
    }

    try {
      await createMapPromise;
      if (error) {
        setState("error");
        setError(error);
      } else {
        setState("done");
      }
    } catch (e) {
      setState("error");
      setError(e);
    }
  }, []);

  const createMap = useCallback(async (files, id) => {
    let error;
    const images = getImagesFromFiles(files);
    totalBytesRef.current = images.reduce(
      (acc, f) => acc + f.data.byteLength,
      0
    );
    const pointsFC = getJsonFromFiles(files, "points.json");
    const metadata = getJsonFromFiles(files, "metadata.json") || {};

    uploadsRef.current = new Map();
    setTotalFiles(images.length);
    setCurrentFile(0);
    setError(null);
    setState("loading");

    if (!pointsFC || !pointsFC.features || !pointsFC.features.length) {
      setState("error");
      setError(new Error("No data found in file"));
      return;
    }
    metadata.title = metadata.title || "My Map";
    metadata.public = true;

    const points = [];
    for (var f of pointsFC.features) {
      const image = images.find(
        // eslint-disable-next-line no-loop-func
        (file) => path.basename(file.name) === f.properties.image
      );
      if (!image && f.properties.image) {
        
        setError(new Error("Missing image " + f.properties.image));
        return;
      }
      points.push({
        ...f,
        properties: { ...f.properties, image: image ? image.hashedName : null },
      });
    }

    // Keep the metadata and points around in case we need to retry map creation
    metadataRef.current = metadata;
    pointsRef.current = points;

    // Don't await, we can start uploading files whilst the map is created
    const createMapPromise = api.createMap(id, metadata, points);
    setId(createMapPromise.id);

    // Upload files one-by-one (Promises in serial)
    for (var file of images) {
      if (cancelRef.current) return; // bail if component is unmounted
      setCurrentFile((c) => c + 1);
      try {
        await upload(file);
      } catch (e) {
        // Continue uploads after a failed upload, but mark as error
        error = e;
      }
    }

    try {
      await createMapPromise;
      if (error) return setError(error);
      setDone(true);
      setLoading(false);
    } catch (e) {
      setError(e);
    }
  }, []);

  async function upload(file) {
    updateProgress();
    const upload = { file, bytesTransferred: 0 };
    uploadsRef.current.set(file.hashedName, upload);

    return new Promise((resolve, reject) => {
      const uploadTask = api.uploadImage(file.hashedName, file.data);
      upload.cancel = () => uploadTask.cancel();
      uploadTask.on("progress", (bytesTransferred) => {
        upload.bytesTransferred = bytesTransferred;
        updateProgress();
      });
      uploadTask.on("error", (e) => {
        upload.error = e;
        reject(e);
      });
      uploadTask.on("complete", () => {
        upload.bytesTransferred = file.data.byteLength;
        upload.error = null;
        updateProgress();
        resolve();
      });
    });

    function updateProgress() {
      if (!totalBytesRef.current) return;
      const tfrd = sumMapValueProp(uploadsRef.current, "bytesTransferred");
      setProgress(Math.ceil((tfrd / totalBytesRef.current) * 100));
    }
  }

  const value = useMemo(
    () => [
      {
        currentFile,
        completed: progress,
        totalFiles,
        error,
        done,
        id,
        loading,
      },
      createMap,
      retry,
    ],
    [
      createMap,
      currentFile,
      done,
      error,
      progress,
      totalFiles,
      id,
      retry,
      loading,
    ]
  );

  return value;
}
