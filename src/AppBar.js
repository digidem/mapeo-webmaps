import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 1
  },
  toolbar: {
    minHeight: 128,
    alignItems: "flex-start"
  },
  title: {
    flexGrow: 1,
    alignSelf: "center",
    marginBottom: 7,
    marginLeft: 7,
    fontSize: "2rem"
  },
  buttonContainer: {
    minHeight: 64,
    display: "flex",
    alignItems: "center",
    "& > *": {
      marginLeft: 8
    }
  }
}));

export default function AppBar({ onLogoutClick }) {
  const classes = useStyles();

  return (
    <MuiAppBar position="static" color="default" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.title}>
          My Mapeo Maps
        </Typography>
        <div className={classes.buttonContainer}>
          <IconButton color="inherit">
            <ShareIcon />
          </IconButton>
          <Button color="inherit" onClick={onLogoutClick} variant="outlined">
            Logout
          </Button>
        </div>
      </Toolbar>
    </MuiAppBar>
  );
}
