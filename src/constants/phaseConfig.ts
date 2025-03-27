import { TFunction } from "i18next";

export interface PhaseAction {
  name: string;
  background: string;
  foreground: string;
  label: string;
}

export interface InnerAction {
  editable: boolean;
  editLabel: string;
  editIcon: string;
  actions?: Array<{
    next: number;
    label: string;
    icon: string;
    showType: string;
    color?: string;
  }>;
}

export interface Phase {
  sort: number;
  multiple: boolean;
  name: string;
  title: string;
  action: PhaseAction | null;
  icon: string;
  innerAction?: InnerAction;
  steps?: Phase[];
}

export const getPhasesList = (t: TFunction): Phase[] => [
  {
    sort: 1,
    multiple: false,
    name: "Create ad",
    title: t("strings.createAd"),
    action: null,
    icon: "pencil",
  },
  {
    sort: 2,
    multiple: true,
    name: "",
    title: "",
    action: null,
    icon: "",
    steps: [
      {
        sort: 2,
        multiple: false,
        name: "Proofread ad",
        title: t("strings.proofreadAd"),
        action: null,
        icon: "file-text",
      },
      {
        sort: 2.1,
        multiple: false,
        name: "Modifying ad",
        title: t("strings.modifyingAd"),
        action: null,
        icon: "edit",
      },
    ],
  },
  {
    sort: 3,
    multiple: false,
    name: t("strings.waitForClientApproval"),
    title: t("strings.waitForClientApproval"),
    action: {
      name: t("buttonLabels.reviewAd"),
      background: "#094B96",
      foreground: "White",
      label: t("buttonLabels.reviewAd"),
    },
    icon: "hourglass",
    innerAction: {
      editable: true,
      editLabel: t("buttonLabels.modifyListing"),
      editIcon: "edit",
      actions: [
        {
          next: 4,
          label: t("buttonLabels.approveAd"),
          icon: "check-circle",
          showType: "always",
          color: "bg-[#094B96] text-white hover:bg-[#094B96]/90",
        },
        {
          next: 2.1,
          label: t("buttonLabels.jobAdBuilder"),
          icon: "edit-3",
          showType: "edit",
          color: "bg-[#FFD700] text-black hover:bg-[#FFD700]/90",
        },
      ],
    },
  },
  {
    sort: 4,
    multiple: true,
    name: "",
    title: "",
    action: null,
    icon: "",
    steps: [
      {
        sort: 4,
        multiple: false,
        name: t("strings.adApproved"),
        title: t("strings.adApproved"),
        action: null,
        icon: "check-circle-2",
      },
      {
        sort: 5,
        multiple: false,
        name: t("strings.adBookedOrCommissioned"),
        title: t("strings.adBookedOrCommissioned"),
        action: null,
        icon: "briefcase",
      },
    ],
  },
  {
    sort: 6,
    multiple: true,
    name: "",
    title: "",
    action: null,
    icon: "",
    steps: [
      {
        sort: 6,
        multiple: false,
        name: t("strings.onlineCheck"),
        title: t("strings.onlineCheck"),
        action: null,
        icon: "check",
      },
      {
        sort: 7,
        multiple: false,
        name: t("strings.online"),
        title: t("strings.online"),
        action: null,
        icon: "globe",
      },
      {
        sort: 8,
        multiple: false,
        name: t("strings.offline"),
        title: t("strings.offline"),
        action: null,
        icon: "power-off",
      },
    ],
  },
];
