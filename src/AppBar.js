import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import { defineMessages, useIntl } from "react-intl";
import { Tooltip } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";

const msgs = defineMessages({
  title: {
    id: "app_title",
    defaultMessage: "My Mapeo Maps",
  },
  logout: {
    id: "logout_button",
    defaultMessage: "Logout",
  },
  share: {
    id: "share_all",
    defaultMessage: "Public link to all maps",
  },
});

export default function AppBar({ onLogoutClick }) {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [user] = useAuthState(firebase.auth());
  const shareUrl =
    user && `https://maps-public.mapeo.world/groups/${user.uid}/maps/`;

  return (
    <MuiAppBar position="static" color="default" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.title}>
          {formatMessage(msgs.title)}
        </Typography>
        <div className={classes.buttonContainer}>
          <Tooltip title={formatMessage(msgs.share)}>
            <IconButton
              color="inherit"
              component="a"
              href={shareUrl}
              target="_blank"
              disabled={!shareUrl}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Button color="inherit" onClick={onLogoutClick} variant="outlined">
            {formatMessage(msgs.logout)}
          </Button>
        </div>
      </Toolbar>
    </MuiAppBar>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 1,
  },
  toolbar: {
    minHeight: 128,
    alignItems: "flex-start",
  },
  title: {
    flexGrow: 1,
    alignSelf: "center",
    marginBottom: 7,
    marginLeft: 7,
    fontSize: "2rem",
  },
  buttonContainer: {
    minHeight: 64,
    display: "flex",
    alignItems: "center",
    "& > *": {
      marginLeft: 8,
    },
  },
}));
