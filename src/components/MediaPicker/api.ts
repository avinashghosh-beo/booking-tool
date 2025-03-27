import { getRequest, postRequest, uploadFormData } from "../../api";
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

export const getImages = (
  company = null,
  folderId = null,
  limit = 100,
  offset = 0
) =>
  getRequest(ENDPOINTS.mediaImages, {
    params: {
      company,
      folderId,
      limit,
      offset,
    },
  });

export const createFolder = (data) => postRequest(ENDPOINTS.mediaFolders, data);

export const uploadImage = (data) => uploadFormData(ENDPOINTS.mediaImages, data);
