import { createBrowserRouter } from "react-router";
import PublicLayout from "../layouts/PublicLayout";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import LoginPage from "../../features/auth/pages/LoginPage";

const publicRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

export default publicRouter;
