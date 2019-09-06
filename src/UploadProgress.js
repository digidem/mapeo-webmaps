import React from "react";
import {
  Card,
  makeStyles,
  CardContent,
  LinearProgress,
  Typography,
  Button
} from "@material-ui/core";
import RetryIcon from "@material-ui/icons/Autorenew";
import { defineMessages, useIntl } from "react-intl";
import BalanceText from "react-balance-text";
import clsx from "clsx";

const msgs = defineMessages({
  error: {
    id: "upload_error_title",
    defaultMessage: "Upload Error"
  },
  errorDesc: {
    id: "upload_error_desc",
    defaultMessage:
      "There was a problem uploading your map. Click the retry button to try again."
  },
  uploading: {
    id: "file_uploading",
    defaultMessage: "Uploading file {currentFile} of {totalFiles}"
  }
});

export default function UploadProgress({
  id,
  completed = 0,
  currentFile = 0,
  totalFiles,
  error,
  retry
}) {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  return (
    <Card className={classes.root}>
      <CardContent>
        <div className={clsx(classes.infoArea, error && classes.error)}>
          <div className={classes.text}>
            <Typography
              variant="h5"
              gutterBottom={!!error}
              className={clsx(error && classes.errorTitle)}
            >
              {error ? formatMessage(msgs.error) : Math.ceil(completed) + "%"}
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              component={BalanceText}
              variant={error ? "body2" : "body1"}
            >
              {formatMessage(msgs[error ? "errorDesc" : "uploading"], {
                currentFile,
                totalFiles
              })}
            </Typography>
          </div>
          {error && (
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              onClick={() => retry(id)}
            >
              Retry
              <RetryIcon color="inherit" className={classes.rightIcon} />
            </Button>
          )}
        </div>
        <LinearProgress
          variant={completed ? "determinate" : "indeterminate"}
          value={completed}
          className={classes.progress}
        ></LinearProgress>
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    margin: 12
  },
  infoArea: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  text: {
    maxWidth: "80%"
  },
  errorTitle: {
    fontWeight: 700
  },
  progress: {
    height: 7
  },
  error: {
    color: "red",
    marginBottom: theme.spacing(2)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}));
