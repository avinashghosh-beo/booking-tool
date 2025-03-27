import React, { useMemo, useState } from "react";
import SelectInput from "../../components/InputElements/SelectInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomDateRangePicker } from "../../components/InputElements/DatePicker";
import { ButtonComponent } from "../../components/common/Button";
import { IoReload } from "react-icons/io5";
import { fetchContacts } from "./api";
import DataTable from "../../components/tables";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { subYears } from "date-fns";

const rangePickerOptions = [];

const MyOrders = () => {
  const { t } = useTranslation();
  const productTypes = [
    { value: "combination", label: t("shortStrings.combination") },
    { value: "single", label: t("shortStrings.single") },
    { value: "free", label: t("shortStrings.free") },
    { value: "paid", label: t("shortStrings.paid") },
    { value: "socialAd", label: t("shortStrings.socialAd") },
  ];

  const statusOptions = [
    {
      value: "all",
      label: t("shortStrings.all"),
    },
    {
      value: "61232D47-560F-9042-A11F-8C447A59CA70",
      label: t("tableTitles.offline"),
    },
    {
      value: "F8DD7E57-A94A-934B-902E-5C66B1026452",
      label: t("tableTitles.online"),
    },
  ];

  const { selectedCompanies } = useSelector((state) => state.companies);
  const [selectedContact, setSelectedContact] = useState([]);
  const queryClient = useQueryClient();
  const [dateRanges, setDateRanges] = useState([
    {
      startDate: subYears(new Date(), 1),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [productType, setProductType] = useState({
    value: "both",
    label: t("shortStrings.all"),
  });
  const [status, setStatus] = useState({
    value: "all",
    label: t("shortStrings.all"),
  });

  // Query for fetching contacts
  const contactsQuery = useQuery({
    queryKey: ["contacts", selectedCompanies],
    queryFn: () => fetchContacts({ company: selectedCompanies }),
    enabled: true,
    keepPreviousData: true,
  });

  const contactOptions = useMemo(() => {
    if (contactsQuery.isSuccess) {
      let contactOptionsArray = contactsQuery.data?.data?.records?.map((contact) => ({
        value: contact.id,
        label: contact.value,
      }));
      setSelectedContact(contactOptionsArray);
      return contactOptionsArray;
    } else return [];
  }, [contactsQuery.isSuccess, contactsQuery.isLoading]);

  const resetValues = () => {
    setProductType({
      value: "both",
      label: t("shortStrings.all"),
    });
    setStatus({
      value: "all",
      label: t("shortStrings.all"),
    });
    setDateRanges([
      {
        startDate: subYears(new Date(), 1),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setSelectedContact(contactOptions);
  };

  return (
    <div className="pb-16">
      <div className="flex flex-row flex-wrap gap-2 pb-4">
        <div className="min-w-[200px]">
          <SelectInput theme="light" required placeholder={t("shortStrings.selectStatus")} errorMessages={[]} showLabel={false} id="status" options={statusOptions} selectedValue={status} onChange={setStatus} />
        </div>
        <div className="min-w-[200px]">
          <SelectInput isMulti theme="light" required placeholder={t("shortStrings.selectContact")} errorMessages={[]} showLabel={false} id="contact" options={contactOptions} selectedValue={selectedContact} onChange={setSelectedContact} isLoading={contactsQuery.isLoading} all={selectedContact.length === contactOptions.length} />
        </div>
        <div className="">
          <CustomDateRangePicker rangePickerOptions={rangePickerOptions} dateRanges={dateRanges} onChange={setDateRanges} />
        </div>
        <div className="min-w-[200px]">
          <SelectInput theme="light" required placeholder={t("shortStrings.selectApiType")} errorMessages={[]} showLabel={false} id="productType" options={productTypes} selectedValue={productType} onChange={setProductType} />
        </div>
        <div className="hidden sm:block">
          <ButtonComponent
            size="sm"
            colorScheme="light"
            icon={
              <div className="p-2">
                <IoReload size={16} />
              </div>
            }
            onClick={() => {
              // queryClient.invalidateQueries(["myOrders"]);
              resetValues();
            }}
          />
        </div>
      </div>

      <div className="">
        <DataTable
          showPagination
          name="myOrders"
          filters={{
            status: status.value,
            filterByCustomer: selectedContact.map((item) => item?.value),
            startDate: new Date(dateRanges[0]?.startDate).toISOString(),
            endDate: new Date(dateRanges[0]?.endDate).toISOString(),
            ProductType: productType.value,
          }}
        />
      </div>
    </div>
  );
};

export default MyOrders;
