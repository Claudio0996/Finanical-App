import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

import LoadingPage from "../../../pages/Loading";

export default function ProtectedRoute() {
  const state = useSelector((state) => state.auth);
  const authentication = state.authStatus;

  if (authentication === "checking" || authentication === "idle") {
    return <LoadingPage />;
  }

  if (authentication === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
