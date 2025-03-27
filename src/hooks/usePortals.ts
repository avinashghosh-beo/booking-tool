import { useContext, useCallback } from "react";
import { PortalContext } from "../contexts/PortalContext";
import { removeDuplicatesByValue } from "../utils/array";

export const usePortals = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortals must be used within a PortalProvider");
  }

  const { portalsData, updatePortal, setValue } = context;

  const handleLocationDelete = useCallback(
    (locationId: string, portalId: string) => {
      const portal = portalsData[portalId];
      if (!portal) return;

      const updatedLocations = portal.Locations.filter(
        (location) => location.value !== locationId
      );

      updatePortal(portalId, { Locations: updatedLocations });
    },
    [portalsData, updatePortal]
  );

  const handleRemoteAllowed = useCallback(
    (portalId: string, flag: boolean) => {
      updatePortal(portalId, { Remote: flag });
    },
    [updatePortal]
  );

  const handleGermanWideAllowed = useCallback(
    (portalId: string, flag: boolean) => {
      updatePortal(portalId, { GermanWide: flag });
    },
    [updatePortal]
  );

  const applySelectedLocation = useCallback(
    (location: Location, portalId?: string) => {
      if (!location) return;

      if (portalId) {
        // Update specific portal's locations
        const portal = portalsData[portalId];
        const { AllowedLocations, MaxCharacter } = portal;

        const newLocations = removeDuplicatesByValue([
          ...portal.Locations,
          location,
        ]);

        // Check MaxCharacter limit (if it's a number and not -1)
        const totalChars = newLocations.reduce(
          (sum, loc) => sum + (loc.plz_name?.length || 0),
          0
        );
        const isWithinCharLimit =
          MaxCharacter === undefined ||
          MaxCharacter === -1 ||
          (typeof MaxCharacter === "number" && totalChars <= MaxCharacter);

        // Only proceed if within character limit
        if (!isWithinCharLimit) {
          return;
        }

        const limitedLocations =
          typeof AllowedLocations === "number"
            ? newLocations.slice(0, AllowedLocations)
            : newLocations;

        setValue("selectedPortalsData", {
          ...portalsData,
          [portalId]: {
            ...portal,
            Locations: limitedLocations,
          },
        });
      } else {
        // Update all portals' locations
        const updatedPortalsData = Object.keys(portalsData).reduce(
          (acc, key) => {
            const portal = portalsData[key];
            const { AllowedLocations, MaxCharacter } = portal;

            const newLocations = removeDuplicatesByValue([
              ...portal.Locations,
              location,
            ]);

            // Check MaxCharacter limit (if it's a number and not -1)
            const totalChars = newLocations.reduce(
              (sum, loc) => sum + (loc.plz_name?.length || 0),
              0
            );
            const isWithinCharLimit =
              MaxCharacter === undefined ||
              MaxCharacter === -1 ||
              (typeof MaxCharacter === "number" && totalChars <= MaxCharacter);

            // Skip updating this portal if character limit exceeded
            if (!isWithinCharLimit) {
              return { ...acc, [key]: portal };
            }

            const limitedLocations =
              typeof AllowedLocations === "number"
                ? newLocations.slice(0, AllowedLocations)
                : newLocations;

            return {
              ...acc,
              [key]: {
                ...portal,
                Locations: limitedLocations,
              },
            };
          },
          {}
        );
        setValue("selectedPortalsData", updatedPortalsData);
      }
    },
    [portalsData, updatePortal]
  );

  return {
    portalsData,
    handleLocationDelete,
    handleRemoteAllowed,
    handleGermanWideAllowed,
    applySelectedLocation,
  };
};
