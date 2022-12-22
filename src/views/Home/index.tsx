import { Box, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { useCollectionData } from "react-firebase-hooks/firestore";

import { AddMapButton } from "../../components/AddMapButton"
import { AuthorisedLayout } from "../../layouts/Authorised"
import { Img } from './styles'
// import msgs from './messages'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../..";

// console.log({ msgs })

export const HomeView = () => {
  const [user,] = useAuthState(auth);
  // const [maps = [], loading] = useCollectionData(
  //   firebase
  //     .firestore()
  //     .collection(`groups/${user.uid}/maps`)
  //     .orderBy("createdAt", "desc"),
  //   { idField: "id" }
  // );

  return <AuthorisedLayout loading={false}>
    {/* {maps && maps?.length ? <div>maps!</div> : <NoMaps />} */}
    <NoMaps />
  </AuthorisedLayout>

}

const NoMaps = () => (
  <Box justifyContent="center" alignItems="center" sx={{ width: '100%', height: 'calc(100vh - 80px)', paddingTop: '15vh' }}>
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={5}>
      <Img src="/svg/nomap.svg" alt="" />
      <Typography variant="h3">No maps to show</Typography>
      <Typography variant="body1">Export data from Mapeo Desktop to share publicly.
        Not sure how to add maps? Go to Tutorials</Typography>
      <AddMapButton></AddMapButton>
    </Stack>
  </Box >
)
