import { Box, LinearProgress, Stack } from "@mui/material";
import { Header } from "../../components/Header";

type AuthorisedLayoutProps = {
  renderHeader?: React.ComponentType;
  children: React.ReactNode;
  loading?: boolean;
};

export const AuthorisedLayout = ({
  renderHeader: CustomHeader,
  children,
  loading,
}: AuthorisedLayoutProps) => (
  <Box
    sx={{
      minHeight: "100vh",
      backgroundColor: "background",
    }}
  >
    <>
      <Header>{CustomHeader ? <CustomHeader /> : null}</Header>
      {loading ? <Loader /> : children}
    </>
  </Box>
);

const Loader = () => (
  <Stack
    justifyContent="center"
    alignItems="center"
    sx={{ height: "calc(100vh - 80px)" }}
  >
    <LinearProgress color="primary" sx={{ height: "10px", maxWidth: "70vw" }} />
  </Stack>
);
