import React from "react";
import Chip from "../../../components/common/Chip";
import AvatarGroup from "../../../components/common/AvatarGroup";
import { ButtonComponent } from "../../../components/common/Button";
import { dateFormat } from "../../../utils/dateformat";
import { useTranslation } from "react-i18next";

interface DetailsItemProp {
  loading?: boolean;
  data: { Portalschaltungens: { combination: any[] } };
}

const DetailsItem: React.FC<DetailsItemProp> = ({ loading, data }) => {
  const { t } = useTranslation();

  const transformedPortalData = React.useMemo(() => {
    const portalData = data?.Portalschaltungens?.combination || [];
    return portalData.map((portal) => ({
      icon: (
        <img
          className="w-3"
          src={import.meta.env.VITE_APP_CDN + portal.Logo}
          alt={portal.Website}
        />
      ),
      title: portal.Titel || "",
      website: portal.Website || "",
      onClick: () => window.open("https://google.com", "_blank"),
    }));
  }, [data?.Portalschaltungens?.combination]);

  return (
    <div className="grid grid-cols-[auto,1fr] gap-4 p-4 bg-primary-100 block sm:hidden">
      <div className="flex items-center">
        <span className="mr-2 font-semibold">
          {t("tableTitles.placeOfUse")}:
        </span>
      </div>
      <div className="flex items-center">
        <Chip loading={loading} type={data?.Paid ? "primary" : "warning"}>
          {data?.Paid ? "Paid" : "Free"}
        </Chip>
      </div>

      <div className="flex items-center">
        <span className="mr-2 font-semibold">{t("tableTitles.portals")}:</span>
      </div>
      <div className="flex items-center">
        {!loading && (
          <AvatarGroup
            expandedViewMode="popover"
            visibleItemsCount={3}
            data={transformedPortalData}
          />
        )}
      </div>

      <div className="flex items-center">
        <span className="mr-2 font-semibold">{t("tableTitles.online")}:</span>
      </div>
      <div className="flex items-center">{dateFormat(data?.StartDate)}</div>

      <div className="flex items-center">
        <span className="mr-2 font-semibold">{t("tableTitles.offline")}:</span>
      </div>
      <div className="flex items-center">{dateFormat(data?.EndDate)}</div>

      <div className="flex items-center">
        <span className="mr-2 font-semibold">{t("tableTitles.clicks")}:</span>
      </div>
      <div className="flex items-center">
        {data?.Portalschaltungens?.Clicks}
      </div>

      <div className="flex items-center">
        <span className="mr-2 font-semibold">
          {t("tableTitles.customerName")}:
        </span>
      </div>
      <div className="flex items-center">{data?.Contact?.fullName}</div>

      <div className="flex items-center">
        <span className="font-semibold">{t("labels.Location")}:</span>
      </div>
      <div className="flex items-center">Munich</div>

      <div className="flex items-center">
        <span className="font-semibold">{t("tableTitles.placeOfUse")}:</span>
      </div>
      <div className="flex items-center">
        {data?.Portalschaltungens?.Clicks}
      </div>

      <div className="col-span-2 w-fit">
        <ButtonComponent
          size="md"
          colorScheme="primary"
          title={t("buttonLabels.viewMoreData")}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default DetailsItem;
