import React from "react";
import {
  Card,
  makeStyles,
  CardContent,
  LinearProgress,
  Typography
} from "@material-ui/core";

export default function UploadProgress({
  completed = 0,
  currentFile = 0,
  totalFiles
}) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5">{Math.ceil(completed)}%</Typography>
        <Typography color="textSecondary" gutterBottom>
          Uploading file {currentFile} of {totalFiles}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={completed}
          className={classes.progress}
        ></LinearProgress>
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles({
  root: {
    margin: 12
  },
  progress: {
    height: 7
  }
});
