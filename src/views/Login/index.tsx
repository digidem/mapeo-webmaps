import { Typography } from "@mui/material";
import { RouteComponentProps } from "@reach/router";
import { SplitLayout } from "../../layouts/split";

export const LoginView = ({ }: RouteComponentProps) => {
  return (
    <SplitLayout>
      <Typography variant="h1" component="h2">
        Left
      </Typography>
      <Typography variant="h1" component="h2">
        Right
      </Typography>
    </SplitLayout>
  )
}

export default LoginView
