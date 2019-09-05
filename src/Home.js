import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import path from "path";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";

import DropArea from "./DropArea";
import MapItem from "./MapItem";
import LoadingScreen from "./LoadingScreen";
import useCreateMap from "./hooks/useCreateMap";

// Unzips a File and returns an array of objects containing the file data (as an
// arraybuffer or string), filename, date
async function unzip(zipfile) {
  const zip = await new JSZip().loadAsync(zipfile);
  const filePromises = [];
  zip.forEach((filepath, file) => {
    const filename = path.basename(filepath);
    // Ignore folders, dot files and __MACOSX files and other strange files we don't need
    if (file.dir || filepath.startsWith("__") || filename.startsWith("."))
      return;
    const type = path.extname(filepath) === ".json" ? "string" : "arraybuffer";
    filePromises.push(
      file.async(type).then(data => ({
        type,
        data,
        name: file.name,
        date: file.date
      }))
    );
  });
  return Promise.all(filePromises);
}

export default function Home({ location, initializing }) {
  const classes = useStyles();
  const [progress, createMap] = useCreateMap();
  const [user] = useAuthState(firebase.auth());
  const [maps = [], loading] = useCollectionData(
    firebase.firestore().collection(`groups/${user.uid}/maps`),
    { idField: "id" }
  );

  if (progress.error) console.log(progress.error);

  const onDrop = useCallback(
    async acceptedFiles => {
      if (!acceptedFiles.length || !acceptedFiles[0].name.match(/.mapeomap$/))
        return console.log("invalid file", acceptedFiles[0]);
      const files = await unzip(acceptedFiles[0]);
      createMap(files);
    },
    [createMap]
  );

  const handleDelete = useCallback(
    id => {
      firebase
        .firestore()
        .collection(`groups/${user.uid}/maps`)
        .doc(id)
        .delete();
    },
    [user.uid]
  );

  const handleShare = useCallback(
    id => {
      const { projectId } = firebase.firestore().app.options;
      const key = `groups/${user.uid}/maps/${id}/observations`;
      const url = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default)/documents/${key}`;
      window.open(url);
    },
    [user.uid]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true
  });

  if (loading || initializing) return <LoadingScreen />;

  return (
    <div {...getRootProps()} className={classes.root}>
      <Container maxWidth="md" className={classes.container}>
        {maps
          .filter(map => map.id !== progress.id || progress.done)
          .map(map => (
            <MapItem
              key={map.id}
              {...map}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        <div>
          {progress.currentFile}/{progress.totalFiles} {progress.progress}%
          done: {progress.done ? "yes" : "no"}
        </div>
        <DropArea inputProps={getInputProps()} isDragActive={isDragActive} />
      </Container>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "1em",
    alignItems: "stretch"
  },
  loading: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 400,
    display: "block"
  }
});
