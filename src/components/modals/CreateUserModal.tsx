import React, { useEffect, useState } from "react";
import Modal from "../hoc/Modal";
import { ButtonComponent } from "../common/Button";
import { PencilIcon, TrashIcon, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import TextInput from "../InputElements/TextInput";
import SelectInput from "../InputElements/SelectInput";
import { useSelector } from "react-redux";
import { createUser, deleteUser, updateUser } from "../../screens/Settings/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MediaPicker from "../MediaPicker";
import useToast from "../../hooks/useToast";
import ConfirmationModal from "./Confirmation";
import VerifyCode from "./VerifyCode";

interface ManageAccessProps {
  visible: boolean;
  onClose: Function;
  type: "create" | "edit";
  editUserData: any;
}

interface SelectOption {
  value: string;
  label: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: SelectOption | null;
  company: SelectOption | null;
}

const ManageAccess: React.FC<ManageAccessProps> = ({
  visible,
  onClose,
  type,
  editUserData,
}) => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const { allCompanies } = useSelector((state) => state.companies);
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>();

  const genderOptions = [
    { value: "1", label: t("labels.female") },
    { value: "2", label: t("labels.male") },
    { value: "3", label: t("labels.diverse") },
  ];

  const companyOptions = allCompanies.map((company) => ({
    value: company.id,
    label: company.value,
  }));

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (res) => {
      if (res?.data?.requireOTP) {
        setShowVerifyCodeModal(true);
      } else {
        queryClient.invalidateQueries({ queryKey: ["companyUsers"] });
        showToast(t("successMessages.createdNewUserSuccessfully"), {
          position: "top-right",
          hideProgressBar: true,
        });
        handleClose();
      }
    },
    onError: (err) => {
      if (err.response.data?.data?.errorCode === "DUPLICATE_ERROR") {
        showToast(t("errorMessages.duplicateUser"), {
          position: "top-right",
          hideProgressBar: true,
        });
      } else if (err.response.data?.data?.errorCode === "INVALID_OTP") {
        showToast(t("errorMessages.invalidOtp"), {
          position: "top-right",
          hideProgressBar: true,
        });
      } else {
        showToast(t("errorMessages.errorOccurred"), {
          position: "top-right",
          hideProgressBar: true,
        });
      }
    },
  });

  const editUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (res) => {
      if (res?.data?.requireOTP) {
        setShowVerifyCodeModal(true);
      } else {
        queryClient.invalidateQueries({ queryKey: ["companyUsers"] });
        showToast(t("successMessages.userDetailsUpdatedSuccessfully"), {
          position: "top-right",
          hideProgressBar: true,
        });
        handleClose();
      }
    },
    onError: (err) => {
      if (err.response.data?.data?.errorCode === "INVALID_OTP") {
        showToast(t("errorMessages.invalidOtp"), {
          position: "top-right",
          hideProgressBar: true,
        });
      } else {
        showToast(t("errorMessages.errorOccurred"), {
          position: "top-right",
          hideProgressBar: true,
        });
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      showToast(t("successMessages.userDeletedSuccessfully"), {
        position: "top-right",
        hideProgressBar: true,
      });
      queryClient.invalidateQueries({ queryKey: ["companyUsers"] });
      setDeleteUserId(null);
      handleClose();
    },
    onError: () => {
      showToast(t("errorMessages.errorOccurred"), {
        position: "top-right",
        hideProgressBar: true,
      });
    },
  });

  const getTransformedData = (data: FormData) => {
    let result = {
      Email: data.email,
      FirstName: data.firstName,
      LastName: data.lastName,
      Gender: data.gender?.value,
      companies: data.company.map((item) => item.value),
      Avatar: avatarImage?.URL,
    };
    if (data.OTP) result.OTP = data.OTP;
    return result;
  };

  const onSubmit = (data: FormData) => {
    let finalData = getTransformedData(data);
    if (editUserData) {
      editUserMutation.mutate({ data: { ...finalData, ID: editUserData.ID } });
    } else {
      createUserMutation.mutate({ data: finalData });
    }
  };

  const handleClose = () => {
    reset();
    setAvatarImage(null);
    setShowMediaPicker(false);
    setShowVerifyCodeModal(false);
    onClose();
  };

  useEffect(() => {
    if (editUserData) {
      const { Email, FirstName, LastName, Companies, Gender } = editUserData;
      if (Email) {
        setValue("email", Email);
      }
      if (FirstName) {
        setValue("firstName", FirstName);
      }
      if (LastName) {
        setValue("lastName", LastName);
      }
      let company = Companies.map((item) => item.ID);
      let newCompanyArray = companyOptions.filter((item) =>
        company.includes(item.value)
      );
      if (!!newCompanyArray) {
        setValue("company", newCompanyArray);
      }
      if (Gender) {
        setValue(
          "gender",
          genderOptions.find(
            (item) => parseInt(item.value) === parseInt(Gender)
          ) || genderOptions[0]
        );
      }
    }
  }, [editUserData]);

  return (
    <>
      {showVerifyCodeModal && (
        <VerifyCode
          loading={createUserMutation.isLoading || editUserMutation.isLoading}
          visible={showVerifyCodeModal}
          onClose={() => setShowVerifyCodeModal(false)}
          onConfirm={(code) => {
            onSubmit({ ...getValues(), OTP: code });
          }}
          requestNewOtp={() => {
            setShowVerifyCodeModal(false);
            onSubmit(getValues());
          }}
        />
      )}
      <ConfirmationModal
        isLoading={deleteUserMutation.isLoading}
        type="delete"
        visible={deleteUserId !== null}
        title={t("strings.deleteUser")}
        text={t("strings.deleteUserText")}
        onClose={() => setDeleteUserId(null)}
        onConfirm={() => {
          deleteUserMutation.mutate({ id: deleteUserId });
        }}
      />
      <MediaPicker
        aspectWidth={1}
        aspectHeight={1}
        companyId={null}
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={setAvatarImage}
      />
      <Modal size="xl" isVisible={visible} onClose={handleClose}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-w-full gap-4"
        >
          <div className="flex items-center">
            <div>
              <div className="rounded-full min-w-14 size-14 bg-primary-500 relative group">
                {editUserData?.Avatar ? (
                  <img
                    src={avatarImage?.URL || editUserData.Avatar}
                    className="size-14 rounded-full"
                  />
                ) : (
                  <img
                    src={
                      avatarImage
                        ? avatarImage.URL
                        : `https://ui-avatars.com/api/?name=${
                            watch("firstName") || ""
                          }+${
                            watch("lastName") || ""
                          }&background=177EE0&color=fff`
                    }
                    className="size-14 rounded-full"
                  />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowMediaPicker(true);
                  }}
                  className="absolute bg-gray-500 bg-opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white hover:text-white p-4 transform rounded-full hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <PencilIcon className="size-4" />
                </button>
              </div>
            </div>
            <div className="flex pl-4 items-center">
              <p className="font-semibold">
                {editUserData !== null
                  ? t("strings.editUser")
                  : t("strings.createNewUser")}
              </p>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: t("errorMessages.firstNameRequired") }}
                render={({ field }) => (
                  <TextInput
                    id="firstName"
                    type="text"
                    defaultValue={getValues("firstName")}
                    register={() => field.ref}
                    label={t("labels.firstName")}
                    placeholder={t("labels.firstName")}
                    errorMessages={[errors.firstName?.message || ""]}
                    {...field}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                rules={{ required: t("errorMessages.lastNameRequired") }}
                render={({ field }) => (
                  <TextInput
                    id="lastName"
                    type="text"
                    defaultValue={getValues("lastName")}
                    register={() => field.ref}
                    label={t("labels.lastName")}
                    placeholder={t("labels.lastName")}
                    errorMessages={[errors.lastName?.message || ""]}
                    {...field}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: t("errorMessages.emailRequired"),
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: t("errorMessages.emailInvalid"),
                  },
                }}
                render={({ field }) => (
                  <TextInput
                    id="email"
                    type="email"
                    defaultValue={getValues("email")}
                    register={() => field.ref}
                    label={t("labels.email")}
                    placeholder={t("labels.email")}
                    errorMessages={[errors.email?.message || ""]}
                    {...field}
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                rules={{ required: t("errorMessages.genderRequired") }}
                render={({ field }) => (
                  <SelectInput
                    id="gender"
                    selectedValue={field.value || ""}
                    label={t("labels.gender")}
                    placeholder={t("labels.selectGender")}
                    errorMessages={[errors.gender?.message || ""]}
                    options={genderOptions}
                    {...field}
                  />
                )}
              />
              <Controller
                name="company"
                control={control}
                rules={{ required: t("errorMessages.companyRequired") }}
                render={({ field }) => (
                  <SelectInput
                    isMulti={true}
                    id="company"
                    selectedValue={getValues("company")}
                    label={t("labels.company")}
                    placeholder={t("labels.selectCompany")}
                    errorMessages={[errors.company?.message || ""]}
                    options={companyOptions}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            {editUserData !== null && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="flex-grow"
              >
                <ButtonComponent
                  disabled={deleteUserMutation.isLoading}
                  buttonStyle="w-full"
                  colorScheme="transparent"
                  onClick={() => {
                    setDeleteUserId(editUserData.ID);
                  }}
                  icon={<TrashIcon className="size-6 text-danger-500" />}
                  // title={t("buttonLabels.delete")}
                  size="md"
                />
              </div>
            )}
            <ButtonComponent
              buttonStyle="w-full"
              colorScheme="light"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleClose();
              }}
              title={t("buttonLabels.cancel")}
              size="md"
            />
            <ButtonComponent
              disabled={
                createUserMutation.isLoading || editUserMutation.isLoading
              }
              loading={
                createUserMutation.isLoading || editUserMutation.isLoading
              }
              buttonStyle="w-full"
              colorScheme="primary"
              title={
                editUserData
                  ? t("buttonLabels.update")
                  : t("buttonLabels.create")
              }
              size="md"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageAccess;
