import React from "react";
import { Outlet } from "react-router-dom";
function FullScreenLayout() {
  return (
    <div className="flex h-screen bg-white">
      <Outlet />
    </div>
  );
}

export default FullScreenLayout;
