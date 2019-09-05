import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function LoadingScreen() {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <CircularProgress className={classes.progress} />
    </div>
  );
}

const useStyles = makeStyles({
  loading: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
