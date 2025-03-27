import React from "react";
import Popover from "../../../components/common/PopoverActions.tsx";
import { MoreSquareIcon } from "../../../components/icons";
import {
  ClipboardCloseIcon,
  CloudChangeIcon,
  DocumentDownloadIcon,
  DocumentTextIcon,
  LinkIcon,
} from "../../../components/icons";
import ListView from "../../../components/common/ListView";
import { useTranslation } from "react-i18next";

const Actions = () => {
  const { t } = useTranslation();
  const orderActionItems = [
    {
      type: "item",
      color: "normal",
      title: t("shortStrings.requestCorrection"),
      icon: <CloudChangeIcon />,
      onClick: () => window.open("https://google.com", "_blank"),
    },
    {
      type: "item",
      color: "normal",
      title: t("shortStrings.viewInvoice"),
      icon: <DocumentTextIcon />,
      onClick: () => window.open("https://google.com", "_blank"),
    },
    {
      type: "item",
      color: "normal",
      title: t("shortStrings.previewLink"),
      icon: <LinkIcon />,
      onClick: () => window.open("https://google.com", "_blank"),
    },
    {
      type: "item",
      color: "normal",
      title: t("shortStrings.downloadAsPdf"),
      icon: <DocumentDownloadIcon />,
      onClick: () => window.open("https://google.com", "_blank"),
    },
    {
      type: "separator",
      color: "normal",
    },
    {
      type: "item",
      color: "danger",
      title: t("shortStrings.takeOffline"),
      icon: <ClipboardCloseIcon />,
      onClick: () => window.open("https://google.com", "_blank"),
    },
  ];
  return (
    <Popover
      mode="select"
      title={t("buttonLabels.actions")}
      content={
        <ListView
          style="max-h-64 overflow-hidden overflow-y-auto"
          items={orderActionItems}
        />
      }
      placement="bottomRight"
    >
      <MoreSquareIcon />
    </Popover>
  );
};

export default Actions;
