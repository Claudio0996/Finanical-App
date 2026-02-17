import { createBrowserRouter } from "react-router";

import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

const privateRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      { index: true },
      { path: "transactions" },
      { path: "accounts" },
      { path: "categories" },
      { path: "profile" },
    ],
  },
]);

export default privateRouter;
