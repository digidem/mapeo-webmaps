import styled from '@emotion/styled';
import { Stack } from "@mui/material"


export const Image = styled.img`
  height: 150px;
  width: auto;
`;

export const Column = styled.div`
  margin-top: 10vh;
`;

export const CenteredStack = ({ ...rest }) => (
  <Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={3}
    {...rest}
  />
)