import * as z from "zod";
import { isValidUrlOrEmail } from "../../utils/stringHelpers";

const step1Schema = z
  .object({
    AdvertiserCompany: z.object({
      value: z.string().min(1, "Field is required"),
      label: z.string().min(1, "Field is required"),
    }),
    RecieverCompany: z.object({
      value: z.string().min(1, "Field is required"),
      label: z.string().min(1, "Field is required"),
    }),
    CostCenter: z.string().optional(),
    ReleaseType: z.union([
      z.object({
        value: z.string().min(1, "Field is required").or(z.date()),
        label: z.string().min(1, "Field is required"),
      }),
      z.literal("ASAP"),
    ]),
    applicationDeadlineDate: z.date().optional().nullable(),
    SalaryType: z.enum(["MONTHLY", "YEARLY", ""]).nullable(),
    SalaryMonths: z
      .object({ value: z.number(), label: z.string() })
      .optional()
      .nullable(),
    SalaryFrom: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().optional()
    ),
    SalaryTo: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().optional()
    ),
    JobReference: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate salary fields if SalaryType is set
    if (data.SalaryType) {
      let hasSalaryError = false;

      // Check if salary range is provided when SalaryType is set
      if (!data.SalaryFrom) {
        hasSalaryError = true;
      }

      if (!data.SalaryTo) {
        hasSalaryError = true;
      }

      // For MONTHLY type, check duration
      if (data.SalaryType === "MONTHLY" && !data.SalaryMonths) {
        hasSalaryError = true;
      }

      // If any salary-related field is missing, show the generic message
      if (hasSalaryError) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter proper salary range details",
          path: ["SalaryFrom"],
        });
        return; // Exit early since we've shown the generic message
      }

      // Validate range if both values are provided
      if (data.SalaryFrom && data.SalaryTo) {
        if (Number(data.SalaryFrom) >= Number(data.SalaryTo)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Maximum salary must be greater than minimum salary",
            path: ["SalaryTo"],
          });
        }
      }
    }
  });

//REVIEW: remove 'contingent', replace it with 'free', 'budget' and 'fixed'
const step2Schema = z
  .object({
    BookType: z.enum(["Bundle", "Custom", "Contingent"]),
    portalsCart: z.array(z.unknown()).optional(),
    selectedPresetBundle: z.record(z.unknown()).optional(),
    selectedContingent: z.record(z.unknown()).optional(),
    presetBundleCatagory: z.record(z.unknown()).optional(),
    productCatagory: z.record(z.unknown()).optional(),
  })
  .superRefine((data, ctx) => {
    // Bundle type validations
    if (data.BookType === "Bundle") {
      // Only validate bundle-specific fields
      if (
        !data.presetBundleCatagory ||
        Object.keys(data.presetBundleCatagory).length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["presetBundleCatagory"],
          message: "Preset bundle category is required.",
        });
      }
      if (
        !data.selectedPresetBundle ||
        Object.keys(data.selectedPresetBundle).length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selectedPresetBundle"],
          message: "Selected preset bundle is required.",
        });
      }
    }

    // Custom type validations
    if (data.BookType === "Custom") {
      // Only validate custom-specific fields
      if (
        !data.productCatagory ||
        Object.keys(data.productCatagory).length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["productCatagory"],
          message: "Product category is required.",
        });
      }
      if (!data.portalsCart || data.portalsCart.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["portalsCart"],
          message: "Portals cart must have at least one item.",
        });
      }
    }

    // Contingent type validations
    if (data.BookType === "Contingent") {
      // Only validate contingent-specific fields
      if (
        !data.selectedContingent ||
        Object.keys(data.selectedContingent).length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selectedContingent"],
          message: "Selected contingent is required.",
        });
      }
    }
  });

const step3Schema = z
  .object({
    JobAdType: z.enum(["WorkBench", "AlreadyPublished", "FileUpload", "Link"]), // Required and limited to these values
    copyContentsFromAd: z
      .union([
        z.object({
          ID: z.number().optional(),
          _id: z.string().optional(),
        }),
        z.string()
      ])
      .refine(
        (val) => {
          // If it's a string, it's invalid
          if (typeof val === 'string') {
            return false;
          }
          // If it's an object, it's valid
          return true;
        },
        {
          message: "Please select a valid advertisement to copy content from",
          path: ["copyContentsFromAd"]
        }
      )
      .optional(),
    uploadedAd: z.instanceof(File).optional(),
    adDetailsLink: z
      .string()
      .optional()
      .refine(
        (val) => {
          // If it's not null, it must be a valid URL or email
          if (val && !isValidUrlOrEmail(val)) {
            return false;
          }
          return true;
        },
        {
          message:
            "A valid URL or email address is required when no file is uploaded.",
        }
      ),
    publishAdChoice: z.string().optional(),
    selectedTemplate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.JobAdType === "FileUpload") {
      // If JobAdType is "upload"

      // Check if both uploadedAd and adDetailsLink are null
      if (!data.uploadedAd && !data.adDetailsLink) {
        ctx.addIssue({
          path: ["uploadedAd", "adDetailsLink"], // Attach issue to both fields
          message: "Please fill in either the uploaded file or the link.",
        });
      }

      // If uploadedAd is null, adDetailsLink must be a valid URL or email
      if (!data.uploadedAd) {
        if (!data.adDetailsLink || !isValidUrlOrEmail(data.adDetailsLink)) {
          ctx.addIssue({
            path: ["adDetailsLink"],
            message:
              "A valid URL or email address is required when no file is uploaded.",
          });
        }
      }

      // When uploadedAd is not null, validate publishAdChoice
      if (data.uploadedAd) {
        if (!data.publishAdChoice) {
          ctx.addIssue({
            path: ["publishAdChoice"],
            message:
              "Publish choice ('template' or 'create') is required when a file is uploaded.",
          });
        }

        // If publishAdChoice is 'template', selectedTemplate must not be null
        if (data.publishAdChoice === "template" && !data.selectedTemplate) {
          ctx.addIssue({
            path: ["selectedTemplate"],
            message:
              "Template selection is required when 'template' is chosen as the publish choice.",
          });
        }
      }
    }

    // If JobAdType is not "upload", apply your previous logic for copyContentsFromAd
    if (data.JobAdType !== "FileUpload") {
      if (
        !data.copyContentsFromAd ||
        Object.keys(data.copyContentsFromAd).length === 0
      ) {
        ctx.addIssue({
          path: ["copyContentsFromAd"],
          message: "Selection of an ad is required when not uploading.",
        });
      }
    }
  });

const step4Schema = z.object({
  isLocationsValid: z.boolean().refine((val) => val === true, {
    message: "Please select valid locations",
  }),
});

const step5Schema = z
  .object({
    ReciveApplicationType: z.enum(["Email", "Link", "MultiLink"], {
      errorMap: () => ({ message: "Please select an application type" }),
    }),
    applicationLinkType: z.enum(["single", "separate"]).optional(),
    applicationLinkUrl: z.string().optional(),
    ApplicationLinkOrEmail: z.string().optional(),
    applicationLinksValid: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Email type validation
    if (data.ReciveApplicationType === "Email") {
      if (!data.ApplicationLinkOrEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please provide an email address",
          path: ["ApplicationLinkOrEmail"],
        });
      }
    }

    // Link type validations
    if (data.ReciveApplicationType === "Link") {
      if (!data.applicationLinkType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an application link type",
          path: ["applicationLinkType"],
        });
      } else if (data.applicationLinkType === "single") {
        if (!data.applicationLinkUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide an application URL",
            path: ["applicationLinkUrl"],
          });
        } else if (!/^https?:\/\/\S+$/.test(data.applicationLinkUrl)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid URL format",
            path: ["applicationLinkUrl"],
          });
        }
      } else if (data.applicationLinkType === "separate") {
        if (!data.applicationLinksValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide valid application links.",
            path: ["applicationLinksValid"],
          });
        }
      }
    }
  });

export const getFinalValidation = () => {
  const schema = z.object({
    PaymentMode: z.enum(["manual", "stripe"], {
      errorMap: () => ({ message: "Please select a valid payment mode" }),
    }),
  });
  return schema;
};

// Merge schemas based on the active step
export const getStepSchema = (step) => {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    case 3:
      return step3Schema;
    case 4:
      return step4Schema;
    case 5:
      return step5Schema;
    default:
      return z.object({});
  }
};
