import { WindowLocation } from "@reach/router";

export type LocationProps = WindowLocation & {
  state: {
    from?: string;
  };
};
