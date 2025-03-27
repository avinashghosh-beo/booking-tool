export const submitDataResolver = (data) => {
  let result = {
    RecieverCompany: data?.RecieverCompany?.value,
    AdvertiserCompany: data?.RecieverCompany?.value,
    ReleaseType: data?.ReleaseType.value,
    JobAdType: data?.JobAdType,
    BookType: data?.BookType,
    PaymentMode: data?.PaymentMode || "manual",
    ReciveApplicationType: data.ReciveApplicationType,
    Portals: Object.values(data.selectedPortalsData).map((item) => {
      let newItem = {
        ...item,
        Locations: item.Locations.map((location) => ({
          name: location.plz_name,
          zip: location.plz_code,
        })),
      };
      if (item.GermanWide) {
        newItem.Locations = [
          ...newItem.Locations,
          {
            name: "Bundesweit",
            zip: "-",
          },
        ];
      }
      if (item.Remote) {
        newItem.Locations = [
          ...newItem.Locations,
          {
            name: "Remote",
            zip: "-",
          },
        ];
      }
      return newItem;
    }),
  };

  if (data?.JobAdType === "FileUpload") {
    result.jobAdFile = data?.uploadedAd;
  }

  if (data?.BookType === "Bundle") {
    result.BundleID = data?.selectedPresetBundle?.ID;
  }
  if (data?.ReleaseType.value === "Date") {
    result.ReleaseType = "Date";
    result.ReleaseDate = new Date(data?.ReleaseDate).toISOString();
  }
  if (data.BookType === "Contingent") {
    result.BookType = data.selectedContingentType;
    if (data?.selectedContingentType === "Budget") {
      result.BudgetId = data?.selectedContingent?.ID;
      // result?.Portals[0]?.Product.ID = result?.Portals[0]?.Product.ID;
    } else if (data?.selectedContingentType === "Fixed")
      result.ContingentID = data?.selectedContingent?.ID;
    else result.ContingentID = data?.selectedContingent?.ID;

    delete result.selectedContingentType;
    // delete result.PaymentMode
  }
  if (data.ReciveApplicationType === "Link") {
    result.ApplicationLinkOrEmail = data.applicationLinkUrl;
    delete result.applicationLinkUrl;
  }

  result.Portals = result.Portals.map((item) => ({
    ApplicationLinkOrEmail: item.ApplicationLinkOrEmail,
    GermanWide: item.GermanWide,
    ID: item.ID,
    Locations: item.Locations,
    ProductName: item.ProductName,
    Remote: item.Remote,
  }));

  // Convert result to FormData
  const formData = new FormData();

  // Handle file upload separately
  if (data?.JobAdType === "FileUpload" && data?.uploadedAd) {
    formData.append("jobAdFile", data.uploadedAd);
    delete result.jobAdFile; // Remove from JSON since we're adding it separately
  }

  // Convert nested objects and arrays to JSON strings
  for (const key in result) {
    if (typeof result[key] === "object" && result[key] !== null) {
      formData.append(key, JSON.stringify(result[key]));
    } else {
      formData.append(key, result[key]);
    }
  }

  return formData;
};
