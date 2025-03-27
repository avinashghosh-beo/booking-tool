import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCompanyUsers, updateUserPermissions } from "../api";
import { useTranslation } from "react-i18next";
import RightsSettingsCard, {
  RightsSettingsCardCreateUser,
  RightsSettingsCardSkeleton,
} from "../../../components/cards/RightsSettingsCard";
import { useAuth } from "../../../contexts/AuthContext";
import ImageSelector from "../../../components/modals/ImageSelector";
import ConfirmationModal from "../../../components/modals/Confirmation";
import CreateUserModal from "../../../components/modals/CreateUserModal";
import UserCompanyAccess from "../../../components/modals/UserCompaniesAccess";
interface Company {
  ID: string;
  Company: string;
  logo: string | null;
}

interface UserPermissions {
  BookingRights: boolean;
  ViewInvoices: boolean;
  ModifyExistingListings: boolean;
  CreateUsers: boolean;
  EditRights: boolean;
  ModifyJobAdLayouts: boolean;
}

interface User {
  ID: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Gender: number;
  UsertypeID: number;
  IsActive: boolean;
  LoginUserPermission: UserPermissions;
  Companies: Company[];
}

interface CompanyUsersResponse {
  success: boolean;
  data: {
    totalRecords: number;
    records: User[];
  };
}

const RightsSettings = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const disabled = !auth?.user?.rights?.EditRights;
  const [editUserData, setEditUserData] = useState(null);
  const [deleteUserVisibleData, setDeleteUserVisibleData] = useState(null);
  const [deleteCompanyVisibleData, setDeleteCompanyVisibleData] =
    useState(null);
  const [updateAvatarUser, setUpdateAvatarUser] = useState(null);
  const [userCompaniesModalData, setUserCompaniesModalData] =
    useState<any>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const { data, isLoading, error } = useQuery<CompanyUsersResponse>({
    queryKey: ["companyUsers"],
    queryFn: () => fetchCompanyUsers(),
  }); 

  const updatePermissionsMutation = useMutation({
    mutationFn: (data: { LoginUserID: string } & Partial<UserPermissions>) =>
      updateUserPermissions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyUsers"] });
    },
  });

  const handleUpdateAvatarUser = (image) => {
    console.log(image);
    setUpdateAvatarUser(image);
  };

  const handlePermissionChange = (
    userId: string,
    permission: keyof UserPermissions,
    value: boolean
  ) => {
    updatePermissionsMutation.mutate({
      LoginUserID: userId,
      [permission]: value,
    });
  };

  const initiateAvatarUpdate = (userData) => {
    setUpdateAvatarUser(userData);
  };

  const handleDeleteUser = (userId) => {
    setDeleteUserVisibleData({ userId });
  };

  const handleDeleteCompanyFromUser = (companyID, userID) => {
    setDeleteCompanyVisibleData({ companyID, userID });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-6 overflow-hidden">
        <RightsSettingsCardSkeleton />
        <RightsSettingsCardSkeleton />
        <RightsSettingsCardSkeleton />
        <RightsSettingsCardSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>{t("strings.errorLoadingUsers")}</div>;
  }

  if (!data?.data?.records?.length) {
    return <div>{t("strings.noUsersFound")}</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-6 overflow-hidden">
      <CreateUserModal
        editUserData={editUserData}
        visible={showCreateUserModal || editUserData !== null}
        onClose={() => {
          setShowCreateUserModal(false);
          setEditUserData(null);
        }}
        type={editUserData !== null ? "edit" : "create"}
      />
      <ConfirmationModal
        title={t("strings.deleteCompany")}
        text={t("strings.deleteCompanyText")}
        visible={deleteCompanyVisibleData !== null}
        onClose={() => setDeleteCompanyVisibleData(null)}
        onConfirm={() => console.log("MUTATE", deleteCompanyVisibleData)}
        type="confirm"
      />
      <ConfirmationModal
        title={t("strings.deleteUser")}
        text={t("strings.deleteUserText")}
        visible={deleteUserVisibleData !== null}
        onClose={() => setDeleteUserVisibleData(null)}
        onConfirm={() => console.log("MUTATE", deleteUserVisibleData)}
        type="delete"
      />
      {updateAvatarUser !== null && (
        <ImageSelector
          visible={updateAvatarUser !== null}
          onClose={() => setUpdateAvatarUser(null)}
          onSelect={handleUpdateAvatarUser}
          isLoading={false}
          aspectWidth={1}
          aspectHeight={1}
        />
      )}
      {userCompaniesModalData !== null && (
        <UserCompanyAccess
          userData={userCompaniesModalData}
          visible={userCompaniesModalData !== null}
          onClose={() => setUserCompaniesModalData(null)}
        />
      )}
      {data.data.records.map((user) => (
        <RightsSettingsCard
          key={user.ID}
          editUserData={editUserData}
          setEditUserData={setEditUserData}
          initiateAvatarUpdate={() => initiateAvatarUpdate(user)}
          disabled={disabled}
          user={user}
          handlePermissionChange={handlePermissionChange}
          setShowCompaniesModal={() => setUserCompaniesModalData(user)}
          handleDeleteUser={() => handleDeleteUser(user.ID)}
          handleDeleteCompanyFromUser={(companyID) =>
            handleDeleteCompanyFromUser(companyID, user.ID)
          }
        />
      ))}
      {auth?.user?.rights?.CreateUsers && (
        <RightsSettingsCardCreateUser
          setShowCreateUserModal={() => {
            setShowCreateUserModal(true);
            setEditUserData(null);
          }}
        />
      )}
    </div>
  );
};

export default RightsSettings;
