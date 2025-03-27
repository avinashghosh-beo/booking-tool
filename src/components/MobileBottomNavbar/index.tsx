import React from "react";
import { CalendarAddIcon, ScanIcon, TaskSquareIcon } from "../icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileBottomNavbar = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 w-full shadow-md bg-primary sm:hidden">
      <ul className="flex items-center p-4 text-white">
        {/* Approval Tool */}
        <li
          onClick={() => navigate("/approval-tool")}
          className={`flex flex-col items-center justify-center flex-1 cursor-pointer ${
            pathname === "/approval-tool" ? "text-secondary-400" : "text-white"
          }`}
        >
          <ScanIcon />
          <span className="text-xs">{t("screenNames.approvalTool")}</span>
        </li>

        {/* Centered Calendar Icon */}
        <li className="relative flex flex-col items-center justify-center flex-1">
          <div className="absolute grid p-1 border-4 border-white rounded-full -top-8 bg-primary-500">
            <CalendarAddIcon />
          </div>
          <span className="mt-8 text-xs text-center">Publish Jobad</span>
        </li>

        {/* More */}
        <li
          onClick={() => navigate("/my-orders")}
          className={`flex flex-col items-center justify-center flex-1 cursor-pointer ${
            pathname === "/" ? "text-secondary-400" : "text-white"
          }`}
        >
          <TaskSquareIcon />
          <span className="text-xs">{t("screenNames.myOrders")}</span>
        </li>
      </ul>
    </nav>
  );
};

export default MobileBottomNavbar;
