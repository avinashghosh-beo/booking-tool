import { getRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";

export const fetchFixedContingents = (params) =>
  getRequest(ENDPOINTS.fixedContingents, { params });

export const fetchBudgetContingents = (params) =>
  getRequest(ENDPOINTS.budgetContingents, { params });

export const fetchFreeContingents = (params) =>
  getRequest(ENDPOINTS.freeContingents, { params });
