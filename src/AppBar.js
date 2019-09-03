import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

export default function AppBar() {
  const classes = useStyles();

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Mapeo Maps
        </Typography>
        <Button color="inherit">Logout</Button>
      </Toolbar>
    </MuiAppBar>
  );
}
