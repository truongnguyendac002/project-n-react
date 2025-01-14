import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/sidebar";
import TopBar from "../components/layouts/topbar";

function HomePage() {
  return (
    <>
      <div className="h-screen flex flex-col bg-gradient-to-br from-white via-gray-100 to-white text-gray-800">
        <TopBar />
        {/* Main Content */}
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 pt-6 pl-6 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
