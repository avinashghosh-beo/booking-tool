import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BagTick2Icon,
  BillIcon,
  CalendarAddIcon,
  FolderOpenIcon,
  FormarCircleIcon,
  MessageQuestionIcon,
  ScanIcon,
  Setting2Icon,
  TaskSquareIcon,
  TemplateIcon,
} from "../icons";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Icons/logo.svg";
import logoIcon from "../../assets/Icons/logoIcon.svg";
import Tooltip from "../common/ToolTip";
import { PlainChip } from "../common/Chip";
import { useAuth } from "../../contexts/AuthContext";
import { ListTodo, ListTodoIcon } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Function;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { auth } = useAuth();
  const currentRoute = useLocation();
  const { t, i18n } = useTranslation();
  const sidebarTopRoutes = [];

  const sidebarBottomRoutes = [];

  const activeSidebarTopRoutes = useMemo(() => {
    let result = [];
    if (auth && auth?.menu) {
      const activeMenuRoutes = auth?.menu?.map((item) => "/" + item?.element);
      result = sidebarTopRoutes.filter((item) =>
        activeMenuRoutes.includes(item.route)
      );
    }
    return result;
  }, [auth, i18n.language]);

  return (
    <div
      className={`min-w-20 ${
        sidebarOpen ? "w-72 p-8" : "w-20"
      } sm:flex flex-col bg-primary-900 text-white transition-all duration-300 ease-in-out hidden`}
    >
      {sidebarOpen ? (
        <img src={logo} alt="Logo" className="mb-12 max-w-64" />
      ) : (
        <div className="grid pt-4 place-items-center">
          <img src={logoIcon} alt="Logo" className="w-16 mb-12" />
        </div>
      )}

      {/* Sidebar Top Routes */}
      <nav className="flex-1 gap-6 pt-4 flex justify-center items-center pb-24">
        <ul className="flex flex-col gap-6">
          {activeSidebarTopRoutes.map((item, index) => (
            <li
              key={index}
              className={`gap-4 transition-colors hover:text-primary-300 ${
                sidebarOpen ? "" : "flex justify-center"
              } ${
                currentRoute?.pathname === item.route
                  ? "text-secondary-400"
                  : ""
              }`}
            >
              <Tooltip
                disabled={sidebarOpen}
                content={item.name}
                position="right"
              >
                <div className="flex flex-row justify-between">
                  <Link
                    to={item.route}
                    className="flex gap-4"
                    // title={item.name}
                  >
                    {item?.icon}
                    {sidebarOpen && item.name}
                  </Link>
                  {/* {sidebarOpen && item.alias === "myOrders" && (
                    <PlainChip>99+</PlainChip>
                  )} */}
                </div>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Bottom Routes */}
      <nav className="py-4 border-t border-primary-100/20">
        <ul className="flex flex-col gap-6">
          {sidebarBottomRoutes.map((item, index) => (
            <li
              key={index}
              className={`gap-4 transition-colors hover:text-primary-300   ${
                sidebarOpen ? "" : "flex justify-center"
              } ${
                currentRoute?.pathname === item.route
                  ? "text-secondary-400"
                  : ""
              }`}
            >
              <Tooltip
                disabled={sidebarOpen}
                content={item.name}
                position="right"
              >
                <Link
                  to={item.route}
                  className="flex justify-start gap-4"
                  // title={item.name}
                >
                  {item?.icon}
                  {sidebarOpen && item.name}
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
