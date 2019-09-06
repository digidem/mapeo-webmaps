import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Typography, IconButton, TextField } from "@material-ui/core";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { defineMessages, useIntl } from "react-intl";

const msgs = defineMessages({
  title: {
    id: "edit_dialog_title",
    defaultMessage: "Edit Map Details"
  },
  save: {
    id: "save_button",
    defaultMessage: "Save"
  },
  cancel: {
    id: "cancel_button",
    defaultMessage: "Cancel"
  },
  title_label: {
    id: "title_label",
    defaultMessage: "Map Title"
  },
  description_label: {
    id: "description_label",
    defaultMessage: "Map Description"
  },
  style_label: {
    id: "mapstyle_label",
    defaultMessage: "Map Style"
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultMapStyle = "mapbox://styles/mapbox/outdoors-v11";

export default function EditDialog({ open, id, onClose }) {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [user] = useAuthState(firebase.auth());
  const [value, loading] = useDocumentData(
    firebase.firestore().doc(`groups/${user.uid}/maps/${id}`)
  );
  const [saving, setSaving] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [mapStyle, setMapStyle] = useState(defaultMapStyle);

  const handleClose = () => {
    setSaving(false);
    setTitle(undefined);
    setDescription(undefined);
    setMapStyle(defaultMapStyle);
    onClose();
  };

  const handleSave = e => {
    e.preventDefault();
    setSaving(true);
    firebase
      .firestore()
      .doc(`groups/${user.uid}/maps/${id}`)
      .set({
        ...value,
        title: title || value.title,
        description: description || value.description,
        mapStyle: mapStyle || value.mapStyle
      })
      .then(() => {
        setSaving(false);
        onClose();
      });
  };

  const dialogTitle = formatMessage(msgs.title);

  return (
    <Dialog
      fullScreen={smallScreen}
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      TransitionComponent={Transition}
    >
      <form noValidate autoComplete="off">
        {smallScreen ? (
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {dialogTitle}
              </Typography>
              <Button disabled={saving} color="inherit" onClick={handleClose}>
                {formatMessage(msgs.cancel)}
              </Button>
              <Button
                disabled={saving || loading}
                color="inherit"
                variant="outlined"
                onClick={handleSave}
                type="submit"
              >
                {formatMessage(msgs.save)}
              </Button>
            </Toolbar>
          </AppBar>
        ) : (
          <DialogTitle
            id="responsive-dialog-title"
            style={{ paddingBottom: 8 }}
          >
            {dialogTitle}
          </DialogTitle>
        )}

        <DialogContent className={classes.content}>
          <TextField
            label={formatMessage(msgs.title_label)}
            value={
              value === undefined
                ? ""
                : title === undefined
                ? value.title
                : title
            }
            fullWidth
            variant="outlined"
            onChange={e => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label={formatMessage(msgs.description_label)}
            value={
              value === undefined
                ? ""
                : description === undefined
                ? value.description
                : description
            }
            fullWidth
            multiline
            variant="outlined"
            margin="normal"
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            label={formatMessage(msgs.style_label)}
            value={
              value === undefined
                ? ""
                : mapStyle === undefined
                ? value.mapStyle
                : mapStyle
            }
            helperText={
              <>
                Enter a{" "}
                <a
                  href="https://docs.mapbox.com/help/glossary/style-url/"
                  target="_black"
                  rel="noreferrer"
                >
                  Mapbox Style Url
                </a>
              </>
            }
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={e => setMapStyle(e.target.value)}
          />
        </DialogContent>
        {!smallScreen && (
          <DialogActions>
            <Button disabled={saving} onClick={handleClose}>
              {formatMessage(msgs.cancel)}
            </Button>
            <Button
              disabled={saving || loading}
              onClick={handleSave}
              color="primary"
              variant="contained"
              type="submit"
            >
              {formatMessage(msgs.save)}
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  content: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 0
  }
}));
