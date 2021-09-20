import React, { useEffect, useState } from "react";
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
import Fade from "@material-ui/core/Fade";
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
    defaultMessage: "Edit Map Details",
  },
  save: {
    id: "save_button",
    defaultMessage: "Save",
  },
  cancel: {
    id: "cancel_button",
    defaultMessage: "Cancel",
  },
  title_label: {
    id: "title_label",
    defaultMessage: "Map Title",
  },
  description_label: {
    id: "description_label",
    defaultMessage: "Map Description",
  },
  terms_label: {
    id: "terms_label",
    defaultMessage: "Terms & Limitations",
  },
  terms_hint: {
    id: "terms_hint",
    defaultMessage: "Add terms & limitations about how this data can be used",
  },
  style_label: {
    id: "mapstyle_label",
    defaultMessage: "Map Style",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return smallScreen ? (
    <Slide direction="up" ref={ref} {...props} />
  ) : (
    <Fade ref={ref} {...props} />
  );
});

const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/outdoors-v11";
const DEFAULT_TEXT_VALUE = "";

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
  const [title, setTitle] = useState(DEFAULT_TEXT_VALUE);
  const [description, setDescription] = useState(DEFAULT_TEXT_VALUE);
  const [terms, setTerms] = useState(DEFAULT_TEXT_VALUE);
  const [mapStyle, setMapStyle] = useState(DEFAULT_MAP_STYLE);

  const handleClose = () => {
    setSaving(false);
    setTitle(DEFAULT_TEXT_VALUE);
    setDescription(DEFAULT_TEXT_VALUE);
    setTerms(DEFAULT_TEXT_VALUE);
    setMapStyle(DEFAULT_MAP_STYLE);
    onClose();
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    firebase
      .firestore()
      .doc(`groups/${user.uid}/maps/${id}`)
      .set({
        ...value,
        description,
        mapStyle,
        terms,
        title,
      })
      .then(() => {
        setSaving(false);
        onClose();
      });
  };

  const dialogTitle = formatMessage(msgs.title);

  useEffect(() => {
    if (value) {
      if (value.title) {
        setTitle(value.title);
      }

      if (value.description) {
        setDescription(value.description);
      }

      if (value.terms) {
        setTerms(value.terms);
      }

      if (value.mapStyle) {
        setMapStyle(value.mapStyle);
      }
    }
  }, [value]);

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
            value={title}
            InputLabelProps={{ shrink: !!title }}
            fullWidth
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label={formatMessage(msgs.description_label)}
            value={description}
            InputLabelProps={{ shrink: !!description }}
            fullWidth
            multiline
            variant="outlined"
            margin="normal"
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label={formatMessage(msgs.terms_label)}
            helperText={formatMessage(msgs.terms_hint)}
            value={terms}
            InputLabelProps={{ shrink: !!terms }}
            fullWidth
            multiline
            variant="outlined"
            margin="normal"
            onChange={(e) => setTerms(e.target.value)}
          />
          <TextField
            label={formatMessage(msgs.style_label)}
            value={mapStyle}
            InputLabelProps={{ shrink: !!mapStyle }}
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
            onChange={(e) => setMapStyle(e.target.value)}
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

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 0,
  },
}));
