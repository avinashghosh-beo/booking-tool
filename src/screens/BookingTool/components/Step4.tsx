import React, { useState, useEffect } from "react";
import Chip from "../../../components/common/Chip";
import AdPortalsDisplayCard from "../../../components/cards/AdPortalsDisplayCard";
import { useTranslation } from "react-i18next";
import SelectInput from "../../../components/InputElements/SelectInput";
import {
  getPostalLocations,
  getRegionLocations,
} from "../../../api/thirdParty";
import SearchBar from "../../../components/InputElements/SearchBar";
import { usePortals } from "../../../hooks/usePortals";
import { useFormContext } from "react-hook-form";
import ErrorMessages from "../../../components/common/ErrorMessages";

// Original Portal interface
export interface Portal {
  ID: string;
  AllowedLocations: number;
  MaxCharacter: number;
  RegionAllowed: boolean;
  RemoteAllowed: boolean;
  LogoName: string;
  ProductName: string;
  GermanyWideAllowed: boolean;
  Locations: Location[];
  Remote: boolean;
  GermanWide: boolean;
  ApplicationLinkOrEmail: string;
}

const Step4 = () => {
  const { t } = useTranslation();

  const LOCATION_SEARCH_TYPES = [
    { label: t("strings.searchByZip"), value: "ZIP" },
    { label: t("strings.searchByRegion"), value: "REGION" },
  ] as const;

  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const [selectedLocationType, setSelectedLocationType] = useState(
    LOCATION_SEARCH_TYPES[0]
  );

  const {
    portalsData,
    handleLocationDelete,
    handleRemoteAllowed,
    handleGermanWideAllowed,
    applySelectedLocation,
  } = usePortals();

  // Add effect to update form value whenever portalsData changes
  useEffect(() => {
    const isValid = Object.values(portalsData).every((portal) => {
      const hasLocations = portal.Locations.length > 0;
      const isRemoteOrGermanWide = portal.Remote || portal.GermanWide;
      return hasLocations || isRemoteOrGermanWide;
    });
    setValue("isLocationsValid", isValid);
  }, [portalsData, setValue]);

  return (
    <div className="py-4">
      <ErrorMessages errors={[errors.isLocationsValid?.message]} />
      {/* Location Search Header */}
      <div className="grid grid-cols-1 pb-4 sm:grid-cols-2">
        <p className="block text-xl font-medium text-primary-500">
          {t("strings.forWhichLocations")}
        </p>
        <div className="flex justify-end gap-x-4">
          <SelectInput
            errorMessages={[]}
            placeholder={t("strings.searchBy")}
            selectedValue={selectedLocationType}
            onChange={setSelectedLocationType}
            options={LOCATION_SEARCH_TYPES}
          />
          <div className="flex items-center justify-center pt-[4px]">
            <SearchBar
              selectedValue={null}
              setSelectedValue={applySelectedLocation}
              fetchRequest={
                selectedLocationType.value === "ZIP"
                  ? getPostalLocations
                  : getRegionLocations
              }
            />
          </div>
        </div>
      </div>

      {/* Previous Locations */}
      <div>
        <label className="block pb-2 text-sm font-semibold text-primary">
          {t("strings.locationsUsedBefore")}
        </label>
        <div className="flex flex-row pb-4">
          {["44524 Munich", "12839 Hamburg", "98232 Berlin"].map(
            (item, index) => (
              <div key={index} className="pr-2">
                <Chip showDot={false} type="muted">
                  {item}
                </Chip>
              </div>
            )
          )}
        </div>
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.values(portalsData)?.map((portal) => (
          <AdPortalsDisplayCard
            key={portal.ID}
            {...portal}
            handleRemoteAllowedClick={(flag) =>
              handleRemoteAllowed(portal.ID, flag)
            }
            handleGermanWideAllowed={(flag) =>
              handleGermanWideAllowed(portal.ID, flag)
            }
            handleLocationDelete={(locationId) =>
              handleLocationDelete(locationId, portal.ID)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Step4;
