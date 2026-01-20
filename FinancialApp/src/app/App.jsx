import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "../features/auth/pages/Login.jsx";
import RegisterPage from "../features/auth/pages/Register.jsx";
import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";
import DashboardPage from "../pages/DashBoard.jsx";

export default function App() {
  const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/", element: <ProtectedRoute />, children: [{ index: true, element: <DashboardPage /> }] },
  ]);

  return <RouterProvider router={router} />;
}
