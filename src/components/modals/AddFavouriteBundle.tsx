import React, { useState } from "react";
import Modal from "../hoc/Modal";
import SelectInput from "../InputElements/SelectInput";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ButtonComponent } from "../common/Button";
import { useMutation } from "@tanstack/react-query";
import { addFavouriteBundle } from "../../screens/Settings/api";
import { useQueryClient } from "@tanstack/react-query";
import useToast from "../../hooks/useToast";

const AddFavouriteBundle = ({
  isVisible,
  onClose,
  loading,
  bundleName,
  bundleId,
}) => {
  const showToast = useToast();
  const { t } = useTranslation();
  const { allCompanies } = useSelector((state) => state.companies);
  const [selectedCompany, setSelectedCompany] = useState("");
  const queryClient = useQueryClient();

  const companyOptions = allCompanies.map((company) => ({
    label: company.value,
    value: company.id,
  }));

  const addToFavouriteMutation = useMutation({
    mutationFn: addFavouriteBundle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favouriteBundles"] });
      setSelectedCompany("");
      onClose();
    },
    onError: () => {
      showToast(t("errorMessages.errorOccurred"), {
        position: "top-right",
        hideProgressBar: true,
      });
    },
  });

  const handleClose = () => {
    onClose();
    setSelectedCompany("");
  };

  return (
    <Modal size="sm" isVisible={isVisible} onClose={handleClose}>
      <>
        <div className="grid max-w-full gap-4 py-4">
          <h1 className="text-lg font-medium">{t("strings.addToFavourite")}</h1>
        </div>
        <p className="text-md text-gray-800 mb-2">
          {t("embeddedStrings.addToFavouriteDescription", {
            bundleName: bundleName,
          })}
        </p>
        <div className="pb-4">
          <SelectInput
            // isMulti={true}
            id="company"
            selectedValue={selectedCompany}
            placeholder="Select Company"
            errorMessages={[]}
            options={companyOptions}
            onChange={setSelectedCompany}
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
            onClick={() =>
              addToFavouriteMutation.mutate({
                bundleId: bundleId,
                companyId: selectedCompany.value,
              })
            }
          />
        </div>
      </>
    </Modal>
  );
};

export default AddFavouriteBundle;
