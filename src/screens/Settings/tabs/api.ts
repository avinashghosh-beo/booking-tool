import {
  getRequest,
  putRequest,
  postRequest,
  deleteRequest,
} from "../../../api";
import { ENDPOINTS } from "../../../api/endpoints";

export const fetchCompanyUsers = () => getRequest(ENDPOINTS.companyUsers);
export const updateUserPermissions = (params: any) =>
  putRequest(ENDPOINTS.updateUserPermissions, params);
export const fetchBundles = (companyId: string) =>
  getRequest(ENDPOINTS.companyBundles + "/" + companyId);

export const updateNotificationSettings = (params: any) =>
  putRequest(ENDPOINTS.updateNotificationSettings, params);

export interface NotificationGroup {
  id: string;
  name: string;
  notificationTypeId: string;
  companies: Company[];
  recipients: Recipient[];
}

export interface Company {
  id: string;
  name: string;
}

export interface Recipient {
  id: string;
  type: "USER" | "EMAIL";
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface NotificationType {
  id: string;
  name: string;
  description: string;
  groups: NotificationGroup[];
}

export interface NotificationSettingsResponse {
  status: number;
  data: {
    records: NotificationType[];
  };
}

export interface CreateNotificationGroupParams {
  name: string;
  notificationTypeId: string;
  companies: string[];
  recipients: string[];
}

export const addCompaniesToGroup = (
  groupId: string,
  companies: string[]
): Promise<NotificationGroup> =>
  postRequest(`${ENDPOINTS.notificationGroups}/${groupId}/companies`, {
    companies,
  });
