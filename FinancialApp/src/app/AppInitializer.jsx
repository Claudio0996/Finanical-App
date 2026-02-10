import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { restoreSessionThunk } from "../features/auth/authThunks";

export function AppInitializer() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  return null;
}
