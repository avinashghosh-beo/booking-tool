import { postRequest } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";

export const validatePayment = (data) =>
  postRequest(ENDPOINTS.validatePayment, data);
