import React, { useState, useEffect } from "react";
import { GridButton, GridWrapper, NumberInput, ToggleSwitch } from "./styles";
// import { IconButton } from "../elements";
// import { ImageButton } from "../imageselector/Imagebutton";
import { ButtonComponent } from "../../../../components/common/Button";

export const INPUT_TYPES = {
  SINGLE_SELECT: "SINGLE_SELECT",
  TEXT: "TEXT",
  MULTI_SELECT: "MULTI_SELECT",
  BOOLEAN: "BOOLEAN",
  NUMBER: "NUMBER",
  HEADING: "HEADING",
  IMAGE: "IMAGE",
};

export const UnifiedInput = ({ type, options, selected, onChange, label, renderLabel, min, max, value, height, width, className }) => {
  const [tempTextValue, setTempTextValue] = useState(value);
  const [hasChanged, setHasChanged] = useState(false);
  useEffect(() => {
    setTempTextValue(value);
    setHasChanged(false);
  }, [value]);

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setTempTextValue(newValue);
    setHasChanged(newValue !== value);
  };

  const handleSave = () => {
    onChange(tempTextValue);
    setHasChanged(false);
  };
  const renderSingleSelect = () => (
    <GridWrapper className={className}>
      {options?.map((option) => (
        <GridButton key={option} span={option} active={selected === option} onClick={() => onChange(option)}>
          {renderLabel?.(option) || option}
        </GridButton>
      ))}
    </GridWrapper>
  );

  const renderMultiSelect = () => (
    <GridWrapper className={className}>
      {options?.map((option) => (
        <GridButton
          key={option}
          span={option}
          active={selected?.includes(option)}
          onClick={() => {
            const updatedSelection = selected?.includes(option) ? selected.filter((item) => item !== option) : [...(selected || []), option];
            onChange(updatedSelection);
          }}
        >
          {renderLabel?.(option) || option}
        </GridButton>
      ))}
    </GridWrapper>
  );

  const renderBoolean = () => (
    <GridWrapper className={className}>
      <ToggleSwitch>
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span />
      </ToggleSwitch>
    </GridWrapper>
  );

  const renderNumber = () => (
    <GridWrapper className={className}>
      <NumberInput type="number" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value))} />
    </GridWrapper>
  );

  const renderText = () => (
    <GridWrapper className={`${className} flex gap-2`}>
      <NumberInput type="text" value={tempTextValue} onChange={handleTextChange} />
      {hasChanged && <ButtonComponent icon="save" onClick={handleSave} disabled={!hasChanged} />}
    </GridWrapper>
  );
  const renderImage = () => (
    <GridWrapper className={`${className} flex gap-2`}>
      <div>
        {/* <ImageButton
          onChange={async (item, two) => {
            // await saveDraft({ [item]: two });
            // setDataToUpdate((prev) => ({ ...prev, [item]: two }));
            onChange(two);
          }}
          url={value}
          name={"image"}
          label={label}
          height={height}
          width={width}
        ></ImageButton> */}
      </div>
      {hasChanged && <ButtonComponent icon="save" onClick={handleSave} disabled={!hasChanged} />}
    </GridWrapper>
  );
  switch (type) {
    case INPUT_TYPES.SINGLE_SELECT:
      return renderSingleSelect();
    case INPUT_TYPES.MULTI_SELECT:
      return renderMultiSelect();
    case INPUT_TYPES.BOOLEAN:
      return renderBoolean();
    case INPUT_TYPES.NUMBER:
      return renderNumber();
    case INPUT_TYPES.TEXT:
      return renderText();
    case INPUT_TYPES.IMAGE:
      return renderImage();
    default:
      return null;
  }
};
