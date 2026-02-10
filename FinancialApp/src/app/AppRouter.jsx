import { RouterProvider } from "react-router";
import { useSelector } from "react-redux";

import publicRouter from "./router/publicRouter";
import loadingRouter from "./router/loadingRouter";
import privateRouter from "./router/privateRouter";

export function AppRouter() {
  let activeRoute;

  const authStatus = useSelector((state) => state.auth.authStatus);

  switch (authStatus) {
    case "checking": {
      activeRoute = loadingRouter;
      break;
    }
    case "unauthenticated": {
      activeRoute = publicRouter;
      break;
    }
    case "authenticated": {
      activeRoute = privateRouter;
      break;
    }
    default: {
      activeRoute = publicRouter;
      break;
    }
  }

  return <RouterProvider router={activeRoute}></RouterProvider>;
}
