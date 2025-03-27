import React from "react";
import ChoiceSelectorModal from "../modals/ChoiceSelector";
import TabView from "../common/TabView";
import PublicTemplates from "./components/PublicTemplates";
import PrivateTemplates from "./components/PrivateTemplates";
import { useTranslation } from "react-i18next";

const TemplatePicker = ({
  visible,
  setVisible, 
  company,
  selectedTemplate,
  onSelect,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 0,
      title: t("strings.publicTemplates"),
      component: (
        <PublicTemplates
          selectedTemplate={selectedTemplate}
          onSelect={onSelect}
        />
      ),
    },
    {
      id: 1,
      title: t("strings.privateTemplates"),
      component: (
        <PrivateTemplates
          company={company}
          selectedTemplate={selectedTemplate}
          onSelect={onSelect}
        />
      ),
    },
  ];

  return (
    <ChoiceSelectorModal
      gridStyle=""
      visible={visible}
      renderChoices={() => (
        <TabView
          containerStyles="w-full h-full"
          tabs={tabs}
          onTabChange={(tab) => {
            console.log(tab);
          }}
        />
      )}
      title={t("strings.templates")}
      text={t("strings.startByChoosingTemplate")}
      onConfirm={() => {
        setVisible(false);
      }}
      onClose={() => setVisible(false)}
    />
  );
};

export default TemplatePicker;
