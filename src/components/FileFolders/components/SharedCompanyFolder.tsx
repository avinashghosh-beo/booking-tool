import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFolders, getSharedFolders } from "../api";
import FolderTree, { FolderTreeSkeleton } from "./FolderTree";
import {
  ArchiveIcon,
  ArrowLinearIcon,
  FolderOpenIcon,
  GlobalIcon,
} from "../../icons";
import { Waypoints } from "lucide-react";

interface CompanyFolderProps {
  data: any;
  handleFolderSelect: (folder: any) => void;
  selectedFolderId: number | null;
}

const SharedCompanyFolder: React.FC<CompanyFolderProps> = ({
  data,
  handleFolderSelect,
  selectedFolderId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    handleFolderSelect(null);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="pb-2">
      <div
        className="flex items-center gap-2 px-2 pl-10 py-1 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={toggleExpand}
      >
        {isExpanded ? (
          <ArrowLinearIcon className="rotate-90 size-3" />
        ) : (
          <ArrowLinearIcon className="size-3" />
        )}
        <h2 className="">{data?.Company}</h2>
      </div>

      {isExpanded && (
        <div className="ml-12 border-l border-gray-200">
          <FolderTree
            mode="SHARED_FOLDERS"
            deleteFolderFromData={() => {}}
            updateFolderData={() => {}}
            parentFolderId={null}
            renderActions={() => {}}
            refetch={() => {}}
            company={data?.ID}
            level={0}
            folders={data?.folders}
            handleFolderSelect={handleFolderSelect}
            selectedFolderId={selectedFolderId}
          />
        </div>
      )}

      {isExpanded && (
        <div
          onClick={() =>
            handleFolderSelect({ ID: "SHARED_IMAGES", company: data.ID })
          }
          className={`border-l border-gray-200 ml-12 pl-8 py-1.5 flex flex-row items-center cursor-pointer ${
            selectedFolderId === "SHARED_IMAGES" && "bg-primary-100"
          }`}
        >
          <Waypoints className="h-4 mr-1" />
          Images
        </div>
      )}
    </div>
  );
};

export default SharedCompanyFolder;
