import { createBrowserRouter } from "react-router";
import PublicLayout from "../layouts/PublicLayout";
import RegisterPage from "../../features/auth/pages/RegisterPage";

const publicRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [{ path: "login" }, { index: true, element: <RegisterPage /> }],
  },
]);

export default publicRouter;
