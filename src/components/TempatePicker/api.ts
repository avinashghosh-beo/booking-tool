import { getRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";

export const getPrivateTemplates = () => getRequest(ENDPOINTS.privateTemplates);

export const getPublicTemplates = () => getRequest(ENDPOINTS.publicTemplates);
