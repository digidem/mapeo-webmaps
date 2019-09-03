import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDropzone } from "react-dropzone";

import DropArea from "./DropArea";

export default function Home({ location }) {
  const classes = useStyles();
  const onDrop = acceptedFiles =>
    console.log(acceptedFiles.length && acceptedFiles[0].name);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true
  });
  return (
    <div {...getRootProps()} className={classes.root}>
      <Container maxWidth="md" className={classes.container}>
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
    alignItems: "center",
    flexDirection: "column",
    padding: "3em 0"
  },
  loading: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
