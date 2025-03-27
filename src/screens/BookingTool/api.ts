import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";

export const fetchProductCategories = (offset = 0, limit = 10) =>
  getRequest(ENDPOINTS.productCatagories, {
    params: { offset: offset, limit: limit },
  });

export const fetchBundleCatagories = (offset = 0, limit = 10) =>
  getRequest(ENDPOINTS.bundleCatagories, {
    params: { offset: offset, limit: limit },
  });

export const fetchBundlesByCatagory = (params) =>
  getRequest(ENDPOINTS.bundles, {
    params: params,
  });

export const fetchFreePortalsByCatagory = (params) =>
  getRequest(ENDPOINTS.portalsFree, {
    params: params,
  });

export const fetchPaidPortalsByCatagory = (params) =>
  getRequest(ENDPOINTS.portalsPaid, {
    params: params,
  });

export const OrderAd = (data) => postRequest(ENDPOINTS.bookingToolOrder, data);

export const fetchInvoiceSettings = (params) =>
  getRequest(ENDPOINTS.invoiceSettings, {
    params: params,
  });

export const calculatePrice = (data) =>
  postRequest(ENDPOINTS.calculatePrice, data);

export const getPublicTemplates = (page = 0) =>
  getRequest(ENDPOINTS.publicTemplates, {
    params: { page: page, limit: 10 },
  });

export const getPrivateTemplates = (companyId, page = 0) =>
  getRequest(ENDPOINTS.privateTemplates, {
    params: { company: companyId, page: page, limit: 10 },
  });
