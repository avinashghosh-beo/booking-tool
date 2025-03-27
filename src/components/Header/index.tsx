import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IoMenu } from "react-icons/io5";
import {
  ArrowSquareLeftIcon,
  ArrowSquareRightIcon,
  LogoutIcon,
} from "../icons";
import NotificationsDropdown from "./components/NotificationsDropdown"; 
import Breadcrumb from "../common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
  toggleSidebar: Function;
  sidebarOpen: boolean;
  toggleDrawer: Function;
  drawerOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  sidebarOpen,
  drawerOpen,
  toggleDrawer,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between p-4 shadow sm:rounded-tl-3xl bg-primary-50">
      <div className="flex gap-4">
        <button
          className="hidden md:block"
          onClick={() => {
            toggleSidebar();
          }}
        >
          {sidebarOpen ? <ArrowSquareLeftIcon /> : <ArrowSquareRightIcon />}
        </button>
        <button
          className="block md:hidden"
          onClick={() => {
            toggleDrawer();
          }}
        >
          {!sidebarOpen && <IoMenu />}
        </button>
        <Breadcrumb />
      </div>
      <div></div>
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center justify-center">
          {i18n.language === "en" ? (
            <div
              onClick={() => handleLanguageChange("de")}
              className="px-2 cursor-pointer text-primary-600"
            >
              DE
            </div>
          ) : (
            <div
              onClick={() => handleLanguageChange("en")}
              className="px-2 cursor-pointer text-primary-600"
            >
              EN
            </div>
          )}
        </div> 
        <NotificationsDropdown />

        <div
          onClick={handleLogout}
          className="px-2 cursor-pointer text-primary-700 hover:text-primary"
        >
          <LogoutIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
