import { getRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";

export const fetchContacts = (params) => getRequest(ENDPOINTS.contacts, {params});
