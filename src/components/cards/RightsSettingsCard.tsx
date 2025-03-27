import React, { useState } from "react";
import Chip from "../common/Chip";
import ToggleSwitch from "../common/ToggleSwitch";
import { useTranslation } from "react-i18next";
import { AddIcon, AddOutlineIcon, PencilIcon, TrashIcon } from "../icons";
import { Check, X } from "lucide-react";
import TextInput from "../InputElements/TextInput";
import { ButtonComponent } from "../common/Button";

const RightsSettingsCard = ({
  user,
  handlePermissionChange,
  disabled,
  setShowCompaniesModal,
  initiateAvatarUpdate,
  handleDeleteUser,
  handleDeleteCompanyFromUser,
  editUserData,
  setEditUserData,
}) => {
  const { t } = useTranslation();

  const permissionsArray = [
    {
      ID: "BookingRights",
      name: t("strings.bookingRights"),
      permissionStatus: user.LoginUserPermission?.BookingRights,
    },
    {
      ID: "ModifyExistingListings",
      name: t("strings.rightToModifyListings"),
      permissionStatus: user.LoginUserPermission?.ModifyExistingListings,
    },
    {
      ID: "EditRights",
      name: t("strings.rightToEditRights"),
      permissionStatus: user.LoginUserPermission?.EditRights,
    },
    {
      ID: "ModifyJobAdLayouts",
      name: t("strings.rightToModifyLayouts"),
      permissionStatus: user.LoginUserPermission?.ModifyJobAdLayouts,
    },
    {
      ID: "ViewInvoices",
      name: t("strings.rightToViewInvoices"),
      permissionStatus: user.LoginUserPermission?.ViewInvoices,
    },
    {
      ID: "CreateUsers",
      name: t("strings.rightToCreateUsers"),
      permissionStatus: user.LoginUserPermission?.CreateUsers,
    },
    {
      ID: "ModifyNotificationSettings",
      name: t("strings.modifyNotificationSettings"),
      permissionStatus: user.LoginUserPermission?.ModifyNotificationSettings,
    },
    {
      ID: "ModifyPackageSettings",
      name: t("strings.modifyPackageSettings"),
      permissionStatus: user.LoginUserPermission?.ModifyPackageSettings,
    },
  ];

  return (
    <>
      <div className="grid col-span-12 gap-4 p-6 md:col-span-6 lg:col-span-4 xl:col-span-3 bg-primary-50 border-primary-100 rounded-xl relative overflow-hidden">
        <div className="flex items-center gap-4 pb-4 mb-4 border-b relative">
          <div className="rounded-full min-w-14 size-14 bg-primary-300 relative">
            {user?.Avatar && (
              <img src={user.Avatar} className="size-14 rounded-full" />
            )}
          </div>
          <div className="grid gap-1 pr-8 min-w-0 max-w-full">
            <div className="truncate font-medium">{`${user.FirstName} ${user.LastName}`}</div>
            <div className="truncate text-sm text-gray-600">
              {user.Email || ""}
            </div>
            <div>
              <Chip showDot={false} type="primary">
                {user.UsertypeID === 2 ? "Manager" : "User"}
              </Chip>
            </div>
          </div>
          <div className="absolute right-0"> 
              <div
                className="cursor-pointer"
                onClick={() => setEditUserData(user)}
              >
                <PencilIcon className="h-4 w-4 text-primary-900" />
              </div> 
          </div>
        </div>

        {permissionsArray.map((permission) => (
          <div className="flex items-center justify-between">
            <div className="leading-loose grow text-black-800">
              {permission.name}
            </div>
            <div>
              <ToggleSwitch
                disabled={disabled}
                checked={permission.permissionStatus || false}
                onChange={(e) =>
                  handlePermissionChange(
                    user.ID,
                    permission.ID,
                    e.target.checked
                  )
                }
                label={permission.permissionStatus ? "On" : "Off"}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between pt-4 border-t border-primary-200">
          <p className="font-semibold text-primary-600">Responsible For:</p>
          <button
            onClick={() => setShowCompaniesModal(true)}
            className="flex items-center gap-1 font-medium text-primary-700"
          >
            <AddIcon />
            {t("screenNames.manageAccess")}
          </button>
        </div>
        <div className="flex flex-col flex-wrap h-44 overflow-y-auto">
          {user.Companies.map((company) => (
            <div
              key={company.ID}
              className="group flex items-center gap-2 w-fit bg-gray-100 rounded-lg px-2 py-1 pr-8 font-xs mb-2 cursor-pointer relative"
            >
              {company.logo && (
                <img
                  src={company.logo}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover"
                />
              )}
              <span className="text-sm">{company.Company}</span>
              {/* <button
                onClick={() => handleDeleteCompanyFromUser(company.ID)}
                className="opacity-0 group-hover:opacity-100 transition-opacity top-1 right-1 absolute bg-danger-600 text-white p-1 rounded-full hover:bg-danger-700"
              >
                <TrashIcon className="size-3" />
              </button> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const RightsSettingsCardSkeleton = () => {
  return (
    <div className="col-span-12 gap-4 p-6 md:col-span-6 lg:col-span-4 xl:col-span-3 bg-primary-50 border-primary-100 rounded-xl">
      <div className="animate-pulse h-16 w-full bg-gray-200 rounded-md"></div>
      <div className="border-primary-100 border-b h-2.5" />
      <div className="h-8" />
      <div className="animate-pulse h-8 w-full bg-gray-200 rounded-md mb-4" />
      <div className="animate-pulse h-8 w-full bg-gray-200 rounded-md mb-4" />
      <div className="animate-pulse h-8 w-full bg-gray-200 rounded-md mb-4" />
      <div className="animate-pulse h-8 w-full bg-gray-200 rounded-md mb-4" />
      <div className="animate-pulse h-8 w-full bg-gray-200 rounded-md mb-4" />
      <div className="animate-pulse h-8 w-full bg-gray-200 rounded-md mb-4" />
      <div className="border-primary-100 border-t h-4" />
      <div className="w-full flex justify-between gap-4">
        <div className="animate-pulse h-8 w-1/2 bg-gray-200 rounded-md mb-4" />
        <div className="animate-pulse h-8 w-1/2 bg-gray-200 rounded-md mb-4" />
      </div>
      <div className="">
        <div className="animate-pulse h-4 w-24 bg-gray-200 rounded-md mb-4" />
        <div className="animate-pulse h-4 w-32 bg-gray-200 rounded-md mb-4" />
        <div className="animate-pulse h-4 w-full bg-gray-200 rounded-md mb-4" />
      </div>
    </div>
  );
};

//create a new empty rights settingscard, with create user button

export const RightsSettingsCardCreateUser = ({
  setShowCreateUserModal,
}: {
  setShowCreateUserModal: (show: boolean) => void;
}) => {
  return (
    <div
      onClick={() => setShowCreateUserModal(true)}
      className="col-span-12 text-primary-800 hover:text-primary-600 hover:bg-primary-100 gap-4 p-6 md:col-span-6 lg:col-span-4 xl:col-span-3 bg-primary-50 border-primary-100 rounded-xl flex flex-col items-center justify-center"
    >
      <button className="flex items-center gap-2">
        <AddOutlineIcon className="size-12" />
      </button>
      <p>Create New User</p>
    </div>
  );
};

export default RightsSettingsCard;
