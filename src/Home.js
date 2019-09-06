import React, { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDropzone } from "react-dropzone";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import Grow from "@material-ui/core/Grow";
import JSZip from "jszip";
import path from "path";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import BalanceText from "react-balance-text";
import { TransitionGroup } from "react-transition-group";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import MapItem from "./MapItem";
import LoadingScreen from "./LoadingScreen";
import useCreateMap from "./hooks/useCreateMap";
import Typography from "@material-ui/core/Typography";
import UploadProgress from "./UploadProgress";
import EditDialog from "./EditDialog";

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

const AddMapButton = ({ disabled, inputProps }) => {
  const classes = useStyles();
  return (
    <>
      <input {...inputProps} id="contained-button-file" accept=".mapeomap" />
      <label htmlFor="contained-button-file">
        <Zoom in key={1}>
          <Fab
            disabled={disabled}
            color="primary"
            variant="extended"
            aria-label="add map"
            component="span"
            classes={{ root: classes.fab, disabled: classes.fabDisabled }}
          >
            <AddIcon />
            Add Map
          </Fab>
        </Zoom>
      </label>
    </>
  );
};

const ConfirmDialog = ({ open, onCancel, confirm }) => (
  <Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {confirm && confirm.title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {confirm && confirm.content}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        No, cancel
      </Button>
      <Button onClick={confirm && confirm.action} color="primary" autoFocus>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

export default function Home({ location, initializing }) {
  const classes = useStyles();
  const [editing, setEditing] = useState();
  const [confirm, setConfirm] = useState();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [progress, createMap] = useCreateMap();
  const [user] = useAuthState(firebase.auth());
  const [maps = [], loading] = useCollectionData(
    firebase
      .firestore()
      .collection(`groups/${user.uid}/maps`)
      .orderBy("createdAt", "desc"),
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
      const confirm = {
        title: "Delete this map?",
        content:
          "If you delete this map, links to it will no longer work and it will no longer be available on the internet",
        action: () => {
          firebase
            .firestore()
            .collection(`groups/${user.uid}/maps`)
            .doc(id)
            .delete()
            .then(() => setConfirmOpen(false));
        }
      };
      setConfirm(confirm);
      setConfirmOpen(true);
    },
    [user.uid]
  );

  const shareUrlBase = `https://maps.mapeo.world/public/${user.uid}/maps/`;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true
  });

  if (loading || initializing) return <LoadingScreen />;

  return (
    <div {...getRootProps()} className={classes.root}>
      <AddMapButton disabled={progress.loading} inputProps={getInputProps()} />
      <Container maxWidth="md" className={classes.container}>
        <TransitionGroup>
          {progress.loading && (
            <Grow in>
              <UploadProgress {...progress} />
            </Grow>
          )}
          {maps
            .filter(map => map.id !== progress.id || progress.done)
            .map(map => (
              <Grow in key={map.id}>
                <MapItem
                  {...map}
                  onDelete={handleDelete}
                  onEdit={id => setEditing(id)}
                  shareUrl={shareUrlBase + map.id}
                />
              </Grow>
            ))}
        </TransitionGroup>
        {!progress.loading && !maps.length && (
          <Typography
            variant="body1"
            color="textSecondary"
            className={classes.text}
            component={BalanceText}
            align="center"
          >
            Click "ADD MAP" to publicly share a map from a{" "}
            <span className={classes.mono}>.mapeomap</span> file exported from
            Mapeo
          </Typography>
        )}
      </Container>
      <EditDialog
        open={!!editing}
        id={editing}
        onClose={() => setEditing(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        confirm={confirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 24,
    paddingTop: 36,
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
  },
  fab: {
    position: "absolute",
    top: -24,
    zIndex: 2,
    left: 24
  },
  fabDisabled: {
    backgroundColor: "#cccccc !important"
  },
  text: {
    maxWidth: "30em",
    alignSelf: "center",
    paddingTop: 24
  },
  mono: {
    fontFamily: "monospace",
    fontSize: "1.3em"
  }
});
