import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CompanyFolder from "./components/CompanyFolder";
import ManageAccess from "../modals/ManageAccess";
import MediaPicker from "../MediaPicker";
import { useMutation } from "@tanstack/react-query";
import { updateCompanyLogo } from "./api";
import { useAuth } from "../../contexts/AuthContext";
interface FileFoldersProps {
  handleFolderSelect: (folder: any) => void;
  selectedFolder: any;
  companyId: string | null;
  mode: "IMAGE_PICKER" | "MEDIA_LIBRARY";
}

const FileFolders = ({
  handleFolderSelect,
  selectedFolder,
  companyId = null,
  mode = "MEDIA_LIBRARY",
}: FileFoldersProps) => {
  const { patchCompanyLogo } = useAuth();
  const [updateLogoCompanyId, setUpdateLogoCompanyId] = useState(null);
  const [openedFolder, setOpenedFolder] = useState(null);
  const [manageAccessVisible, setManageAccessVisible] = useState(false);
  const { allCompanies } = useSelector((state: any) => state.companies);

  const companiesArray = useMemo(() => {
    if (companyId) {
      return allCompanies.filter((company: any) => company.id === companyId);
    }
    return allCompanies;
  }, [companyId, allCompanies]);

  const updateCompanyLogoMutation = useMutation({
    mutationFn: updateCompanyLogo,
    onSuccess: (res) => {
      if (res.status) {
        patchCompanyLogo(res.data.ID, res.data.Logo);
      }
    },
    onSettled: () => {
      setUpdateLogoCompanyId(null);
    },
  });

  const handleUpdateCompanyLogo = (image, id) => { 
    updateCompanyLogoMutation.mutate({
      Logo: image.URL + "?id=" + image.ID,
      companyId: id,
    });
  };

  useEffect(() => {
    if(mode === 'IMAGE_PICKER') {
      setOpenedFolder(companiesArray[0].id);
    }
  }, [companiesArray]);

  return (
    <>
      <MediaPicker
        companyId={updateLogoCompanyId || null}
        aspectWidth={1}
        aspectHeight={1}
        visible={updateLogoCompanyId !== null}
        onClose={() => setUpdateLogoCompanyId(null)}
        onSelect={handleUpdateCompanyLogo}
      />
      {selectedFolder && manageAccessVisible && (
        <ManageAccess
          type="FOLDER"
          itemName={selectedFolder?.Title}
          itemId={selectedFolder?.ID}
          visible={manageAccessVisible}
          onClose={() => setManageAccessVisible(false)}
        />
      )}
      {companiesArray.map((company: any) => (
        <CompanyFolder
          mode={mode}
          setUpdateLogoCompanyId={setUpdateLogoCompanyId}
          openedFolder={openedFolder}
          setOpenedFolder={setOpenedFolder}
          key={company.id}
          company={company}
          handleFolderSelect={handleFolderSelect}
          selectedFolderId={selectedFolder?.ID || null}
          selectedFolderCompanyId={selectedFolder?.company}
          setManageAccessVisible={setManageAccessVisible}
        />
      ))}
    </>
  );
};

export default FileFolders;
