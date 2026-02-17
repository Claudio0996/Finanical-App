import { Outlet } from "react-router";

export default function AuthenticatedLayout() {
  return (
    <main className="flex w-dvw h-dvh bg-[#F4F7FA] justify-center align-middle">
      <Outlet />
    </main>
  );
}
