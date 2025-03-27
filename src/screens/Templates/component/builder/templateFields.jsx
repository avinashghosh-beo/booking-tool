import React from "react";
//import { IconButton } from "../elements";
import { Field, Fields, MainBox, Title } from "./styles";
import { avathar } from "../../../../assets/images";
import CodeEditor from "../../../../components/common/CodeEditor";
// import CodeEditor from "../../../../components/common/CodeEditor";
import { ButtonComponent } from "../../../../components/common/Button";
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, RotateCw } from "lucide-react";

export const TemplateFields = ({ templateItem, index, handleUpdateField, ratioOptions, template, handleDeleteField, getVariablesExistAndNotExist, AddField, handleAddField, handleUpdateFieldDataset, setIsOpen }) => {
  return (
    <MainBox>
      <Fields>
        <Field>
          <table>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Type</th>
                <th>Label</th>
                <th>Content</th>
                <th>Liquid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templateItem.fields?.length > 0 ? (
                templateItem.fields?.map((item, fieldIndex) => (
                  <React.Fragment>
                    <tr key={item.name || fieldIndex}>
                      <td>{`{${item.name}}`}</td>
                      <td>{item.type || "N/A"}</td>
                      <td>{item.label || "N/A"}</td>
                      <td>{item.type === "list" ? `Demo: ${item.demo}, Limit: ${item.limit}` : item.type === "lq-image" ? <img src={item.sampleImage} alt={item.type} /> : item.type === "image" ? <img src={item.sampleImage} alt={item.type} /> : item.sampleText}</td>
                      <td>{item.liquidMarker || "N/A"}</td>
                      <td>
                        <span>
                          {item.type === "list" && (
                            <ButtonComponent
                              size="sm"
                              icon={item.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              title="Template"
                              onClick={() => {
                                handleUpdateField(index, fieldIndex, { fields: item.fields ?? [], open: item.open ? false : true }, false);
                              }}
                            />
                          )}
                          <ButtonComponent
                            size="sm"
                            icon={<Edit size={16} />}
                            title="Edit"
                            onClick={() => {
                              setIsOpen({
                                submitHandler: (post) => {
                                  handleUpdateField(index, fieldIndex, post);
                                },
                                submit: "Update Now",
                                api: "mock/update",
                                header: `Configure field for {${item.name}}`,
                                description: "",
                                attributes: [
                                  {
                                    type: "text",
                                    placeholder: "Label",
                                    name: "label",
                                    showItem: "",
                                    validation: "",
                                    default: item.label ?? "", //add exisitng data if needed
                                    label: "Label",
                                    required: true,
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                  {
                                    type: "select",
                                    placeholder: "Input Type",
                                    listView: true,
                                    radioButton: true,
                                    name: "type",
                                    validation: "",
                                    default: item.type,
                                    label: "Input Type",
                                    required: true,
                                    view: true,
                                    customClass: "list",
                                    add: true,
                                    update: true,
                                    apiType: "JSON",
                                    search: false,
                                    selectApi: [
                                      { value: "Text", id: "text" },
                                      { value: "Image", id: "image" },
                                      { value: "Liquid/Image", id: "lq-image" },
                                      { value: "Textarea", id: "textarea" },
                                      { value: "List", id: "list" },
                                    ],
                                  },
                                  {
                                    type: "textarea",
                                    placeholder: "Sample",
                                    name: "sampleText",
                                    showItem: "",
                                    validation: "",
                                    default: item.sampleText ?? "", //add exisitng data if needed
                                    label: "Sample",
                                    arrayOut: true,
                                    required: true,
                                    condition: {
                                      item: "type",
                                      if: "textarea",
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                  {
                                    type: "textarea",
                                    placeholder: "Sample",
                                    name: "sampleText",
                                    showItem: "",
                                    validation: "",
                                    default: item.sampleText ?? "", //add exisitng data if needed
                                    label: "Sample",
                                    arrayOut: true,
                                    required: true,
                                    condition: {
                                      item: "type",
                                      if: "text",
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                  {
                                    // Select input with options loaded from JSON data
                                    type: "select",
                                    placeholder: "Aspect Ratio",
                                    name: "ratio",
                                    condition: {
                                      item: "type",
                                      if: ["image", "lq-image"],
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    validation: "",
                                    default: item.ratio,
                                    label: "Aspect Ratio",
                                    required: true,
                                    onChange: (name, updateValue) => {
                                      const { ratioArray } = updateValue;
                                      updateValue["width"] = ratioArray.width;
                                      updateValue["height"] = ratioArray.height;
                                      return updateValue;
                                    },
                                    arrayOut: true,
                                    view: true,
                                    add: true,
                                    update: true,
                                    filter: false,
                                    apiType: "JSON", // Specifies the data source type as JSON
                                    selectApi: ratioOptions,
                                  },
                                  {
                                    type: "number",
                                    placeholder: "Demo Count",
                                    name: "demo",
                                    showItem: "",
                                    validation: "",
                                    default: item.demo ?? 1, //add exisitng data if needed
                                    label: "Demo Count",
                                    required: true,
                                    condition: {
                                      item: "type",
                                      if: "list",
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                  {
                                    type: "number",
                                    placeholder: "Max Limit",
                                    name: "limit",
                                    showItem: "",
                                    validation: "",
                                    default: item.limit ?? 1, //add exisitng data if needed
                                    label: "Max Limit",
                                    required: true,
                                    condition: {
                                      item: "type",
                                      if: "list",
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                  {
                                    type: "select",
                                    placeholder: "Exclude From Liquid",
                                    listView: true,
                                    radioButton: true,
                                    condition: {
                                      item: "type",
                                      if: ["image", "lq-image"],
                                      then: "disabled",
                                      else: "enabled",
                                    },
                                    name: "excludeLiquid",
                                    validation: "",
                                    default: item.excludeLiquid,
                                    label: "Exclude From Liquid",
                                    required: true,
                                    view: true,
                                    customClass: "list",
                                    add: true,
                                    update: true,
                                    apiType: "JSON",
                                    search: false,
                                    selectApi: [
                                      { value: "Yes", id: "true" },
                                      { value: "No", id: "false" },
                                    ],
                                  },
                                  {
                                    type: "text",
                                    placeholder: "Enable Marker",
                                    listView: true,
                                    radioButton: true,
                                    condition: {
                                      item: "enableLiquid",
                                      if: "true",
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    name: "liquidMarker",
                                    validation: "",
                                    default: item.liquidMarker ?? "",
                                    label: "Liquid Marker",
                                    required: true,
                                    view: true,
                                    customClass: "list",
                                    add: true,
                                    update: true,
                                    apiType: "JSON",
                                    search: false,
                                  },
                                  {
                                    type: "hidden",
                                    placeholder: "height",
                                    name: "height",
                                    showItem: "",
                                    validation: "",
                                    default: item.height ?? 1, //add exisitng data if needed
                                    label: "Height",
                                    required: true,
                                    condition: {
                                      item: "type",
                                      if: "image",
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                  {
                                    type: "hidden",
                                    placeholder: "Width",
                                    name: "width",
                                    showItem: "",
                                    validation: "",
                                    default: item.width ?? 1, //add exisitng data if needed
                                    label: "Width",
                                    required: true,
                                    condition: {
                                      item: "type",
                                      if: "image",
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                  {
                                    type: "image",
                                    placeholder: "Sample",
                                    name: "sampleImage",
                                    showItem: "",
                                    validation: "",
                                    DynamicRatio: true,
                                    default: item.sampleImage ?? "", //add exisitng data if needed
                                    references: { height: item.height ?? 1, width: item.width ?? 1, Category: "template", template: template.ID, Company: template.CompanyId, type: "image" },
                                    label: "Sample",
                                    required: true,
                                    condition: {
                                      item: "type",
                                      if: ["image", "lq-image"],
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                  {
                                    type: "image",
                                    placeholder: "Sample LQ Image",
                                    name: "sampleLqImage",
                                    showItem: "",
                                    validation: "",
                                    default: item.sampleLqImage ?? "", //add exisitng data if needed
                                    references: { height: 456, width: 1140, Category: "template", template: template.ID, Company: template.CompanyId, type: "image" },
                                    label: "Sample LQ Image",
                                    required: true,
                                    condition: {
                                      item: "type",
                                      if: ["lq-image"],
                                      then: "enabled",
                                      else: "disabled",
                                    },
                                    view: true,
                                    add: true,
                                    update: true,
                                  },
                                ],
                              });
                            }}
                          />
                          <ButtonComponent
                            size="sm"
                            icon={<Trash2 size={16} />}
                            onClick={() => {
                              handleDeleteField(index, fieldIndex);
                            }}
                          />
                        </span>
                      </td>
                    </tr>
                    {item.type === "list" && item.open && (
                      <tr>
                        <td colSpan={6}>
                          <div>
                            <CodeEditor
                              language="html"
                              value={item.htmlTemplate}
                              onChange={(value) => {
                                // setMainCss();
                                // await saveDraft({ draftStyles: value });
                                // UpdateElementTemplate({ id: templateItem._id, htmlTemplate: value });
                                const { exist, notExist } = getVariablesExistAndNotExist(value, item.fields ?? []);
                                handleUpdateField(index, fieldIndex, { ...item, htmlTemplate: value, exist, notExist });
                              }}
                              label={"List Item " + item.label}
                              varibales={["Title", "Description", "Image"]}
                              placeholder={"Paste you HTML content here!"}
                            ></CodeEditor>
                            {item.notExist?.map((noitem) => (
                              <AddField className="bottom" key={noitem}>
                                <span>
                                  Add new child field '{noitem}' for '{item.name}'
                                </span>
                                <ButtonComponent icon={<Plus size={16} />} onClick={() => handleAddField(noitem, index, fieldIndex)} />
                              </AddField>
                            ))}
                            <Title className="sub">Fields for `{item.label}`</Title>
                            <Field>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Variable</th>
                                    <th>Type</th>
                                    <th>Label</th>
                                    <th>Sample</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.fields?.length > 0 ? (
                                    item.fields?.map((lsitField, fieldChildIndex) => (
                                      <React.Fragment>
                                        <tr key={lsitField.name || fieldChildIndex}>
                                          <td>{`{${lsitField.name}}`}</td>
                                          <td>{lsitField.type || "N/A"}</td>
                                          <td>{lsitField.label || "N/A"}</td>
                                          <td>
                                            {lsitField.type === "image" ? (
                                              <span>
                                                <img src={lsitField.sampleImage} alt={lsitField.type} />
                                              </span>
                                            ) : lsitField.type === "lq-image" ? (
                                              <span>
                                                <img src={lsitField.sampleImage} alt={lsitField.type} />
                                              </span>
                                            ) : (
                                              lsitField.sampleText
                                            )}
                                          </td>
                                          <td>
                                            <span>
                                              <ButtonComponent
                                                size="sm"
                                                icon={<Edit size={16} />}
                                                title="Edit"
                                                onClick={() => {
                                                  setIsOpen({
                                                    submitHandler: (post) => {
                                                      handleUpdateField(index, fieldIndex, post, true, fieldChildIndex);
                                                    },
                                                    submit: "Update Now",
                                                    api: "mock/update",
                                                    header: `Configure field for {${lsitField.name}}`,
                                                    description: "",
                                                    attributes: [
                                                      {
                                                        type: "text",
                                                        placeholder: "Label",
                                                        name: "label",
                                                        showItem: "",
                                                        validation: "",
                                                        default: lsitField.label ?? "", //add exisitng data if needed
                                                        label: "Label",
                                                        required: true,
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                      },
                                                      {
                                                        type: "select",
                                                        placeholder: "Input Type",
                                                        listView: true,
                                                        radioButton: true,
                                                        name: "type",
                                                        validation: "",
                                                        default: lsitField.type,
                                                        label: "Input Type",
                                                        required: true,
                                                        view: true,
                                                        customClass: "list",
                                                        add: true,
                                                        update: true,
                                                        apiType: "JSON",
                                                        search: false,
                                                        selectApi: [
                                                          { value: "Text", id: "text" },
                                                          { value: "Image", id: "image" },
                                                          { value: "Textarea", id: "textarea" },
                                                          { value: "List", id: "list" },
                                                        ],
                                                      },
                                                      {
                                                        type: "textarea",
                                                        placeholder: "Sample",
                                                        name: "sampleText",
                                                        showItem: "",
                                                        validation: "",
                                                        default: lsitField.sampleText ?? "", //add exisitng data if needed
                                                        label: "Sample",
                                                        arrayOut: true,
                                                        required: true,
                                                        condition: {
                                                          item: "type",
                                                          if: "text",
                                                          then: "enabled",
                                                          else: "disabled",
                                                        },
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                      },
                                                      {
                                                        type: "textarea",
                                                        placeholder: "Sample",
                                                        name: "sampleText",
                                                        showItem: "",
                                                        validation: "",
                                                        default: lsitField.sampleText ?? "", //add exisitng data if needed
                                                        label: "Sample",
                                                        arrayOut: true,
                                                        required: true,
                                                        condition: {
                                                          item: "type",
                                                          if: "textarea",
                                                          then: "enabled",
                                                          else: "disabled",
                                                        },
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                      },
                                                      {
                                                        // Select input with options loaded from JSON data
                                                        type: "select",
                                                        placeholder: "Aspect Ratio",
                                                        name: "ratio",
                                                        condition: {
                                                          item: "type",
                                                          if: "image",
                                                          then: "enabled",
                                                          else: "disabled",
                                                        },
                                                        validation: "",
                                                        default: lsitField.ratio,
                                                        label: "Aspect Ratio",
                                                        required: true,
                                                        onChange: (name, updateValue) => {
                                                          const { ratioArray } = updateValue;
                                                          updateValue["width"] = ratioArray.width;
                                                          updateValue["height"] = ratioArray.height;
                                                          return updateValue;
                                                        },
                                                        arrayOut: true,
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                        filter: false,
                                                        apiType: "JSON", // Specifies the data source type as JSON
                                                        selectApi: ratioOptions,
                                                      },
                                                      {
                                                        type: "hidden",
                                                        placeholder: "height",
                                                        name: "Height",
                                                        showItem: "",
                                                        validation: "",
                                                        default: lsitField.height ?? 1, //add exisitng data if needed
                                                        label: "Height",
                                                        required: true,
                                                        condition: {
                                                          item: "type",
                                                          if: "image",
                                                          then: "enabled",
                                                          else: "disabled",
                                                        },
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                      },
                                                      {
                                                        type: "hidden",
                                                        placeholder: "Width",
                                                        name: "width",
                                                        showItem: "",
                                                        validation: "",
                                                        default: lsitField.width ?? 1, //add exisitng data if needed
                                                        label: "Width",
                                                        required: true,
                                                        condition: {
                                                          item: "type",
                                                          if: "image",
                                                          then: "enabled",
                                                          else: "disabled",
                                                        },
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                      },
                                                      {
                                                        type: "image",
                                                        placeholder: "Sample",
                                                        name: "sampleImage",
                                                        showItem: "",
                                                        validation: "",
                                                        height: lsitField.height ?? 1,
                                                        width: lsitField.width ?? 1,
                                                        default: lsitField.sampleImage ?? "", //add exisitng data if needed
                                                        references: { Category: "template", template: template.ID, Company: template.CompanyId },
                                                        label: "sample",
                                                        required: true,
                                                        condition: {
                                                          item: "type",
                                                          if: "image",
                                                          then: "enabled",
                                                          else: "disabled",
                                                        },
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                      },
                                                    ],
                                                  });
                                                }}
                                              />
                                              <ButtonComponent
                                                size="sm"
                                                icon={<Trash2 size={16} />}
                                                onClick={() => {
                                                  handleDeleteField(index, fieldIndex, fieldChildIndex);
                                                }}
                                              />
                                            </span>
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={5}>No fields found!</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </Field>

                            <Title className="sub">
                              Preset Dataset for {item.name}
                              <ButtonComponent size="sm" title="Fill content with AI!" icon={<RotateCw size={16} />} />
                            </Title>
                            <Field>
                              <table>
                                <thead>
                                  <tr>
                                    {item.fields?.map((listField) => (
                                      <th>{listField.label}</th>
                                    ))}
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.dataset?.map((data, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {item.fields?.map((field) => (
                                        <td>{field.type === "lq-image" ? <img src={data?.[field.name] || avathar} alt={field.type} /> : field.type === "image" ? <img src={data?.[field.name] || avathar} alt={field.type} /> : data?.[field.name] || "--"}</td>
                                      ))}
                                      <td>
                                        <span>
                                          <ButtonComponent
                                            size="sm"
                                            icon={<Edit size={16} />}
                                            title="Edit"
                                            onClick={() => {
                                              setIsOpen({
                                                submitHandler: (post) => {
                                                  // handleUpdateField(index, fieldIndex, post, true, fieldChildIndex);
                                                  handleUpdateFieldDataset(index, fieldIndex, post, true, rowIndex);
                                                },
                                                submit: "Update Now",
                                                api: "mock/update",
                                                header: `Edit: ${item.label} (${rowIndex + 1})`,
                                                description: "",
                                                attributes: item.fields?.map((field) =>
                                                  field.type === "image" || field.type === "lq-image"
                                                    ? {
                                                        type: "image",
                                                        placeholder: field.label,
                                                        name: field.name,
                                                        showItem: "",
                                                        validation: "",
                                                        height: field.height ?? 1,
                                                        width: field.width ?? 1,
                                                        value: data?.[field.name] ?? "",
                                                        default: data?.[field.name] ?? "", //add exisitng data if needed
                                                        references: { Category: "template", template: template.ID, Company: template.CompanyId, type: field.type },
                                                        label: field.label,
                                                        required: true,
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                      }
                                                    : {
                                                        type: "text",
                                                        placeholder: field.label,
                                                        name: field.name,
                                                        showItem: "",
                                                        validation: "",
                                                        default: data?.[field.name] ?? "", //add exisitng data if needed
                                                        label: field.label,
                                                        required: true,
                                                        view: true,
                                                        add: true,
                                                        update: true,
                                                      }
                                                ),
                                              });
                                            }}
                                          />
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </Field>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No fields found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </Field>
        {templateItem.notExist?.map((item) => (
          <AddField key={item}>
            <span>Add new field for '{item}'</span>
            <ButtonComponent icon={<Plus size={16} />} onClick={() => handleAddField(item, index)} />
          </AddField>
        ))}
      </Fields>
    </MainBox>
  );
};
