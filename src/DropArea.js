import React from "react";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import BalanceText from "react-balance-text";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/icons/CloudUploadOutlined";

const defaultInputProps = {
  type: "file",
  style: { display: "none" },
  tabIndex: -1
};

export default function DropArea({
  inputProps = defaultInputProps,
  isDragging
}) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Icon className={classes.icon} fontSize="inherit" />
      <Typography
        component={BalanceText}
        className={classes.text}
        align="center"
        gutterBottom
      >
        Drag & Drop a <span className={classes.mono}>.mapeomap</span> file here
        to create a new map
      </Typography>
      <Typography align="center" gutterBottom>
        — or —
      </Typography>
      <input {...inputProps} id="contained-button-file" />
      <label htmlFor="contained-button-file">
        <Button
          color="primary"
          variant="outlined"
          component="span"
          className={classes.button}
        >
          Select file
        </Button>
      </label>
    </div>
  );
}

const useStyles = makeStyles({
  container: {
    border: "dashed 3px #cccccc",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "20em",
    color: "#666666",
    width: "100%",
    boxSizing: "border-box"
  },
  text: {
    maxWidth: "20em"
  },
  mono: {
    fontFamily: "monospace",
    fontSize: "1.3em"
  },
  icon: {
    fontSize: 64,
    color: "#aaaaaa"
  }
});
