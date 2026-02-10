import { createBrowserRouter } from "react-router";

const publicRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

export default publicRouter;
