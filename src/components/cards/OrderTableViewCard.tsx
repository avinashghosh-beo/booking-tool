import React, { useMemo } from "react";
import LineChart from "../charts/LineChart";
import { ButtonComponent } from "../common/Button";
import { dateFormat } from "../../utils/dateformat";
import useToast from "../../hooks/useToast";
import { useTranslation } from "react-i18next";

const CDN_URL = import.meta.env.VITE_APP_CDN;

const labels = [
  "Jan 6",
  "Jan 13",
  "Jan 20",
  "Jan 27",
  "Feb 3",
  "Feb 10",
  "Feb 17",
  "Feb 24",
  "Mar 3",
  "Mar 10",
  "Mar 17",
  "Mar 24",
];

const generateRandomData = () => {
  return labels.map(() => Math.floor(Math.random() * (100 - -100 + 1)) + 100);
};

interface OrderTableViewCardProps {
  showAxis?: boolean;
  data?: any;
  StellenzeigenStatus?: any;
}

const OrderTableViewCard: React.FC<OrderTableViewCardProps> = ({
  StellenzeigenStatus,
  showAxis = true,
  data = {},
}) => {
  const { t } = useTranslation();
  // Memoize random data generation to avoid recalculating on each render
  const chartData = useMemo(() => generateRandomData(), []);

  const showToast = useToast();
  return (
    <div className="flex flex-col gap-4 p-4 mb-2 bg-white rounded-2xl">
      <div className="flex items-center justify-between">
        <img
          src={CDN_URL + data?.Product?.AnbieterDaten?.LogoName}
          alt="Stepstone"
          className="max-h-8"
        />
        <div className="flex items-center pl-2 font-bold">
          {StellenzeigenStatus === "F8DD7E57-A94A-934B-902E-5C66B1026452" ? (
            data.Url?.length > 5 && (
              <ButtonComponent
                colorScheme="primary"
                title={t("buttonLabels.seeJobAdOnline")}
                onClick={(event) => {
                  event.stopPropagation();
                  if (
                    data.Url &&
                    (() => {
                      try {
                        new URL(data.Url);
                        return true;
                      } catch (_) {
                        return false;
                      }
                    })()
                  ) {
                    window.open(data.Url, "_blank");
                  } else {
                  }
                }}
              />
            )
          ) : (
            <ButtonComponent
              colorScheme="primary"
              title={t("buttonLabels.seeJobAdOnline")}
              onClick={() => {
                showToast(t("warningMessages.availableLater"), {
                  position: "top-right",
                  hideProgressBar: true,
                });
              }}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-center p-4 border rounded-lg">
        <LineChart
          showXaxis={showAxis}
          showYaxis={showAxis}
          labels={labels}
          values={chartData}
        />
      </div>
      <div>
        <div className="flex gap-x-4">
          <div>
            {t("tableTitles.online")}:{" "}
            <span className="font-semibold text-primary-600">
              {dateFormat(data.DateOnline)}
            </span>
          </div>
          <div>
            {t("tableTitles.offline")}:{" "}
            <span className="font-semibold text-primary-600">
              {dateFormat(data.DateOffline)}
            </span>
          </div>
          <div>
            {t("tableTitles.clicks")}:{" "}
            <span className="font-semibold text-primary-600">
              {data.Clicks ?? 0}
            </span>
          </div>
        </div>
        <div>
          {t("tableTitles.placeOfUse")}:{" "}
          <span className="font-semibold text-primary-600">
            {t("shortStrings.sampleLocations")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderTableViewCard);
