import { useMemo } from "react";
import { useSubscription } from "use-subscription";
import { globalHistory } from "@reach/router";

export default function useLocation() {
  const subscription = useMemo(
    () => ({
      getCurrentValue: () => globalHistory.location,
      subscribe: callback => globalHistory.listen(callback)
    }),
    []
  );

  return useSubscription(subscription);
}
