import React, { useMemo, useState } from "react";
import { TrashIcon, WarningIcon } from "../icons";
import pluralize from "pluralize";
import { FaEye } from "react-icons/fa";
import LocationsListPopup from "../modals/LocationsListPopup";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "../common/ToggleSwitch";
import { GhostAccordion } from "../common/Accordion";

const CDN_URL = import.meta.env.VITE_APP_CDN;

interface AdPortalsDisplayCardProps {
  image?: string;
  handleLocationDelete?: Function;
  handleRemoteAllowedClick?: Function;
  handleGermanWideAllowed?: Function;
}

const AdPortalsDisplayCard: React.FC<AdPortalsDisplayCardProps> = ({
  handleLocationDelete = () => {},
  handleGermanWideAllowed = () => {},
  handleRemoteAllowedClick = () => {},
  ...props
}) => {
  const { t } = useTranslation();
  const [showAllLocations, setShowAllLocations] = useState(false);
  const displayLocations = useMemo(() => {
    return props.Locations?.length <= 6
      ? props.Locations
      : [
          ...props.Locations.slice(0, 5),
          { id: -1, plz_name: `+${props.Locations.length - 5} more` },
        ];
  }, [props.Locations]);

  return (
    <div className="p-4 rounded-md bg-primary-100">
      <div className="flex items-center justify-between pb-2">
        <img
          src={CDN_URL + props?.LogoName}
          alt=""
          className="h-8 mix-blend-multiply"
        />
        <p className="text-md text-primary-600">
          {props.AllowedLocations &&
            `${props.AllowedLocations} ${pluralize(
              "Location",
              props.AllowedLocations
            )} 
          ${t("shortStrings.allowed")}`}
        </p>
      </div>
      {props?.GermanyWideAllowed && (
        <div className="pb-2">
          <ToggleSwitch
            checked={props?.GermanWide || false}
            inverted
            onChange={() =>
              handleGermanWideAllowed(props?.GermanWide ? false : true)
            }
            label={"Germany Wide"}
          />
        </div>
      )}
      {props?.RemoteAllowed && (
        <div className="pb-2">
          <ToggleSwitch
            checked={props?.Remote || false}
            inverted
            onChange={() =>
              handleRemoteAllowedClick(props?.Remote ? false : true)
            }
            label={"Allow Remote"}
          />
        </div>
      )}
      <GhostAccordion open={!props.GermanWide || false}>
        <div className="grid grid-cols-1 gap-4 pt-2">
          {displayLocations.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between p-2 text-sm rounded-md bg-primary-200"
            >
              <p>{item.plz_name}</p>
              {item.id !== -1 ? (
                <button
                  onClick={() => handleLocationDelete(item?.value)}
                  className="p-2 bg-gray-100 rounded-md text-md text-danger-700"
                >
                  <TrashIcon className="size-3" />
                </button>
              ) : (
                <button
                  onClick={() => setShowAllLocations(true)}
                  className="p-2 bg-gray-100 rounded-md text-md text-primary-700"
                >
                  <FaEye className="size-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </GhostAccordion>
      {/* {error && (
        <div className="flex flex-row items-center justify-center p-2 mt-2 text-xs rounded bg-danger-200 text-danger-700 gap-x-2">
          <WarningIcon />
          {error}
        </div>
      )} */}

      <LocationsListPopup
        onDelete={handleLocationDelete}
        locations={props.Locations}
        visible={showAllLocations}
        onClose={() => setShowAllLocations(false)}
      />
    </div>
  );
};

export default AdPortalsDisplayCard;
