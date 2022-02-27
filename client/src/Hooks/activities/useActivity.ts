import { useState, useEffect } from "react";
import { useSelector } from "Hooks/utils";

import {
  selectActivity,
  selectErrorDetails,
  ActivityError,
} from "Store/activities";

type ActivityResult<A = () => void> = [
  {
    loading: boolean;
    error: ActivityError | null;
  },
  A
];

interface ActivityConfigParams {
  payload?: any;
  reset?: boolean;
}

export function useActivity(
  type: string,
  params?: ActivityConfigParams
): ActivityResult {
  const [error, setError] = useState<ActivityError | null>(null);
  const loading = useSelector((state) =>
    selectActivity(state.ui.activities, type /*, params?.payload*/)
  );
  const details = useSelector((state) =>
    selectErrorDetails(state.ui.activities, type)
  );

  useEffect(() => {
    if (details && !error) {
      setError(details);
    }

    if (!details && error && params?.reset) {
      setError(null);
    }
  }, [details]);

  function reset() {
    setError(null);
  }

  return [{ loading, error }, reset];
}
