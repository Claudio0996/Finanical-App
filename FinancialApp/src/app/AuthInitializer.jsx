import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { restoreSessionThunk } from "../features/auth/context/restoreSessionThunk.js";
import App from "./App.jsx";

export default function AuthInitializer() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, []);

  if (auth.authStatus === "idle" || auth.authStatus === "checking") {
    return null;
  }
  return <App />;
}
