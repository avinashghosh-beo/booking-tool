import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getRequest } from "../api";
import { ENDPOINTS } from "../api/endpoints";
import { dateFormat } from "../utils/dateformat";
import React from "react";
import AvatarGroup from "../components/common/AvatarGroup";
import Chip from "../components/common/Chip";
import Actions from "../screens/MyOrders/components/Actions";
import DetailsItem from "../screens/MyOrders/components/DetailsItem";
import OrderTableViewCard from "../components/cards/OrderTableViewCard";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import pluralize from "pluralize";
import { differenceInDays } from "date-fns";
import { SelectActionButton } from "../screens/BookingTool/components/Step3";
import TempalteActions from "../screens/Templates/component/Actions";
import InvoiceActions from "../screens/Invoice/components/actions";

const CDN_URL = import.meta.env.VITE_APP_CDN;

const useTableData = ({ tableName, filters = {}, params = {} }) => {
  const { t } = useTranslation();
  const updateOptions = (keyValue) => {
    setOptions((previousState) => ({ ...previousState, ...keyValue }));
  };
  //config for various tables
  const staticData = {
    myOrders: {
      collapsible: true,
      renderCollapsible: (data) => (
        <div className="overflow-scroll max-h-[50vh]">
          {/* Will be displayed on mobile screens only */}
          <DetailsItem loading={false} data={data} />
          {/* Only show this content when expanded */}
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 bg-primary-100">
            {data.Portalschaltungens?.filter((item) => item.ID !== "A594149A-2E60-8A47-9D9D-6F1BB57FE788").map((portal, index) => (
              <OrderTableViewCard key={index} StellenzeigenStatus={data.StellenzeigenStatus} data={portal} showAxis={true} />
            ))}
          </div>
        </div>
      ),
      columns: [
        {
          title: t("tableTitles.orderId"),
          key: "SalesDocument.IssueNumber",
        },
        {
          title: t("tableTitles.jobTitle"),
          key: "Titel",
        },
        {
          title: t("tableTitles.type"),
          key: "Paid",
          enableSort: true,
          sortKey: "sorting[Paid]",
          render: (value) => <Chip type={value ? "primary" : "warning"}>{value ? t('shortStrings.premium') : t('shortStrings.free')}</Chip>,
        },
        {
          title: t("tableTitles.jobPortal"),
          key: "Portalschaltungens",
          render: (value, rowData) => {
            if (!value) return null;

            // Calculate the remaining days
            const remainingDays = differenceInDays(new Date(rowData?.EndDate), new Date());

            const remainingDaysText = remainingDays >= 0 ? `${remainingDays} ${pluralize("day", remainingDays)} left` : "";

            // Map portal data to AvatarGroup props
            const avatarData = value.map((portal) => ({
              icon: <img className="h-2" src={`${CDN_URL}${portal?.Product?.AnbieterDaten?.LogoName}`} alt={portal?.Product?.AnbieterDaten?.AnbieterName} />,
              title: portal.Titel || "",
              onClick: () => window.open(portal?.Url, "_blank"),
            }));

            return (
              <div onClick={(e) => e.preventDefault()}>
                <AvatarGroup expandedViewMode="popover" visibleItemsCount={3} data={avatarData} />
                {remainingDaysText && <p className="pt-2 text-success-500">{remainingDaysText}</p>}
              </div>
            );
          },
          disableCollapse: true,
        },
        {
          title: t("tableTitles.online"),
          key: "StartDate",
          enableSort: true,
          sortKey: "sorting[StartDate]",
          render: (value) => dateFormat(value),
        },
        {
          title: t("tableTitles.offline"),
          key: "EndDate",
          enableSort: true,
          sortKey: "sorting[EndDate]",
          render: (value) => {
            return (
              <div className="flex items-center gap-x-2">
                <p>{dateFormat(value)}</p>
              </div>
            );
          },
        },
        {
          // title: t("tableTitles.offline"),
          title: "",
          key: "EndDate",
          sortKey: "sorting[EndDate]",
          render: (value) => {
            return (
              <div className="flex items-center">
                {differenceInDays(new Date(value), new Date()) >= 0 ? (
                  <Chip type="success" showDot={false}>
                    Online
                  </Chip>
                ) : (
                  <Chip type="danger" showDot={false}>
                    Offline
                  </Chip>
                )}
              </div>
            );
          },
        },
        {
          title: t("tableTitles.clicks"),
          key: "Clicks",
        },
        {
          title: t("tableTitles.customerName"),
          key: "Contact",
          render: (value) => value?.Firstname + " " + value?.Name,
        },
        {
          title: t("tableTitles.placeOfUse"),
          key: "",
          enableSort: true,
          sortKey: "sorting[Place]",
        },
        {
          title: "",
          key: "",
          render: (value, rowData) => <Actions />,
          disableCollapse: true,
        },
      ],
      columnRatios: [1, 4, 2, 3, 1, 2, 1, 2, 3, 3, 1],
      queryOptions: {
        skip: 0,
        limit: 10,
        endDate: new Date().toISOString(),
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
        status: "all",
      },
    },
    templates: {
      columns: [
        {
          title: t("tableTitles.title"),
          key: "Title",
          enableSort: true,
          sortKey: "sorting[Title]",
        },
        {
          title: t("tableTitles.description"),
          key: "Description",
        },
        {
          title: t("tableTitles.createdBy"),
          key: "CreatedByUser",
          render: (value) => value?.FirstName || "-",
        },
        {
          title: t("tableTitles.createdDate"),
          key: "CreatedOn",
          enableSort: true,
          sortKey: "sorting[CreatedOn]",
          render: (value) => dateFormat(value),
        },
        {
          title: t("tableTitles.modifiedBy"),
          key: "ModifiedByUser",
          render: (value) => value?.FirstName || "-",
        },
        {
          title: t("tableTitles.modifiedDate"),
          key: "ModifiedOn",
          enableSort: true,
          sortKey: "sorting[ModifiedOn]",
          render: (value) => dateFormat(value),
        },
        {
          title: "Actions",
          key: "",
          render: (value, rowData) => <TempalteActions id={rowData?.ID} />,
          disableCollapse: true,
        },
      ],
      columnRatios: [3, 4, 2, 2, 2, 2, 2],
      queryOptions: {
        skip: 0,
        limit: 10,
        search: "",
      },
    },
    alreadyPublishedAds: {
      columns: [
        {
          title: t("tableTitles.jobTitle"),
          key: "Titel",
        },
        {
          title: t("tableTitles.jobPortal"),
          key: "Portalschaltungens",
          render: (value) => {
            const avatarData = value.map((portal) => ({
              icon: <img className="h-2" src={`${CDN_URL}${portal?.Product?.AnbieterDaten?.LogoName}`} alt={portal?.Product?.AnbieterDaten?.AnbieterName} />,
              title: portal.Titel || "",
              onClick: () => window.open(portal?.Url, "_blank"),
            }));

            return <AvatarGroup expandedViewMode="popover" visibleItemsCount={3} data={avatarData} />;
          },
        },
        {
          title: t("tableTitles.createdDate"),
          key: "CreatedOn",
          render: (value) => dateFormat(value),
        },
        {
          title: t("tableTitles.advertiser"),
          key: "Company.Company",
        },
        {
          title: "",
          key: "",
          render: (value, rowData) => <SelectActionButton data={rowData} />,
          disableCollapse: true,
        },
      ],
      columnRatios: [4, 3, 2, 3, 1],
      queryOptions: {
        skip: 0,
        limit: 10,
        status: "all",
      },
    },
    workbenchJobAds: {
      columns: [
        {
          title: t("tableTitles.jobTitle"),
          key: "title",
        },
        {
          title: t("tableTitles.createdDate"),
          key: "createdAt",
          render: (value) => dateFormat(value),
        },
        {
          title: t("tableTitles.updatedDate"),
          key: "draftUpdatedOn",
          render: (value) => dateFormat(value),
        },
        {
          title: "",
          key: "",
          render: (value, rowData) => <SelectActionButton data={rowData} />,
          disableCollapse: true,
        },
      ],
      columnRatios: [4, 4, 4, 1],
      queryOptions: {
        skip: 0,
        limit: 10,
        status: "all",
      },
    },
    jobadsUsedinContingent: {
      columns: [
        {
          title: t("tableTitles.orderId"),
          key: "orderId",
        },
        {
          title: t("tableTitles.title"),
          key: "title",
        },
        {
          title: t("tableTitles.type"),
          key: "paid",
        },
        {
          title: t("tableTitles.online"),
          key: "online",
        },
        {
          title: t("tableTitles.offline"),
          key: "offline",
        },
        {
          title: t("tableTitles.clicks"),
          key: "clicks",
        },
        {
          title: t("tableTitles.customerName"),
          key: "customerName",
        },
        {
          title: t("tableTitles.placeOfUse"),
          key: "placeOfUse",
        },
        {
          title: "",
          key: "",
          render: (value, rowData) => <Actions />,
          disableCollapse: true,
        },
      ],
      columnRatios: [1, 4, 2, 2, 3, 2, 2, 1],
      queryOptions: {
        skip: 0,
        limit: 10,
        status: "all",
      },
    },
    contingentInvoiceTable: {
      columns: [
        {
          title: t("tableTitles.invoiceDate"),
          key: "orderId",
        },
        {
          title: t("tableTitles.invoiceNumber"),
          key: "title",
        },
        {
          title: t("tableTitles.invoiceRecipient"),
          key: "paid",
        },
        {
          title: t("tableTitles.totalAmount"),
          key: "online",
        },
        {
          title: t("tableTitles.paid"),
          key: "offline",
        },
        {
          title: "",
          key: "",
          render: (value, rowData) => <Actions />,
          disableCollapse: true,
        },
      ],
      columnRatios: [2, 2, 2, 2, 2, 1],
      queryOptions: {
        skip: 0,
        limit: 10,
        status: "all",
      },
    },
    invoices: {
      columns: [
        {
          title: t("tableTitles.auftragsnr"),
          key: "IssueNumber",
          sortKey: "sorting[Auftragsnr]",
        },
        {
          title: t("tableTitles.subject"),
          key: "Subject",
          render: (value) => <div className="break-words pr-2">{value}</div>,
        },
        {
          title: t("labels.companyName"),
          key: "Company.Company",
        },
        {
          title: t("tableTitles.deliveryDate"),
          key: "DeliveryDate",
          enableSort: true,
          sortKey: "sorting[DeliveryDate]",
          render: (value) => dateFormat(value),
        },
        {
          title: t("tableTitles.totalAmount"),
          key: "Total",
          render: (value) => `€${value?.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
        },
        {
          title: t("tableTitles.totalWithTax"),
          key: "TotalWithTax",
          render: (value) => `€${value?.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
        },
        {
          title: t("tableTitles.createdOn"),
          key: "CreatedOn",
          enableSort: true,
          sortKey: "sorting[CreatedOn]",
          render: (value) => dateFormat(value),
        },
        {
          title: "",
          key: "",
          render: (value, rowData) => <InvoiceActions value={value} rowData={rowData} />,
          disableCollapse: true,
        },
      ],
      columnRatios: [2, 3, 2, 2, 2, 2, 2, 1],
      queryOptions: {
        skip: 0,
        limit: 10,
        search: "",
      },
    },
  };
  const tableConfig = staticData[tableName] || {
    columns: [],
    columnRatios: [],
    queryOptions: {},
  };
  const { selectedCompanies } = useSelector((state) => state.companies);
  // Options state, initialized with table-specific queryOptions
  const [options, setOptions] = useState(tableConfig.queryOptions);

  const [totalRecords, setTotalRecords] = useState(0);

  const tableWidth = 100;

  const endpoints = {
    myOrders: ENDPOINTS.orders,
    alreadyPublishedAds: ENDPOINTS.publishedAds,
    workbenchJobAds: ENDPOINTS.workbenchJobAds,
    templates: ENDPOINTS.templates,
    invoices: ENDPOINTS.invoices,
  };

  const query = useQuery({
    queryKey: [tableName, { ...options, ...filters }],
    queryFn: () =>
      getRequest(endpoints[tableName], {
        params: {
          ...options,
          ...filters,
          company: selectedCompanies,
          ...params,
        }, // Spread options to flatten them
      }),
    onSuccess: (res) => {
      if (res?.status) {
        if (res?.data?.records.length === 0 && options?.skip !== 0)
          updateOptions({
            skip: 0,
          });
        setTotalRecords(res?.data?.totalRecords);
      }
    },
    keepPreviousData: true,
    initialData: [], // Optionally include initial mock data for the table
  });

  return {
    collapsible: tableConfig.collapsible,
    renderCollapsible: tableConfig.renderCollapsible,
    totalRecords,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    isFetching: query.isFetching,
    data: query?.data?.data?.records || [], // Use API data or fallback to mock data
    columns: tableConfig.columns,
    columnRatios: tableConfig.columnRatios,
    tableWidth,
    updateOptions,
    options,
  };
};

export default useTableData;
