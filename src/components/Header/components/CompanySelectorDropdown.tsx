import React from "react";
import Popover from "../../common/PopoverActions";
import { AddSquareIcon, TickIcon, UserProfileIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateSelectedCompaniesList } from "../../../store/slices/companyDataSlice";
import { useAuth } from "../../../contexts/AuthContext";

const CompanySelectorDropdown = () => {
  const { updateSelectedCompanies } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { allCompanies, selectedCompanies } = useSelector(
    (state) => state?.companies
  );

  const refetchQueries = () => {
    queryClient.invalidateQueries(["myAds"]);
    queryClient.invalidateQueries(["myOrders"]);
  };

  const handleCompanyChange = (id) => {
    let newSelectedCompanies = [...selectedCompanies];
    if (newSelectedCompanies.includes(id)) {
      newSelectedCompanies = newSelectedCompanies.filter((item) => item !== id);
    } else {
      newSelectedCompanies.push(id);
    }
    updateSelectedCompanies(newSelectedCompanies);
    refetchQueries();
  };

  const selectAllCompanies = () => {
    updateSelectedCompanies(allCompanies.map((item) => item?.id));
    refetchQueries();
  };

  const titleComponent = (
    <div className="flex justify-between pb-2 pr-2">
      <p className="text-primary-700">{t("buttonLabels.switchCompany")}</p>
    </div>
  );

  const popoverContent = (
    <>
      <ul className="grid gap-2 mb-4">
        <li
          onClick={selectAllCompanies}
          className="flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-50"
        >
          <div className="grid rounded-full size-10 place-items-center bg-primary-200"></div>
          <span className="font-medium grow">
            {t("shortStrings.allCompanies")}
          </span>
        </li>
        {allCompanies?.map((item, index) => (
          <li
            onClick={() => handleCompanyChange(item?.id)}
            key={index}
            className={`flex cursor-pointer items-center hover:bg-primary-50 gap-4 px-4 py-2 rounded-lg ${
              selectedCompanies.includes(item?.id)
                ? "bg-primary-50"
                : "bg-white"
            }`}
          >
            <div className="grid border rounded-full border-primary-300 size-10 place-items-center bg-primary-200"></div>
            <span className="font-medium grow">{item?.value}</span>
            {selectedCompanies.includes(item?.id) && <TickIcon />}
          </li>
        ))}
      </ul>
      <div
        onClick={() => navigate("/add-new-company")}
        className="flex cursor-pointer gap-2.5 items-center border border-success-300 bg-success-50 rounded-lg px-4 py-2 text-success-400 font-medium hover:bg-success-600 hover:text-white"
      >
        <AddSquareIcon />
        {t("shortStrings.addNewCompany")}
      </div>
    </>
  );

  return (
    <Popover
      title={titleComponent}
      containerStyle="w-[80vw] sm:w-96 p-1"
      mode="select"
      content={popoverContent}
      placement="bottomRight"
    >
      <div className="px-2 cursor-pointer text-primary-700 hover:text-primary">
        <UserProfileIcon />
      </div>
    </Popover>
  );
};

export default CompanySelectorDropdown;
