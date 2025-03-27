let API_URL = import.meta.env.VITE_API;

export const ENDPOINTS = {
  login: "user/login",
  forgotPassword: "user/forgot-password",
  verifyOtp: "user/verify-otp",
  resetPassword: "user/reset-password",
  user: "user",
  orders: "orders/client",
  publishedAds: "stellenanzeigen/published",
  workbenchJobAds: "companies/workbench",
  jobAds: "jobad/approval",
  contacts: "contacts",
  jobAdDetails: "jobad/details",
  elementTypes: "ad-builder/element-types",
  jobad: "jobad",
  portal: "portal",
  bundles: "bundles",
  disableAllBundles: "bundles/disable-all",
  bundlesToggle: "bundles/toggle",
  bundleAccess: "bundles/access",
  companyBundles: "bundles/company",
  publicBundleStatus: "bundles/public-bundles-status",
  favouriteBundles: "bundles/favorite",
  favouriteBundle: "companies/get-favourite-bundle",
  notificationSettings: "notifications/settings",
  updateNotificationSettings: "notifications/update",
  notificationGroups: "notifications/groups",
  bundleCatagories: "bundles/categories",
  productCatagories: "products/categories",
  productActive: "products/active",
  portalsFree: "products/free",
  portalsPaid: "products/paid",
  bookingToolOrder: "orders/create",
  calculatePrice: "orders/calculate-price",
  invoiceSettings: "companies/invoice-settings",
  fixedContingents: "contingent/fixed",
  freeContingents: "contingent/free",
  budgetContingents: "contingent/budget",
  validatePayment: "orders/validate-payment",
  mediaFolders: "media-gallery/folders",
  mediaImages: "media-gallery/images",
  archiveImage: "media-gallery/archive",
  unarchiveImage: "media-gallery/archive/restore",
  sharedImage: "media-gallery/shared/images",
  sharedFolder: "media-gallery/shared/folders",
  companyUsers: "user/company-users",
  addCompanyAccess: "user/add-company",
  removeCompanyAccess: "user/remove-company",
  updateUserPermissions: "user/permissions",
  publicTemplates: "companies/public-templates",
  privateTemplates: "companies/private-templates",
  companyLogo: "companies/update-logo",
  templates: "templates",
  recipientUsers: "user/recipients",
  invoices: "invoices/client",
};
