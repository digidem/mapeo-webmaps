import { Typography } from "@mui/material";
import SplitLayout from "../../layouts/split";
import { LoginViewTypes } from "./types";

const LoginView = ({}: LoginViewTypes) => {
  return (
    <SplitLayout>
      <Typography variant="h1" component="h2">
        Left
      </Typography>
      <Typography variant="h1" component="h2">
        Right
      </Typography>
    </SplitLayout>
  );
};

export default LoginView;
