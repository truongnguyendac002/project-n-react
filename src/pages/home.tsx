import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/sidebar";
import TopBar from "../components/layout/topbar";

function HomePage() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br bg-white text-gray-800">
        <TopBar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 pt-6 xl:pl-6 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
