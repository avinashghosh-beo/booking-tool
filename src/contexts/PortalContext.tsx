import { createContext, useCallback, useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";

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

interface PortalContextType {
  portalsData: Record<string, Portal>;
  updatePortal: (portalId: string, updates: Partial<Portal>) => void;
}

export const PortalContext = createContext<PortalContextType | null>(null);

export const PortalProvider: React.FC = ({ children }) => {
  const { watch, setValue } = useFormContext();

  const bookType = watch("BookType");
  const selectedPresetBundle = watch("selectedPresetBundle");
  const portalsCart = watch("portalsCart");
  const selectedContingent = watch("selectedContingent");
  const selectedContingentType = watch("selectedContingentType");
  const selectedPortalsData = watch("selectedPortalsData");

  useEffect(() => {
    if (!bookType) return;

    let portalDataObject = {};

    switch (bookType) {
      case "Bundle":
        if (!selectedPresetBundle?.Products) return;
        portalDataObject = selectedPresetBundle.Products.reduce(
          (acc, portal) => ({
            ...acc,
            [portal.ID]: {
              ID: portal.ID,
              AllowedLocations: portal?.AllowedLocations,
              MaxCharacter: portal?.MaxCharacter,
              RegionAllowed: portal?.RegionAllowed,
              RemoteAllowed: portal?.RemoteAllowed,
              LogoName: portal?.AnbieterDaten?.LogoName,
              ProductName: portal?.ProductName,
              GermanyWideAllowed: portal?.GermanyWideAllowed,
              Locations: [],
              Remote: false,
              GermanWide: false,
              ApplicationLinkOrEmail: "",
            },
          }),
          {}
        );
        break;

      case "Custom":
        portalDataObject = portalsCart.reduce(
          (acc, portal) => ({
            ...acc,
            [portal.ID]: {
              ID: portal.ID,
              AllowedLocations: portal.AllowedLocations,
              MaxCharacter: portal.MaxCharacter,
              RegionAllowed: portal.RegionAllowed,
              RemoteAllowed: portal.RemoteAllowed,
              LogoName: portal.AnbieterDaten.LogoName,
              GermanyWideAllowed: portal.GermanyWideAllowed,
              ProductName: portal.ProductName,
              Locations: [],
              Remote: false,
              GermanWide: false,
              ApplicationLinkOrEmail: "",
            },
          }),
          {}
        );
        break;

      default:
        if (selectedContingentType === "Budget") {
          portalDataObject = [selectedContingent.BudgetCreditsProducts].reduce(
            (acc, portal) => ({
              ...acc,
              [portal.Product?.ID]: {
                ID: portal.Product?.ID,
                AllowedLocations: portal.Product.AllowedLocations,
                MaxCharacter: portal.Product.MaxCharacter,
                RegionAllowed: portal.Product.RegionAllowed,
                RemoteAllowed: portal.Product.RemoteAllowed,
                LogoName: portal.Product.AnbieterDaten.LogoName,
                GermanyWideAllowed: portal.Product.GermanyWideAllowed,
                ProductName: portal.Product.ProductName,
                Locations: [],
                Remote: false,
                GermanWide: false,
                ApplicationLinkOrEmail: "",
              },
            }),
            {}
          ); 
        } else if (selectedContingentType === "Free") {
          portalDataObject = selectedContingent.Products.reduce(
            (acc, portal) => ({
              ...acc,
              [portal.ID]: {
                ID: portal?.ID,
                AllowedLocations: portal.AllowedLocations,
                MaxCharacter: portal.MaxCharacter,
                RegionAllowed: portal.RegionAllowed,
                RemoteAllowed: portal.RemoteAllowed,
                LogoName: portal.AnbieterDaten.LogoName,
                GermanyWideAllowed: portal.GermanyWideAllowed,
                ProductName: portal.ProductName,
                Locations: [],
                Remote: false,
                GermanWide: false,
                ApplicationLinkOrEmail: "",
              },
            }),
            {}
          );
        } else {
          portalDataObject =
            selectedContingent?.SalesDocument?.SalesDocumentItems.reduce(
              (acc, portal) => ({
                ...acc,
                [portal.Product.ID]: {
                  ID: portal.Product.ID,
                  AllowedLocations: portal.Product.AllowedLocations,
                  MaxCharacter: portal.Product.MaxCharacter,
                  RegionAllowed: portal.Product.RegionAllowed,
                  RemoteAllowed: portal.Product.RemoteAllowed,
                  LogoName: portal.Product.AnbieterDaten.LogoName,
                  GermanyWideAllowed: portal.Product.GermanyWideAllowed,
                  ProductName: portal.Product.ProductName,
                  Locations: [],
                  Remote: false,
                  GermanWide: false,
                  ApplicationLinkOrEmail: "",
                },
              }),
              {}
            );
        }
    }

    setValue("selectedPortalsData", portalDataObject);
  }, [
    bookType,
    selectedPresetBundle,
    portalsCart,
    selectedContingent,
    selectedContingentType,
    setValue,
  ]);

  const updatePortal = useCallback(
    (portalId: string, updates: Partial<Portal>) => {
      if (!selectedPortalsData?.[portalId]) return;

      setValue("selectedPortalsData", {
        ...selectedPortalsData,
        [portalId]: { ...selectedPortalsData[portalId], ...updates },
      });
    },
    [selectedPortalsData, setValue]
  );

  const value = useMemo(
    () => ({
      portalsData: selectedPortalsData || {},
      updatePortal,
      setValue,
    }),
    [selectedPortalsData, updatePortal, setValue]
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
};
