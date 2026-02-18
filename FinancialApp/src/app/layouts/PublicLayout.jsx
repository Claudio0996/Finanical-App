import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <main className="flex w-screen h-screen bg-[#F4F7FA] justify-center items-center ">
      <div className="bg-white rounded-3xl w-[60vw] max-w-[400px]">
        <Outlet />
      </div>
    </main>
  );
}
