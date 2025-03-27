import axios from "axios";

let LOCATIONS_SERVICE_API_URL = import.meta.env.VITE_LOCATIONS_SERVICE_API_URL;

let POSTAL_LOCATIONS_URL =
  LOCATIONS_SERVICE_API_URL + "georef-germany-postleitzahl/records";

let REGIONS_URL = LOCATIONS_SERVICE_API_URL + "georef-germany-land/records";

export const getPostalLocations = (search) =>
  axios.get(POSTAL_LOCATIONS_URL, {
    params: {
      select: "plz_name,lan_name,plz_code",
      limit: 100,
      where: `plz_name LIKE "%${search}%" OR lan_name LIKE "%${search}%"`,
    },
  });

export const getRegionLocations = (search) =>
  axios.get(REGIONS_URL, {
    params: {
      limit: 100,
      select: "lan_name",
      where: `lan_name LIKE "%${search}%"`,
    },
  });
