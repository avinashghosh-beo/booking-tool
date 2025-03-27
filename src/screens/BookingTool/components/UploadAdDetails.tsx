import React, { useEffect, useState } from "react";
import { SelectButton } from "../../../components/common/Button";
import FileUploader from "../../../components/common/FileUploader";
import TextInput from "../../../components/InputElements/TextInput";
import { GhostAccordion } from "../../../components/common/Accordion";
import { isValidUrl } from "../../../utils/stringHelpers";
import SeparatorLine from "../../../components/common/SeparatorLine";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import TemplatePicker from "../../../components/TempatePicker";

const PresetLayoutTab = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="max-w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array(10)
          .fill("")
          .map((_, index) => (
            <div className="flex-shrink-0 pb-4" key={index}>
              <div className="grid w-full h-48 mb-4 bg-gray-300 rounded-md place-items-center">
                Image
              </div>
              <SelectButton
                text={"Choose"}
                selected={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

const UploadAdDetails = () => {
  const { t } = useTranslation();
  const {
    setValue,
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const [link, setLink] = useState("");
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidUrl(link) && link !== "")
      setUrlError(t("errorMessages.enterAValidUrl"));
    else setUrlError(null);
  }, [link]);

  const adLayoutTabs = [
    {
      id: 0,
      title: t("shortStrings.youtLayouts"),
      component: <PresetLayoutTab />,
    },
    {
      id: 1,
      title: t("shortStrings.presetLayout"),
      component: <PresetLayoutTab />,
    },
  ];

  return (
    <div className="py-4">
      <p className="block text-sm font-medium text-primary">
        {t("shortStrings.uploadYourAdDoc")}
      </p>
      <GhostAccordion open={link === ""}>
        <div className="flex">
          <FileUploader
            file={watch("uploadedAd") || null}
            setFile={(value) => {
              setValue("uploadedAd", value);
            }}
          />
        </div>
      </GhostAccordion>

      <GhostAccordion open={watch("uploadedAd") === null && link === ""}>
        <SeparatorLine middleText={t("shortStrings.or")} />
      </GhostAccordion>

      <GhostAccordion open={watch("uploadedAd") === null}>
        <div>
          <TextInput
            errorMessages={[urlError]}
            required
            label={t("shortStrings.inputLinkToAd")}
            placeholder={t("shortStrings.enter")}
            type="text"
            id="link"
            onChange={(text) => setLink(text)}
            register={() => register("adDetailsLink")}
          />
        </div>
      </GhostAccordion>

      <GhostAccordion open={watch("uploadedAd") !== null}>
        <div className="pt-4">
          <p>{t("strings.howDoYouWantToPublish")}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectButton
              text={t("strings.selfEntry")}
              onSelect={() => setTemplateModalVisible(true)}
              selected={watch("publishAdChoice") === "template"}
            />
            <SelectButton
              text={t("strings.weCreate")}
              onSelect={() => setValue("publishAdChoice", "create")}
              selected={watch("publishAdChoice") === "create"}
            />
          </div>
        </div>
      </GhostAccordion>
      <TemplatePicker
        company={watch("AdvertiserCompany")}
        visible={templateModalVisible}
        setVisible={setTemplateModalVisible}
        onSelect={(item) => {
          setValue("publishAdChoice", "template");
          setValue("selectedTemplate", item?.ID);
        }}
        selectedTemplate={watch("selectedTemplate")}
      />
    </div>
  );
};

export default UploadAdDetails;
