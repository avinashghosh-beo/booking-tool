import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";

export const fetchCompanyUsers = () => getRequest(ENDPOINTS.companyUsers);

export const fetchNotificationSettings = ({ company }) =>
  getRequest(ENDPOINTS.notificationSettings, { params: { company } });

export const updateUserPermissions = (params: any) =>
  putRequest(ENDPOINTS.updateUserPermissions, params);

export const fetchBundles = (
  companyIds: string[],
  BundleCategory: string,
  OwnedBy: string = "company"
) =>
  getRequest(ENDPOINTS.bundles, {
    params: {
      company: companyIds,
      BundleCategory: BundleCategory === "ALL" ? "" : BundleCategory,
      OwnedBy,
    },
  });

export const createBundle = (data: any) => postRequest(ENDPOINTS.bundles, data);

export const updateBundle = (data: any) =>
  putRequest(ENDPOINTS.bundles + "/" + data.bundleId, data);

export const deleteBundle = (bundleId: string) =>
  deleteRequest(ENDPOINTS.bundles + "/" + bundleId);

export const addCompaniesToGroup = (groupId: string, companyId: string) =>
  postRequest(ENDPOINTS.notificationGroups + "/" + groupId + "/companies", {
    companies: [companyId],
  });

export const deleteCompaniesFromGroup = (groupId: string, companyId: string) =>
  deleteRequest(ENDPOINTS.notificationGroups + "/" + groupId + "/companies", {
    companies: [companyId],
  });

export const addRecipientsToGroup = (groupId: string, recipientId: string) =>
  postRequest(ENDPOINTS.notificationGroups + "/" + groupId + "/recipients", {
    recipients: [recipientId],
  });

export const deleteRecipientsFromGroup = (groupId: string, recipient: string) =>
  deleteRequest(ENDPOINTS.notificationGroups + "/" + groupId + "/recipients", {
    recipients: [recipient],
  });

export const getRecipients = () => getRequest(ENDPOINTS.recipientUsers);

export const createNotificationGroup = (data: any) =>
  postRequest(ENDPOINTS.notificationGroups, data);

export const deleteNotificationGroup = (groupId: string) =>
  deleteRequest(ENDPOINTS.notificationGroups + "/" + groupId);

export const fetchBundleCatagories = (
  selectedCompanies,
  catagoryType = "company",
  skip = 0,
  limit = 10
) =>
  getRequest(ENDPOINTS.bundleCatagories, {
    params: {
      company: selectedCompanies,
      CategoryType: catagoryType,
      skip: skip,
      limit: limit,
    },
  });

export const createBundleCatagory = (data) =>
  postRequest(ENDPOINTS.bundleCatagories, data);

export const deleteBundleCatagory = (id) =>
  deleteRequest(ENDPOINTS.bundleCatagories + "/" + id);

export const updateBundleCatagory = ({ id, data }) =>
  putRequest(ENDPOINTS.bundleCatagories + "/" + id, data);

export const disableAllBundles = ({ enabled, CompanyID }) =>
  putRequest(ENDPOINTS.disableAllBundles + "/" + CompanyID, {
    enabled,
  });

export const toggleBundleVisibility = ({ bundleId, CompanyID, enabled }) =>
  putRequest(ENDPOINTS.bundlesToggle + "/" + bundleId, {
    CompanyID,
    enabled,
  });

export const fetchBundleAccess = (bundleId: string) =>
  getRequest(ENDPOINTS.bundleAccess + "/" + bundleId);

export const createUser = ({ data }) => postRequest(ENDPOINTS.user, data);

export const updateUser = ({ data }) => putRequest(ENDPOINTS.user, data);

export const deleteUser = ({ id }) => deleteRequest(ENDPOINTS.user, { ID: id });

export const addCompanyAccessToUser = (data) =>
  postRequest(ENDPOINTS.addCompanyAccess, { ...data });

export const removeCompanyAccessFromUser = (data) =>
  postRequest(ENDPOINTS.removeCompanyAccess, { ...data });

export const getPublicBundleStatus = () =>
  getRequest(ENDPOINTS.publicBundleStatus);

export const addFavouriteBundle = ({ bundleId, companyId }) =>
  postRequest(ENDPOINTS.favouriteBundles + "/" + bundleId, {
    companyId: companyId,
  });

export const getFavouriteBundles = ({ companyIds }) =>
  getRequest(ENDPOINTS.favouriteBundles, { company: companyIds });

export const getFavouriteBundle = ({ companyId }) =>
  getRequest(ENDPOINTS.favouriteBundle + "?companyId=" + companyId);
