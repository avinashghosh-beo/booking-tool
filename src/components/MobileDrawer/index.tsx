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
import { PlainChip } from "../common/Chip";
import { useAuth } from "../../contexts/AuthContext";
import { ListTodo, ListTodoIcon } from "lucide-react";

interface DrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: Function;
}

const Drawer: React.FC<DrawerProps> = ({ drawerOpen, setDrawerOpen }) => {
  const { auth } = useAuth();
  const currentRoute = useLocation();
  const { t, i18n } = useTranslation();
  const drawerTopRoutes = [
    {
      id: 0,
      route: "/my-orders",
      name: t("screenNames.myOrders"),
      alias: "myOrders",
      icon: <TaskSquareIcon />,
    },
    {
      id: 1,
      route: "/approval-tool",
      name: t("screenNames.approvalTool"),
      alias: "approvalTool",
      icon: <ScanIcon />,
    },
    {
      id: 2,
      route: "/invoice",
      name: t("labels.invoice"),
      alias: "invoice",
      icon: <BillIcon />,
    },
    {
      id: 3,
      route: "/contingents",
      name: t("screenNames.contingents"),
      alias: "contingents",
      icon: <FormarCircleIcon />,
    },
    {
      id: 4,
      route: "/media-library",
      name: t("screenNames.mediaLibrary"),
      alias: "mediaLibrary",
      icon: <FolderOpenIcon />,
    },
    {
      id: 5,
      route: "/booking-tool",
      name: t("screenNames.bookingTool"),
      alias: "bookingTool",
      icon: <CalendarAddIcon />,
    },
    {
      id: 6,
      route: "/tasks",
      name: t("screenNames.tasks"),
      alias: "tasks",
      icon: <TaskSquareIcon />,
    },
    {
      id: 7,
      route: "/todo",
      name: t("screenNames.todo"),
      alias: "todo",
      icon: <ListTodoIcon />,
    },
    {
      id: 8,
      route: "/templates",
      name: t("screenNames.templates"),
      alias: "templates",
      icon: <TemplateIcon className="" />,
    },
  ];

  const drawerBottomRoutes = [
    {
      id: 0,
      route: "/support",
      name: t("screenNames.support"),
      alias: "support",
      icon: <MessageQuestionIcon />,
    },
    {
      id: 1,
      route: "/sales",
      name: t("screenNames.sales"),
      alias: "sales",
      icon: <BagTick2Icon />,
    },
    {
      id: 2,
      route: "/settings",
      name: t("screenNames.settings"),
      alias: "settings",
      icon: <Setting2Icon />,
    },
  ];

  const activeDrawerTopRoutes = useMemo(() => {
    let result = [];
    if (auth && auth?.menu) {
      const activeMenuRoutes = auth?.menu?.map((item) => "/" + item?.element);
      result = drawerTopRoutes.filter((item) =>
        activeMenuRoutes.includes(item.route)
      );
    }
    return result;
  }, [auth]);

  return (
    <div
      className={`fixed inset-0 bg-primary-900 text-white transition-transform duration-300 ease-in-out z-50 ${
        drawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col w-full h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Logo" className="max-w-48" />
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-xl text-white"
          >
            ✕
          </button>
        </div>

        {/* Drawer Top Routes */}
        <nav className="flex-1 px-4 overflow-y-auto">
          <ul className="flex flex-col gap-6">
            {activeDrawerTopRoutes.map((item, index) => (
              <li
                key={index}
                className={`gap-4 transition-colors hover:text-primary-300 ${
                  currentRoute?.pathname === item.route
                    ? "text-secondary-400"
                    : ""
                }`}
              >
                <div className="flex flex-row">
                  <Link
                    onClick={() => setDrawerOpen(false)}
                    to={item.route}
                    className="flex gap-4"
                    // title={item.name}
                  >
                    {item?.icon}
                    {drawerOpen && item.name}{" "}
                    {/* {item.alias === "myOrders" && <PlainChip>99+</PlainChip>} */}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer Bottom Routes */}
        <nav className="px-4 py-4 border-t border-primary-100/20">
          <ul className="flex flex-col gap-6">
            {drawerBottomRoutes.map((item, index) => (
              <li
                key={index}
                className={`gap-4 transition-colors hover:text-primary-300   ${
                  drawerOpen ? "" : "flex justify-center"
                } ${
                  currentRoute?.pathname === item.route
                    ? "text-secondary-400"
                    : ""
                }`}
              >
                <Link
                  onClick={() => setDrawerOpen(false)}
                  to={item.route}
                  className="flex justify-start gap-4"
                  // title={item.name}
                >
                  {item?.icon}
                  {drawerOpen && item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Drawer;
