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
import Actions from "./Actions";
import SharedCompanyFolder from "./SharedCompanyFolder";

interface Company {
  id: number;
  value: string;
}

interface CompanyFolderProps {
  company: Company;
  handleFolderSelect: (folderId: any) => void;
  selectedFolderId: number | null;
  selectedFolderCompanyId: number | null;
  setManageAccessVisible?: (status: any) => void;
  openedFolder: any;
  setOpenedFolder: (folder: any) => void;
  setUpdateLogoCompanyId: () => {};
  mode: "IMAGE_PICKER" | "MEDIA_LIBRARY";
}

const CompanyFolder: React.FC<CompanyFolderProps> = ({
  company,
  handleFolderSelect,
  selectedFolderId,
  selectedFolderCompanyId,
  setManageAccessVisible,
  openedFolder,
  setOpenedFolder,
  setUpdateLogoCompanyId,
  mode,
}) => {
  const [data, setData] = useState([]);
  const [isMediaFoldersExpanded, setIsMediaFoldersExpanded] = useState(false);
  const [isShareExpanded, setIsShareExpanded] = useState(false);

  const foldersQuery = useQuery({
    queryKey: ["folders", company.id],
    queryFn: () => getFolders(company.id),
    onSuccess: (res) => {
      if (res?.data?.records) setData(res?.data?.records);
    },
  });

  const sharedFoldersQuery = useQuery({
    queryKey: ["sharedFolders", company.id],
    queryFn: () => getSharedFolders(company.id),
    enabled:
      selectedFolderCompanyId === company.id &&
      selectedFolderId === "SHARED_FOLDERS",
  });

  const toggleExpand = () => {
    if (openedFolder === company.id) {
      setOpenedFolder(null);
    } else {
      setOpenedFolder(company.id);
    }
  };

  if (foldersQuery.isFetching || foldersQuery.isLoading) {
    return (
      <div className="mb-0">
        <FolderTreeSkeleton />
      </div>
    );
  }

  const renderActions = (
    setRenameFolderVisibleID: any,
    setNewFolderVisibleID: any = () => {},
    setDeleteFolderVisibleID: any = () => {}
  ) => (
    <Actions
      setManageAccessVisible={setManageAccessVisible}
      setRenameFolderVisibleID={() => {
        setRenameFolderVisibleID();
      }}
      setNewFolderVisibleID={() => {
        setNewFolderVisibleID();
      }}
      deleteFolder={() => {
        setDeleteFolderVisibleID();
      }}
    />
  );

  function deleteFolderFromData(folderId) {
    const removeFolderById = (folders, id) => {
      return folders
        .filter((folder) => folder.ID !== id)
        .map((folder) => ({
          ...folder,
          SubFolders: folder.SubFolders
            ? removeFolderById(folder.SubFolders, id)
            : [],
        }));
    };

    const updatedData = removeFolderById(data, folderId);
    setData(updatedData);
  }

  function updateFolderData(folders, folderID, key, newValue) {
    return folders?.map((folder) => {
      if (folder.ID === folderID) {
        // Update the specified key with the new value
        return { ...folder, [key]: newValue };
      } else if (folder.SubFolders && folder.SubFolders.length > 0) {
        // Recursively update SubFolders
        return {
          ...folder,
          SubFolders: updateFolderData(
            folder.SubFolders,
            folderID,
            key,
            newValue
          ),
        };
      }
      return folder;
    });
  }

  function updateFolder(folderId, key, newValue) {
    const updatedData = updateFolderData(data, folderId, key, newValue);
    setData(updatedData);
    return updatedData;
  }

  return (
    <div className="">
      <div
        className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={toggleExpand}
      >
        {openedFolder === company.id ? (
          <ArrowLinearIcon className="rotate-90 size-3 text-primary-600" />
        ) : (
          <ArrowLinearIcon className="size-3 text-primary-600" />
        )}
        <div className="relative group h-8 w-8 bg-primary-200 rounded-full overflow-hidden">
          {company.logo && <img src={company.logo} className="h-8 w-8" />}
          {mode === "MEDIA_LIBRARY" && (
            <div
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                // Add your edit functionality here
                setUpdateLogoCompanyId(company.id);
              }}
              className="absolute cursor-pointer inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          )}
        </div>
        <h2 className="font-semibold text-md text-primary-600">
          {company.value}
        </h2>
      </div>

      {openedFolder === company.id && (
        <div
          onClick={() => setIsMediaFoldersExpanded(!isMediaFoldersExpanded)}
          className="flex items-center gap-2 px-2 pl-4 mt-1 rounded-md cursor-pointer"
        >
          {isMediaFoldersExpanded ? (
            <ArrowLinearIcon className="rotate-90 size-3" />
          ) : (
            <ArrowLinearIcon className="size-3" />
          )}
          <FolderOpenIcon className={"h-4"} />
          <h2 className="text-md">Company Media</h2>
        </div>
      )}

      {openedFolder === company.id && isMediaFoldersExpanded && (
        <div className="pt-0 pl-8"> 

          {foldersQuery.isSuccess && (
            <FolderTree
              deleteFolderFromData={deleteFolderFromData}
              updateFolderData={updateFolder}
              parentFolderId={null}
              renderActions={renderActions}
              refetch={foldersQuery.refetch}
              company={company.id}
              level={0}
              folders={data}
              handleFolderSelect={handleFolderSelect}
              selectedFolderId={selectedFolderId}
            />
          )}
        </div>
      )}

      {openedFolder === company.id && (
        <div
          onClick={() => {
            setIsShareExpanded(!isShareExpanded);
            handleFolderSelect({ ID: "SHARED_FOLDERS", company: company.id });
          }}
          className="flex items-center gap-2 px-2 pt-2 pl-4 pb-2 rounded-md cursor-pointer"
        >
          {isShareExpanded ? (
            <ArrowLinearIcon className="rotate-90 size-3" />
          ) : (
            <ArrowLinearIcon className="size-3" />
          )}
          <GlobalIcon className="h-4" />
          <h2 className="text-md">Shared Items</h2>
        </div>
      )}

      {/* NEW IMPLEMENTATION */} 
      {openedFolder === company.id &&
        isShareExpanded &&
        sharedFoldersQuery.data?.data?.records?.map(
          (companyInstance, index) => (
            <SharedCompanyFolder
              selectedFolderId={selectedFolderId}
              handleFolderSelect={handleFolderSelect}
              key={index}
              data={companyInstance}
            />
          )
        )}

      {/* END OF NEW IMPLEMENTATION */}

      {/* {openedFolder === company.id && isShareExpanded && (
        <div
          onClick={() => {
            handleFolderSelect({ ID: "SHARED_FOLDERS", company: company.id });
            setIsSharedFoldersExpanded(!isSharedFoldersExpanded);
          }}
          className="flex items-center gap-2 pt-2 pl-8 rounded-md cursor-pointer"
        >
          {isSharedFoldersExpanded ? (
            <ArrowLinearIcon className="rotate-90 size-3" />
          ) : (
            <ArrowLinearIcon className="size-3" />
          )}
          <FolderOpenIcon className={"h-4"} />
          Folders
        </div>
      )}

      {openedFolder === company.id &&
        isSharedFoldersExpanded &&
        sharedFoldersQuery.isLoading && <FolderTreeSkeleton />}

      {openedFolder === company.id &&
        isShareExpanded &&
        isSharedFoldersExpanded && (
          <div className="pl-10">
            {sharedFoldersQuery.isSuccess &&
              sharedFoldersQuery.data?.data?.records.map((folder) => (
                <>
                  <div key={folder.ID}>{folder.Company}</div>
                  <FolderTree
                    // renderActions={renderActions}
                    renderActions={() => {}}
                    refetch={sharedFoldersQuery.refetch}
                    company={company.id}
                    level={0}
                    folders={sharedFoldersQuery.data?.data?.records}
                    handleFolderSelect={handleFolderSelect}
                    selectedFolderId={selectedFolderId}
                  />
                </>
              ))}
          </div>
        )}

      {openedFolder === company.id && isShareExpanded && (
        <div
          onClick={() =>
            handleFolderSelect({ ID: "SHARED_IMAGES", company: company.id })
          }
          className={`pl-12 pt-2 flex flex-row items-center cursor-pointer ${
            selectedFolderId === "SHARED_IMAGES" &&
            selectedFolderCompanyId === company.id &&
            "bg-primary-100"
          }`}
        >
          <Waypoints className="h-4 ml-1" />
          Images
        </div>
      )} */}

      {openedFolder === company.id && (
        <div
          onClick={() =>
            handleFolderSelect({
              ID: "ARCHIVES",
              company: company.id,
              CompanyID: company.id,
            })
          }
          className={`pl-6 py-0 mb-2 flex gap-1.5 flex-row items-center cursor-pointer ${
            selectedFolderId === "ARCHIVES" &&
            selectedFolderCompanyId === company.id &&
            "bg-primary-100"
          }`}
        >
          <div className="w-[11px]" />
          <ArchiveIcon className="size-3.5 mr-2" />
          Archived Files
        </div>
      )}
    </div>
  );
};

export default CompanyFolder;
