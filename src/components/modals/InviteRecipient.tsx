import React, { useLayoutEffect, useState, KeyboardEvent } from "react";
import Modal from "../hoc/Modal";
import { useTranslation } from "react-i18next";
import { ButtonComponent, SelectButton } from "../common/Button";
import TextInput from "../InputElements/TextInput";
import SelectInput from "../InputElements/SelectInput";
import { getRequest } from "../../api";
import { getRecipients } from "../../screens/Settings/api";
import { useQuery } from "@tanstack/react-query";

const InviteRecipient = ({ isVisible, onClose, loading }) => {
  const { t } = useTranslation();
  const [inviteType, setInviteType] = useState("email");
  const [inputValue, setInputValue] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const { data: users, isSuccess } = useQuery({
    queryKey: ["users"],
    queryFn: () => getRecipients(),
    select: (data) => {
      return data.data.records.map((user) => {
        return {
          label: user.Name,
          value: user.ID,
        };
      });
    },
    enabled: !!isVisible,
  });

  const handleClose = () => {
    onClose();
    setInputValue("");
    setErrorMessages([]);
  };

  const handleConfirm = () => {
    if (inputValue === "" && !selectedUser) return;

    if (inviteType === "email" && !validateEmail(inputValue)) {
      setErrorMessages([t("errorMessages.emailInvalid")]);
      return;
    }

    if (inviteType === "email") {
      onClose(inputValue, inviteType);
    } else {
      onClose(selectedUser?.value, inviteType, selectedUser?.label);
    }
    setInputValue("");
    setErrorMessages([]);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Clear error messages when user starts typing
    if (errorMessages.length > 0) {
      setErrorMessages([]);
    }
  };

  return (
    <Modal size="sm" isVisible={isVisible} onClose={handleClose}>
      <>
        <div className="grid max-w-full gap-4 py-4">
          <h1>{t("screenNames.inviteRecipient")}</h1>
        </div>
        <div className="flex gap-2 pb-4">
          <SelectButton
            text="Email"
            selected={inviteType === "email"}
            onSelect={() => {
              setInviteType("email");
              setInputValue("");
              setErrorMessages([]);
            }}
          />
          <SelectButton
            text="Username"
            selected={inviteType === "username"}
            onSelect={() => {
              setInviteType("username");
              setInputValue("");
              setErrorMessages([]);
            }}
          />
        </div>
        <div className="pb-4">
          {inviteType === "email" ? (
            <TextInput
              type={"email"}
              id="inviteData"
              label={t("embeddedStrings.enterType", { type: inviteType })}
              placeholder={t("embeddedStrings.enterType", { type: inviteType })}
              defaultValue={inputValue}
              register={() => {}}
              errorMessages={errorMessages}
              onChange={handleInputChange}
              onButtonClick={handleConfirm}
            />
          ) : (
            <SelectInput
              isSearchable
              label={t("embeddedStrings.enterType", { type: inviteType })}
              selectedValue={selectedUser}
              options={isSuccess ? users : []}
              errorMessages={[]}
              onChange={setSelectedUser}
              placeholder={t("embeddedStrings.enterType", { type: inviteType })}
              id="inviteData"
            />
          )}
        </div>
        <div className="flex justify-end pt-2 gap-2">
          <ButtonComponent
            size="md"
            title={t("buttonLabels.cancel")}
            colorScheme="default"
            onClick={handleClose}
          />
          <ButtonComponent
            loading={loading}
            disabled={inputValue === "" && !selectedUser}
            size="md"
            title={t("buttonLabels.confirm")}
            colorScheme="primary"
            onClick={handleConfirm}
          />
        </div>
      </>
    </Modal>
  );
};

export default InviteRecipient;
