import React, { useLayoutEffect, useState } from "react";
import Modal from "../hoc/Modal";
import SelectInput from "../InputElements/SelectInput";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ButtonComponent } from "../common/Button";

const CompaniesSelector = ({ isVisible, onClose, selectedCompanyIds = [], loading }) => {
  const { t } = useTranslation();
  const { allCompanies } = useSelector((state) => state.companies);
  const [selectedCompany, setSelectedCompany] = useState("");

  const companyOptions = allCompanies
    .filter((company) => !selectedCompanyIds.includes(company.id))
    .map((company) => ({
      label: company.value,
      value: company.id,
    }));

  const handleClose = () => {
    onClose();
    setSelectedCompany("");
  };

  const handleConfirm = () => {
    onClose(selectedCompany);
    setSelectedCompany("");
  };

  useLayoutEffect(() => {}, [selectedCompanyIds]);

  return (
    <Modal size="sm" isVisible={isVisible} onClose={handleClose}>
      <>
        <div className="grid max-w-full gap-4 py-4">
          <h1>{t("screenNames.selectCompanies")}</h1>
        </div>
        <div className="pb-4">
          <SelectInput
            id="company"
            selectedValue={selectedCompany}
            placeholder="Select Company"
            errorMessages={[]}
            options={companyOptions}
            onChange={(e) => setSelectedCompany(e)}
          />
        </div>
        <div className="flex justify-end pt-2 gap-2">
          <ButtonComponent
            size="md"
            title="Cancel"
            colorScheme="default"
            onClick={handleClose}
          />
          <ButtonComponent
            loading={loading}
            disabled={selectedCompany === ""}
            size="md"
            title="Confirm"
            colorScheme="primary"
            onClick={handleConfirm}
          />
        </div>
      </>
    </Modal>
  );
};

export default CompaniesSelector;
