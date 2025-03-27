import React from "react";
import { AddOutlineIcon, ArrowLinearIcon, FolderOpenIcon } from "../../icons";
import TextInput from "../../InputElements/TextInput";
import { useMutation } from "@tanstack/react-query";
import { createFolder, getFolders, renameFolder } from "../api";
import Skeleton from "react-loading-skeleton";
import { Check, Share2 } from "lucide-react";
import ConfirmationModal from "../../modals/Confirmation";
import { useTranslation } from "react-i18next";
import { deleteFolder } from "../../../screens/MediaLibrary/api";
import useToast from "../../../hooks/useToast";

interface FolderItem {
  ID: number;
  name: string;
  SubFolders: FolderItem[];
}

interface FolderTreeProps {
  folders: FolderItem[];
  level?: number;
  handleFolderSelect?: (folder: FolderItem) => void;
  selectedFolderId?: number | null;
  company?: any;
  refetch?: () => void;
  parentFolderId?: number;
  renderActions?: () => void;
  updateFolderData?: () => void;
  deleteFolderFromData?: (id: number) => void;
  mode?: "COMPANY_FOLDERS" | "SHARED_FOLDERS";
}

const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  level = 0,
  handleFolderSelect = () => {},
  selectedFolderId,
  company,
  refetch = () => {},
  parentFolderId,
  renderActions = () => {},
  updateFolderData = () => {},
  deleteFolderFromData = (id: number) => {},
  mode = "COMPANY_FOLDERS",
}) => {
  const showToast = useToast();
  const { t } = useTranslation();
  const [newFolderName, setNewFolderName] = React.useState("");
  const [newFolderVisibleID, setNewFolderVisibleId] = React.useState(null);
  const [renameFolderName, setRenameFolderName] = React.useState("");
  const [renameFolderVisibleID, setRenameFolderVisibleID] =
    React.useState(null);
  const [expandedFolders, setExpandedFolders] = React.useState<number[]>([]);
  const [deleteFolderVisibleID, setDeleteFolderVisibleID] =
    React.useState(null);

  const getChildFolderMutation = useMutation({
    mutationFn: (folderId: number) => getFolders(company, folderId),
    onSuccess: (res) => {
      if (res?.data?.records && res.data.records.length > 0) {
        updateFolderData(
          res?.data?.records[0]?.FolderParent,
          "SubFolders",
          res?.data?.records
        );
      }
    },
  });

  const toggleFolder = (folderId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    //with folderID fetch the child folders from the API
    if (level > 0) {
      getChildFolderMutation.mutate(folderId);
    }
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  function addFolderToParent(parentId: number, folder: any) {
    let newSubFoldersArray = [
      ...folders.find((f) => f.ID === parentId)?.SubFolders,
    ];
    newSubFoldersArray.push(folder);
    updateFolderData(parentId, "SubFolders", newSubFoldersArray);
  }

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: (res) => {
      refetch();
      setNewFolderVisibleId(null);
      setNewFolderName("");
      addFolderToParent(res?.data?.FolderParent, res?.data);
      //Disabled for now as we dont want to refetch the folders each time we create a new folder
      // refetch();
    },
  });

  const renameFolderMutation = useMutation({
    mutationFn: renameFolder,
    onSuccess: () => {
      setRenameFolderVisibleID(null);
      setRenameFolderName("");
      refetch();
    },
  });

  const handleCreateFolder = (
    folderName: string,
    childLevel: number = 0,
    parentID: number = parentFolderId || 0
  ) => {
    if (childLevel === 0) {
      createFolderMutation.mutate({
        Title: folderName,
        AccessType: "company",
        company: company,
      });
    } else {
      createFolderMutation.mutate({
        Title: folderName,
        AccessType: "company",
        company: company,
        FolderParent: parentID,
      });
    }
  };

  const handleRenameFolder = (folderName: string) => {
    renameFolderMutation.mutate({
      folderId: renameFolderVisibleID,
      title: folderName,
      company: company,
    });
  };

  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      deleteFolderFromData(deleteFolderVisibleID);
      setDeleteFolderVisibleID(null);
      refetch();
    },
    onError: (err) => {
      if (err.response.data?.data?.errorMessage) {
        showToast(err.response.data?.data?.errorMessage, {
          position: "top-right",
          hideProgressBar: true,
        });
      } else {
        showToast(t("errorMessages.errorOccurred"), {
          position: "top-right",
          hideProgressBar: true,
        });
      }
    },
  });

  return (
    <>
      <ConfirmationModal
        isLoading={deleteFolderMutation.isLoading}
        visible={deleteFolderVisibleID !== null}
        title={t("strings.deleteFolder")}
        text={t("strings.deleteFolderText")}
        onClose={() => setDeleteFolderVisibleID(null)}
        onConfirm={() =>
          deleteFolderMutation.mutate({ id: deleteFolderVisibleID })
        }
        type="delete"
      />
      <ul className={mode !== "SHARED_FOLDERS" && level === 0 ? "pt-2" : ""}>
        <li className="flex items-center gap-2 pl-10 ml-2 border-l">
          {mode === "COMPANY_FOLDERS" &&
            newFolderVisibleID !== null &&
            newFolderVisibleID === parentFolderId && (
              <TextInput
                onBlur={() => {
                  setNewFolderVisibleId(null);
                }}
                size="sm"
                placeholder="New Folder"
                errorMessages={[]}
                register={() => {}}
                id="newFolder"
                type="text"
                onChange={(e) => setNewFolderName(e)}
                onButtonClick={() =>
                  handleCreateFolder(newFolderName, level + 1, parentFolderId)
                }
                buttonLoading={createFolderMutation.isLoading}
                buttonIcon={<AddOutlineIcon className={"size-6"} />}
              />
            )}
        </li>
        {mode === "COMPANY_FOLDERS" &&
          level !== 0 &&
          newFolderVisibleID === null && (
            <li
              onClick={() => {
                setNewFolderVisibleId(parentFolderId);
              }}
              className="flex items-center gap-2 pt-1 pl-0 cursor-pointer border-l ml-2"
            >
              <div className="size-2"></div>
              <div className="text-black pr-1">
                <AddOutlineIcon className={"size-4 text-black-900"} />
              </div>
              <span>New Folder</span>
            </li>
          )}
        {folders?.map((folder) => (
          <React.Fragment>
            <li
              key={folder.ID}
              className={`${level !== 0 ? "border-l ml-2" : "pl-2"}`}
            >
              {renameFolderVisibleID === folder.ID ? (
                <TextInput
                  onBlur={() => setRenameFolderVisibleID(null)}
                  size="sm"
                  placeholder="Folder name"
                  errorMessages={[]}
                  register={() => {}}
                  id="newFolder"
                  type="text"
                  defaultValue={renameFolderName}
                  onChange={(e) => setRenameFolderName(e)}
                  onButtonClick={() => handleRenameFolder(renameFolderName)}
                  buttonLoading={createFolderMutation.isLoading}
                  buttonIcon={<Check className={"size-6"} />}
                />
              ) : (
                <div
                  onClick={(e) => {
                    handleFolderSelect(folder);
                    toggleFolder(folder.ID, e);
                  }}
                  className={`cursor-pointer ${level !== 0 ? "pl-4" : ""}`}
                >
                  <div
                    className={`flex gap-x-2 py-1 ${
                      selectedFolderId === folder.ID ? "bg-primary-100" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <button
                        className="mr-1 p-0.5 hover:bg-gray-200 rounded"
                        onClick={(e) => toggleFolder(folder.ID, e)}
                      >
                        {expandedFolders.includes(folder.ID) ? (
                          <ArrowLinearIcon className="rotate-90 size-3" />
                        ) : (
                          <ArrowLinearIcon className="size-3" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center">
                      <FolderOpenIcon className={"size-4"} />
                    </div>
                    <div className="flex-1 truncate whitespace-nowrap">
                      {folder.Title}
                    </div>
                    {folder.sharedCount > 0 && (
                      <div className="flex items-center gap-x-1">
                        <div className="p-1 px-2 rounded-full bg-primary-500 text-white font-medium text-xs flex items-center justify-center">
                          <Share2 className="size-2 mr-2" />
                          {folder.sharedCount}
                        </div>
                      </div>
                    )}
                    {selectedFolderId === folder.ID && (
                      <div className="pr-1 flex items-center gap-x-1">
                        {renderActions(
                          () => {
                            setRenameFolderVisibleID(folder.ID);
                            setRenameFolderName(folder.Title);
                          },
                          () => {
                            handleFolderSelect(folder);
                            setNewFolderVisibleId(folder.ID);
                          },
                          () => {
                            setDeleteFolderVisibleID(folder.ID);
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {expandedFolders.includes(folder.ID) && (
                <div className={`${level > 0 ? "pl-4" : "pl-0"}`}>
                  <FolderTree
                    mode={mode}
                    updateFolderData={updateFolderData}
                    renderActions={renderActions}
                    refetch={refetch}
                    company={company}
                    parentFolderId={folder.ID}
                    folders={folder?.SubFolders}
                    level={level + 1}
                    handleFolderSelect={handleFolderSelect}
                    selectedFolderId={selectedFolderId}
                  />
                </div>
              )}
            </li>
            <li className="flex items-center gap-2 pl-10 ml-2 border-l">
              {newFolderVisibleID === folder.ID && (
                <TextInput
                  onBlur={() => {
                    setNewFolderVisibleId(null);
                  }}
                  size="sm"
                  placeholder="New Folder"
                  errorMessages={[]}
                  register={() => {}}
                  id="newFolder"
                  type="text"
                  onChange={(e) => setNewFolderName(e)}
                  onButtonClick={() =>
                    handleCreateFolder(newFolderName, level + 1, folder.ID)
                  }
                  buttonLoading={createFolderMutation.isLoading}
                  buttonIcon={<AddOutlineIcon className={"size-6"} />}
                />
              )}
            </li>
          </React.Fragment>
        ))}

        {level === 0 && mode === "COMPANY_FOLDERS" && (
          <li
            onClick={() => {
              setNewFolderVisibleId("PARENT");
            }}
            className="flex items-center gap-2 pt-1 pl-3 cursor-pointer"
          >
            <div className="size-4"></div>
            <div className="text-black">
              <AddOutlineIcon className={"size-4"} />
            </div>
            <span>New Folder</span>
          </li>
        )}

        {newFolderVisibleID === "PARENT" && (
          <li className="flex items-center gap-2 pt-1 pl-10">
            <TextInput
              onBlur={() => {
                setNewFolderVisibleId(null);
              }}
              size="sm"
              placeholder="New Folder"
              errorMessages={[]}
              register={() => {}}
              id="newFolder"
              type="text"
              onChange={(e) => setNewFolderName(e)}
              onButtonClick={() => handleCreateFolder(newFolderName, 0, 0)}
              buttonLoading={createFolderMutation.isLoading}
              buttonIcon={<AddOutlineIcon className={"size-6"} />}
            />
          </li>
        )}
      </ul>
    </>
  );
};

export default FolderTree;

export const FolderTreeSkeleton = () => {
  return (
    <div className="w-86">
      <Skeleton height={30} width={312} />
      <Skeleton height={30} width={312} />
      <Skeleton height={30} width={312} />
      <Skeleton height={30} width={312} />
      <Skeleton height={30} width={312} />
      <Skeleton height={30} width={312} />
      <Skeleton height={30} width={312} />
      <Skeleton height={30} width={312} />
    </div>
  );
};
