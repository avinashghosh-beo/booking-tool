export interface AnbieterDaten {
  ID: string;
  AnbieterName: string;
  LogoName: string;
}

export interface Product {
  ID: string;
  ProductName: string;
  Price: number;
  PriceBuying: number;
  BuchungsUID: string;
  AllowedLocations: number | null;
  RegionAllowed: boolean;
  RemoteAllowed: boolean;
  GermanyWideAllowed: boolean;
  MaxCharacter: number;
  AnbieterDaten: AnbieterDaten;
}

export interface BundlePricing {
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  taxAmount: number;
  taxableAmount: number;
  productCount: number;
}

export interface Bundle {
  ID: string;
  Name: string;
  OwnedBy: string;
  CompanyID: string;
  Category: string | null;
  Products: Product[];
  pricing: BundlePricing;
}

export interface BundlesResponse {
  status: boolean;
  data: {
    totalRecords: number;
    records: Bundle[];
  };
}
