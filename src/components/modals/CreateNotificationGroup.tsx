import React, { useMemo, useState } from "react";
import Modal from "../hoc/Modal";
import { useTranslation } from "react-i18next";
import { ButtonComponent } from "../common/Button";
import TextInput from "../InputElements/TextInput";
import InviteRecipient from "./InviteRecipient";
import CompaniesSelector from "./CompaniesSelector";
import { AddIcon, TrashIcon } from "../icons";
import Chip from "../common/Chip";
import { removeDuplicatesById } from "../../utils/array";

const CreateNotificationGroup = ({ isVisible, onClose, loading }) => {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState("");
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [showCompaniesModal, setShowCompaniesModal] = useState(false);
  const [addedCompanies, setAddedCompanies] = useState([]);
  const [addedRecipients, setAddedRecipients] = useState([]);

  const handleCloseRecipientsModal = (
    newRecipient,
    recipientType,
    recipientLabel
  ) => {
    if (newRecipient) {
      let result = {
        isOrderer: false,
        id: newRecipient,
      };
      if (recipientType === "email") {
        result.email = newRecipient;
        result.type = "EMAIL";
      } else {
        result.userId = newRecipient;
        result.type = "USER";
        result.label = recipientLabel;
      }
      let newResult = removeDuplicatesById([...addedRecipients, result]);
      setAddedRecipients(newResult);
      setShowRecipientsModal(false);
    } else {
      setShowRecipientsModal(false);
    }
  };

  const handleCloseCompaniesModal = (newCompany) => {
    if (newCompany) {
      setAddedCompanies([
        ...addedCompanies,
        { ...newCompany, id: newCompany.value },
      ]);
      setShowCompaniesModal(false);
    } else {
      setShowCompaniesModal(false);
    }
  };

  const handleRemoveCompany = (id) => {
    let newResult = addedCompanies.filter((item) => item.id !== id);
    setAddedCompanies(newResult);
  };

  const handleRemoveRecipient = (id) => {
    let newResult = addedRecipients.filter((item) => item.id !== id);
    setAddedRecipients(newResult);
  };

  const handleClose = () => {
    onClose();
    setGroupName("");
    setAddedCompanies([]);
    setAddedRecipients([]);
  };

  const handleConfirm = () => {
    onClose({
      name: groupName,
      companies: addedCompanies.map((item) => item.id),
      recipients: addedRecipients.map((item) => ({
        type: item?.type,
        email: item?.email,
        userId: item?.userId,
        isOrderer: item?.isOrderer,
      })),
    });
    setGroupName("");
    setAddedCompanies([]);
    setAddedRecipients([]);
  };

  const isButtonDisabled = useMemo(() => {
    if (groupName === "") {
      return true;
    } else if (addedCompanies.length === 0 && addedRecipients.length === 0) {
      return true;
    }
    return false;
  }, [groupName, addedCompanies, addedRecipients]);

  return (
    <>
      <InviteRecipient
        isVisible={showRecipientsModal}
        onClose={handleCloseRecipientsModal}
        loading={false}
      />

      <CompaniesSelector
        selectedCompanyIds={addedCompanies.map((item) => item?.id)}
        isVisible={showCompaniesModal}
        onClose={handleCloseCompaniesModal}
        loading={false}
      />
      <Modal size="md" isVisible={isVisible} onClose={handleClose}>
        <>
          <div className="grid max-w-full gap-4 py-4">
            <h1>{t("screenNames.createNotificationGroup")}</h1>
          </div>

          <div className="flex flex-col gap-4">
            <TextInput
              register={() => {}}
              type="text"
              errorMessages={[]}
              id="groupName"
              label="Group Name"
              placeholder="Group Name"
              onChange={setGroupName}
            />

            <div>
              <div className="flex items-center justify-between">
                {t("labels.companies")}:
                <button onClick={() => setShowCompaniesModal(true)}>
                  <AddIcon className="text-primary-600 h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {addedCompanies.map((item, index) => (
                  <Chip key={index}>
                    <React.Fragment>
                      <span>{item.label}</span>
                      <button onClick={() => handleRemoveCompany(item.id)}>
                        <TrashIcon className="ml-2 text-danger-600 h-6 w-6" />
                      </button>
                    </React.Fragment>
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                {t("labels.recipients")}:
                <button onClick={() => setShowRecipientsModal(true)}>
                  <AddIcon className="text-primary-600 h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {addedRecipients.map((item, index) => (
                  <Chip key={index}>
                    <React.Fragment>
                      <span>{item?.email || item?.label}</span>
                      <button onClick={() => handleRemoveRecipient(item.id)}>
                        <TrashIcon className="ml-2 text-danger-600 h-6 w-6" />
                      </button>
                    </React.Fragment>
                  </Chip>
                ))}
              </div>
            </div>
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
              disabled={isButtonDisabled}
              size="md"
              title={t("buttonLabels.confirm")}
              colorScheme="primary"
              onClick={handleConfirm}
            />
          </div>
        </>
      </Modal>
    </>
  );
};

export default CreateNotificationGroup;
