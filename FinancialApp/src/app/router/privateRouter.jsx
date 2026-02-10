import { createBrowserRouter } from "react-router";

const privateRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "accounts", element: <AccountsPage /> },
      { path: "categories", element: <CateogriesPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

export default privateRouter;
