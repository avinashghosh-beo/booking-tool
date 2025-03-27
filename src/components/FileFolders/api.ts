import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../api";
import { ENDPOINTS } from "../../api/endpoints";

export const getFolders = (
  company = null,
  parentId = null,
  limit = 100,
  offset = 0
) =>
  getRequest(ENDPOINTS.mediaFolders, {
    params: { limit, offset, company, parentId },
  });

export const getSharedFolders = (company = null, limit = 100, offset = 0) =>
  getRequest(ENDPOINTS.sharedFolder, {
    params: {
      company,
      limit,
      offset,
    },
  });

export const createFolder = (data) => postRequest(ENDPOINTS.mediaFolders, data);
export const renameFolder = ({ folderId, title, company }) =>
  patchRequest(ENDPOINTS.mediaFolders + "/" + folderId + "/rename", {
    title: title,
    company: company,
  });

export const getAccessListFolder = (folderId) =>
  getRequest(ENDPOINTS.mediaFolders + "/" + folderId + "/access");

export const shareAccessFolder = ({ folderId, companyId }) => {
  return postRequest(ENDPOINTS.mediaFolders + "/" + folderId + "/share", {
    company: companyId,
  });
};
export const revokeAccessFolder = ({ folderId, companyId }) => {
  return deleteRequest(
    ENDPOINTS.mediaFolders + "/" + folderId + "/share/" + companyId
  );
};

export const getAccessListImage = (imageId) =>
  getRequest(ENDPOINTS.mediaImages + "/" + imageId + "/access");

export const shareAccessImage = ({ imageId, companyId }) => {
  return postRequest(ENDPOINTS.mediaImages + "/" + imageId + "/share", {
    company: companyId,
  });
};
export const revokeAccessImage = ({ imageId, companyId }) => {
  return deleteRequest(
    ENDPOINTS.mediaImages + "/" + imageId + "/share/" + companyId
  );
};

export const updateCompanyLogo = (data) =>
  putRequest(ENDPOINTS.companyLogo, data);
