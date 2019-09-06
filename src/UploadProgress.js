import React from "react";
import {
  Card,
  makeStyles,
  CardContent,
  LinearProgress,
  Typography
} from "@material-ui/core";
import { defineMessages, useIntl } from "react-intl";

const msgs = defineMessages({
  uploading: {
    id: "file_uploading",
    defaultMessage: "Uploading file {currentFile} of {totalFiles}"
  }
});

export default function UploadProgress({
  completed = 0,
  currentFile = 0,
  totalFiles
}) {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5">{Math.ceil(completed)}%</Typography>
        <Typography color="textSecondary" gutterBottom>
          {formatMessage(msgs.uploading, { currentFile, totalFiles })}
        </Typography>
        <LinearProgress
          variant={completed ? "determinate" : "indeterminate"}
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
