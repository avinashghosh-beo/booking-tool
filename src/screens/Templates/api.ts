import { getRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";

export const fetchTemplates = (params) => getRequest(ENDPOINTS.templates, {params});
