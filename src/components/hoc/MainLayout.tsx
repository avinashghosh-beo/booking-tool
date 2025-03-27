import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import MobileBottomNavbar from "../../components/MobileBottomNavbar";
import Drawer from "../MobileDrawer";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="flex h-screen bg-primary-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Drawer for mobile screens */}
      <Drawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="w-full bg-primary-900">
          <Header drawerOpen={drawerOpen} sidebarOpen={sidebarOpen} toggleDrawer={toggleDrawer} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full p-4 overflow-y-auto text-base sm:rounded-bl-3xl bg-primary-50 max-w-[100vw]">
          <Outlet />
        </div>

        {/* Mobile Bottom Navbar */}
        <div className="fixed bottom-0 left-0 w-full">
          <MobileBottomNavbar />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
