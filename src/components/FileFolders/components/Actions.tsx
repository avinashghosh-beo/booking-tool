import React from "react";
import { MoreSquareIcon } from "../../../components/icons";
import { useTranslation } from "react-i18next";
import { FolderPen, FolderPlus, Network, TrashIcon } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../common/Popover.tsx";

const Actions = ({
  setManageAccessVisible,
  setRenameFolderVisibleID,
  setNewFolderVisibleID,
  deleteFolder,
}) => {
  const { t } = useTranslation();
  const orderActionItems = [
    {
      type: "item",
      color: "normal",
      title: "Manage Access",
      icon: <Network className="h-4" />,
      onClick: () => setManageAccessVisible(true),
    },
    {
      type: "item",
      color: "normal",
      title: "Rename Folder",
      icon: <FolderPen className="h-4" />,
      onClick: () => setRenameFolderVisibleID(),
    },
    {
      type: "item",
      color: "normal",
      title: "Create Subfolder",
      icon: <FolderPlus className="h-4" />,
      onClick: () => setNewFolderVisibleID(),
    },
    {
      type: "separator",
      color: "normal",
    },
    {
      type: "item",
      color: "danger",
      title: "Delete Folder",
      icon: <TrashIcon className="h-4" />,
      onClick: () => deleteFolder(),
    },
  ];

  return (
    <>
      <Popover>
        <PopoverTrigger
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <MoreSquareIcon className="h-4" />
        </PopoverTrigger>
        <PopoverContent className="w-64" showArrow>
          <div className="p-2">
            <h3 className="font-medium mb-2">Actions</h3>
            {orderActionItems.map((item, index) => (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.onClick();
                }}
                key={index}
                className={`flex flex-row py-1 items-center gap-x-3 hover:bg-primary-100 cursor-pointer rounded-md ${
                  item.color === "danger" ? "text-danger-500" : ""
                }`}
              >
                {item.icon} {item.title}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Actions;
