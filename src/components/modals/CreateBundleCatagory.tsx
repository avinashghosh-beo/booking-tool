import React, { useMemo, useState } from "react";
import Modal from "../hoc/Modal";
import { useTranslation } from "react-i18next";
import { ButtonComponent } from "../common/Button";
import TextInput from "../InputElements/TextInput";
import SelectInput from "../InputElements/SelectInput";
import { useSelector } from "react-redux";

const CreateBundleCatagory = ({ isVisible, onClose, loading }) => {
  const { allCompanies } = useSelector((state) => state.companies);
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const companyOptions = useMemo(() => {
    return allCompanies.map((company) => ({
      label: company.value,
      value: company.id,
    }));
  }, [allCompanies]);

  const handleConfirm = () => { 
    if (name &&   company) { 
      onClose({ name,   company });
    } else {
      onClose();
    }
    setName("");
    setCompany("");
  };

  const handleClose = () => {
    onClose();
    setName("");
    setCompany("");
  };

  const isButtonDisabled = useMemo(() => {
    if (name && company) {
      return false;
    }
    return true;
  }, [name, company]);

  return (
    <Modal size="md" isVisible={isVisible} onClose={handleClose}>
      <>
        <div className="grid max-w-full gap-4 py-4">
          <h1>{t("screenNames.createBundleCatagory")}</h1>
        </div>

        <div className="flex flex-col gap-4">
          <TextInput
            register={() => {}}
            type="text"
            errorMessages={[]}
            id="name"
            label="Name"
            defaultValue={name}
            placeholder="Name"
            onChange={setName}
          />

          <SelectInput
            id="company"
            errorMessages={[]}
            options={companyOptions}
            selectedValue={company}
            onChange={setCompany}
            label="Company"
            placeholder="Select Company"
          />
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
  );
};

export default CreateBundleCatagory;
