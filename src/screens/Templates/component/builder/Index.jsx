// This component provides a complete interface for building and editing job advertisement templates.
// It includes elements selection, styling options, dynamic sections, fields, dataset configurations,
// and theme/color management, as well as saving draft states and publishing options.

import React, { useState, useEffect } from "react";
import { Container, Heading, Left, Right, Title, MainContent, Sidebar, RightContent, PreviewArea, ElementBox, MainCntrols, Sections, Section, SideHead, SectionContaier, SectionContaieritem, MainContainer, MainBox, ElementTemplateContainer, ElementTemplateHeading, Fields, Field, AddField, Accordian, AccordianContent, AccordianTitle, TemplateAction } from "./styles.js";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../../../api";
// import { IconButton, TabButtons, Button } from "../elements";
// import { GetIcon } from "../../../icons";
import { useTranslation } from "react-i18next";
import MediaPicker from "../../../../components/MediaPicker";
// import { NoData } from "../list/styles";
// import { StyledRoundNo } from "../../project/pages/approval/styles";
// import AutoForm from "../autoform/AutoForm";
// import { INPUT_TYPES, UnifiedInput } from "./UnifiedInput";
// import StyledColorBoxTheme, { getColorVars } from "./themeColors";
// import { ImageButton } from "../imageselector/Imagebutton";
// import { TemplateFields } from "./templateFields";
// import FloatingButtonDrawer from "./FloatingButtonDrawer";
// import DraggableList from "./draggableList";
import { TemplateFields } from "./templateFields";
import FloatingButtonDrawer from "./FloatingButtonDrawer";
import DraggableList from "./draggableList";
import { INPUT_TYPES, UnifiedInput } from "./UnifiedInput";
import CodeEditor from "../../../../components/common/CodeEditor.jsx";
import { getColorVars } from "../../../../utils/getColorVaribales";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonComponent } from "../../../../components/common/Button";
import { TabButtons } from "../../../../components/common/tabButton";
import { GetCustomIcon } from "../../../../components/icons/index";
import ColorBoxItem from "../../../JobAdView/components/ColorBox.jsx";
import { ArrowLeft, Settings, Maximize2, Minimize2, Copy, Plus, Trash2, Layout, FileJson, Code, ListTree, ChevronDown, ChevronUp, Image, Edit } from "lucide-react";
import { avathar, defaultIcon } from "../../../../assets/images/index.ts";
import Accordion from "../../../../components/Accordion/index.tsx";
import useToast from "../../../../hooks/useToast.ts";
import useConfirm from "../../../../hooks/useConfirm.tsx";
import DynamicForm from "../../../../components/common/DynamicForm";
// import { ElementTemplateContainer } from "./styles.js";
// Predefined ratio options for image fields
// These are static and do not depend on any component state.
const RATIO_OPTIONS = [
  { id: 5 / 2, value: "Logo/LQ Image", width: 5, height: 2 },
  { id: 3 / 1, value: "3:1 (Wide Logo)", width: 3, height: 1 },
  { id: 4 / 1, value: "4:1 (Extra Wide Logo)", width: 4, height: 1 },
  { id: 5 / 1, value: "5:1 (Super Wide Logo)", width: 5, height: 1 },
  { id: 6 / 1, value: "6:1 (Ultra Wide Logo)", width: 6, height: 1 },
  { id: 1, value: "1:1 (Quadratisch)", width: 1, height: 1 },
  { id: 4 / 3, value: "4:3 (Standardformat)", width: 4, height: 3 },
  { id: 16 / 9, value: "16:9 (Breitbild)", width: 16, height: 9 },
  { id: 5 / 2, value: "5:2 (Landschaftsformat)", width: 5, height: 2 },
  { id: 3 / 2, value: "3:2 (Leicht breiter als hoch)", width: 3, height: 2 },
  { id: 2 / 1, value: "2:1 (Panoramaformat)", width: 2, height: 1 },
  { id: 9 / 16, value: "9:16 (Hochformat)", width: 9, height: 16 },
  { id: 2 / 3, value: "2:3 (Portrait)", width: 2, height: 3 },
  { id: 4 / 5, value: "4:5 (Portrait)", width: 4, height: 5 },
  { id: 3 / 1, value: "3:1 (Wide Banner)", width: 3, height: 1 },
  { id: 5 / 4, value: "5:4 (Leicht quadratisch)", width: 5, height: 4 },
  { id: 21 / 9, value: "21:9 (Ultra-Widescreen)", width: 21, height: 9 },
  { id: 16 / 10, value: "16:10 (Widescreen)", width: 16, height: 10 },
  { id: 1140 / 456, value: "Hero/LQ Image", width: 1140, height: 456 },
];

// Extracted helper functions for clarity and maintainability.
// These functions do not depend on component state directly, and can be pure utilities.

/**
 * Extracts variables from the given htmlTemplate and determines which variables exist or not in fields.
 * @param {string} htmlTemplate - The HTML template containing variables like {variableName}.
 * @param {Array} fields - Array of field objects with a name property.
 * @param {Object} currentSection - The currently selected section object, used to check VariableSupport.
 * @returns {{exist: string[], notExist: string[]}} Object with arrays of variables found and not found in fields.
 */
function getVariablesExistAndNotExist(htmlTemplate, fields, currentSection) {
  const variableMatches = htmlTemplate.match(/\{([^}]+)\}/g);
  const variableNames = variableMatches ? variableMatches.map((v) => v.replace(/[{}]/g, "")) : [];
  const exist = [];
  const notExist = [];
  const fieldNamesSet = new Set(fields ? fields.map((field) => field.name) : []);

  variableNames.forEach((variable) => {
    if (fieldNamesSet.has(variable)) {
      exist.push(variable);
    } else {
      // Check if variable might be supported by VariableSupport
      const searchTerms = currentSection?.VariableSupport?.split(",").map((item) => item.trim().split(":")?.[0]);
      if (searchTerms?.includes(variable)) {
        notExist.push(variable);
      }
    }
  });

  return {
    exist,
    notExist,
  };
}

/**
 * Renders an element's HTML template replacing variables with sample values.
 * @param {number} key - Unique key index.
 * @param {Object} template - The template object containing fields and htmlTemplate.
 * @returns {JSX.Element} The rendered template as an ElementBox component.
 */
function renderElement(key = 0, template) {
  const getFieldValue = (fieldName, isChild = false, childfield) => {
    if (!template.fields) return "sampleText";
    const field = isChild ? childfield.fields?.find((item) => item.name === fieldName) : template.fields.find((item) => item.name === fieldName);
    if (!field) return `{${fieldName}(Not found)}`;

    // For image type fields, return sample image placeholder
    if (field.type === "image" || field.type === "lq-image") {
      return field.sampleImage || "sampleImage";
    }

    // For text fields, return sample text
    if (field.type === "text") {
      return field.sampleText || "sampleText1";
    }

    // For list fields, process each item in dataset
    if (field.type === "list") {
      const tmpl = field.htmlTemplate;
      if (!field.dataset || !Array.isArray(field.dataset)) {
        return "No dataset available";
      }
      return field.dataset
        .map((dataItem) => {
          return tmpl?.replace(/{([^{}]+)}/g, (match, variable) => {
            const trimmedVar = variable.trim();
            return dataItem[trimmedVar] || getFieldValue(trimmedVar, true, field);
          });
        })
        .join("");
    }

    return field.sampleText;
  };

  const processTemplate = (htmlString) => {
    if (!htmlString) return "";
    return htmlString.replace(/{([^{}]+)}/g, (match, variable) => {
      const trimmedVar = variable.trim();
      const value = getFieldValue(trimmedVar);
      return value;
    });
  };

  const processedHtml = `<div class="body">${processTemplate(template.htmlTemplate)}</div>`;
  return <ElementBox className="scroll" onClick={() => {}} key={key} gridSpan={4} dangerouslySetInnerHTML={{ __html: processedHtml }} />;
}

/**
 * Creates heading, description, list, and LQ (liquid) image sets from a template,
 * given fields and dataset info, simulating "liquid" content generation.
 * @param {string} template - The HTML template string with variables.
 * @param {Array} data - Fields array from the template.
 * @param {Object} fieldData - Field data object (usually sample or actual data).
 * @param {Object} childData - Child dataset if any.
 * @returns {{heading: string, description: string, list: string[], LQ: string[]}}
 */
function CreateLquid(template, data, fieldData, childData) {
  const matches = template.match(/\{(.*?)\}/g) || [];
  const heading = [];
  const description = [];
  const list = [];
  const LQ = [];

  for (const match of matches) {
    const key = match.replace(/[{}]/g, "");
    const field = data?.find((field) => field.name === key);
    if (!field) {
      // No field found for this variable
    } else if (field.type === "lq-image") {
      const value = fieldData?.[key] || field.sampleLqImage;
      LQ.push(value);
    } else if (field && field.type !== "image") {
      if (field.type === "list") {
        // Handle nested lists
        const childTemplate = field;
        if (childTemplate) {
          const dataset = field.dataset ?? [];
          const childDataItem = childData?.[key] ?? [];
          const childFields = childTemplate.fields;

          for (let i = 0; i < dataset.length; i++) {
            let childHead = [],
              childDescription = [];
            let childHtml = childTemplate.htmlTemplate;
            let childHtmlOut = [];
            const childMatches = childHtml.match(/\{(.*?)\}/g) || [];

            for (const childMatch of childMatches) {
              const childKey = childMatch.replace(/[{}]/g, "");
              const childField = childFields?.find((field) => field.name === childKey);

              if (childField) {
                if (childField.type === "text") {
                  let childReplacement = childDataItem?.[i]?.[childKey] || dataset?.[i]?.[childKey] || childField.sampleText;
                  childHead.push(childReplacement);
                } else if (childField.type === "textarea") {
                  let childReplacement = childDataItem?.[i]?.[childKey] || dataset?.[i]?.[childKey] || childField.sampleText;
                  childDescription.push(childReplacement);
                }
              }
            }
            childHead.length > 0 && childHtmlOut.push(childHead.join(", "));
            childDescription.length > 0 && childHtmlOut.push(childDescription.join(", "));
            if (childHtmlOut.length === 1) {
              list.push(childHtmlOut.join(""));
            } else if (childHtmlOut.length === 2) {
              list.push(`<strong>${childHtmlOut[0]}</strong>: ${childHtmlOut[1]}`);
            }
          }
        }
      } else {
        // For text or textarea fields
        if ((field.type === "text" || field.type === "textarea") && field.type !== "image") {
          const value = fieldData?.[key] || field.sampleText;
          if (value) {
            if (field.type === "text") heading.push(value);
            if (field.type === "textarea") description.push(value);
          }
        }
      }
    }
  }
  return { heading: heading.join(","), description: description.join(","), list, LQ };
}

/**
 * Creates the liquid HTML view of a template using LQ, heading, description, and list data.
 * @param {number} key - Unique key index.
 * @param {Object} template - Template object containing fields and htmlTemplate.
 * @returns {JSX.Element} The rendered liquid preview.
 */
function CreateLquidHtml(key = 0, template) {
  const fields = template.fields ?? [];
  const fieldData = [];
  const childData = [];
  const { heading, description, list, LQ } = CreateLquid(template.htmlTemplate, fields, fieldData, childData);
  const LQs = LQ.map((url) => `<img style="max-width:100%;" src="${url}" alt="" />`).join("");
  const htmlOutput =
    LQ?.length > 0
      ? `<div class="box">${LQs}</ div>`
      : ` <div class="box" style="padding:30px;">
          ${heading ? `<h1 data-bmo-itemprop="jobBenefits-title">${heading}</h1>` : ""}  
          <div itemprop="jobBenefits">  
            ${description ? description : ""}  
            ${
              list?.length > 0
                ? `  
                <ul style="margin:20px;">  
                  ${list.map((item) => `<li>${item}</li>`).join("")}  
                </ul>  
              `
                : ""
            }  
          </div>  
        </div>  
      `;
  return <ElementBox onClick={() => {}} key={key} gridSpan={4} dangerouslySetInnerHTML={{ __html: htmlOutput }} />;
}

const TemplateBuilder = () => {
  const toast = useToast();
  const { showConfirm } = useConfirm();
  const [template, setTemplate] = useState(null);
  const [loaderBox, setLoaderBox] = useState(false);
  // State hooks for managing various aspects of the template builder
  const [screenSize, setScreenSize] = useState("Desktop"); // Tracks the selected screen size for preview
  const [currentSectionsTemplates, setCurrentSectionsTemplates] = useState([]); // Holds templates for the currently selected section
  const [selectionType, setSelectionType] = useState("Elements"); // Toggles between selecting elements or styles
  const [currentSection, setCurrentSection] = useState(null); // The currently selected element section
  const [currentSectionElement, setCurrentSectionElement] = useState(null); // Stores configuration of the selected element section
  const [mainCss, setMainCss] = useState(""); // Holds main CSS content (draft styles, colors, etc.)
  const [openedStyles, setOpenedStyles] = useState([false, false, false]); // Controls expanded/collapsed accordions in styles panel
  const [colors, setColors] = useState(null); // Holds the selected color theme
  const [cssVariables, setCssVariables] = useState(getColorVars(colors)); // Manages CSS color variables based on theme colors
  const [templateData, setTemplateData] = useState([]); // Full template data from API
  const [templateSections, setTemplateSections] = useState(null); // Data regarding the arrangement/order of template sections
  const { t } = useTranslation(); // i18n translation hook
  const [sections, setSections] = useState([]); // Available element types fetched from API
  const [isOpen, setIsOpen] = useState(null); // Controls the state of an AutoForm modal for configuration
  const [jobAdLoaded, setJobAdLoaded] = useState("");
  const { id } = useParams();
  const [imagePickerVisible, setImagePickerVisible] = useState(null);
  // Fetching initial template data from API
  useEffect(() => {
    const getJobAd = async () => {
      const response = await getRequest("templates", { params: { ID: id } });
      setTemplateData(response.data.template);
      setTemplate(response.data.template);
      setTemplateSections(response.data.sections);
      setMainCss(response.data.templateData);
      setColors(response.data.templateData.colors);
      setCssVariables(getColorVars(response.data.templateData.colors));
    };
    if (!jobAdLoaded) {
      getJobAd();
    }
    setJobAdLoaded(true);
  }, [id, jobAdLoaded]);

  // Save draft styles or other configuration to server
  const saveDraft = async (post) => {
    const response = await putRequest("templates/data", { reference: mainCss.reference, ...post });
    if (response.status === 200) {
      setMainCss(response.data.templateData);
      toast.success(response.data.message);
    }
  };

  // Fetch element templates for the selected section
  const getElmentTemplates = async (element) => {
    setLoaderBox(true);
    setCurrentSection(element);
    const response = await getRequest("templates/sections", { params: { section: element.key, reference: id } });
    if (response.status === true) {
      const elements = response.data.sections.map((item, index) => {
        const fields = item.fields ? JSON.parse(item.fields) : [];
        const dataset = item.dataset ? JSON.parse(item.dataset) : [];
        const { exist, notExist } = getVariablesExistAndNotExist(item.htmlTemplate, fields, element);
        return { ...item, exist, notExist, fields, dataset, ...(index === 0 ? { opened: true } : {}) };
      });
      setCurrentSectionsTemplates(elements);
      setCurrentSectionElement(response.data.element);
    }
    setLoaderBox(false);
  };

  // Fetch available sections (element types) from API on mount
  useEffect(() => {
    const ProcessData = async () => {
      const response = await getRequest("ad-builder/element-types");
      setSections(response);
    };
    ProcessData();
  }, []);

  // Dynamically inject CSS (draftStyles + color variables) into the page
  useEffect(() => {
    const style = document.createElement("style");
    try {
      style.type = "text/css";
      style.innerHTML = cssVariables + mainCss.draftStyles.replace("none", "");
      style.id = "mobile-styles";

      const modifyMediQueryToCanvas = () => {
        // Replace @media with @container in CSS for a different responsive approach
        style.innerHTML = style.innerHTML.replace(/@media/g, "@container");
        style.innerHTML = style.innerHTML.replace("body", ".body");
        style.innerHTML = style.innerHTML.replace("none", "");
      };

      modifyMediQueryToCanvas();
      document.head.appendChild(style);
    } catch (err) {
      console.log(err);
    }
    return () => {
      // document.head.removeChild(style);
    };
  }, [mainCss.draftStyles, cssVariables]);

  // Add a new element template within the current section
  const AddNewElementTemplate = async (templateItemid = null, isCone = false) => {
    const response = await postRequest("template/section", { exist: isCone ? templateItemid : "", section: currentSection.key, reference: id });
    if (response.status === 200) {
      const fields = response.data.response.fields ? JSON.parse(response.data.response.fields) : [];
      const { exist, notExist } = getVariablesExistAndNotExist(response.data.response.htmlTemplate, fields, currentSection);
      setCurrentSectionsTemplates((prev) => [...prev, { ...response.data.response, exist, notExist, fields }]);
    }
  };

  // Update the order of jobAd template sections
  const UpdateJobadOrder = async (post) => {
    try {
      const response = await postRequest("template/order", { reference: id, data: JSON.stringify(post) });
      if (response.status === 200) {
        setTemplateSections(response.data.TemplateSections);
        toast.success(response.data.message);
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  // Update an element template with new data
  const UpdateElementTemplate = async (post) => {
    const response = await putRequest("template/section", { ...post });
    if (response.status === 200) {
      const fields = response.data.response.fields ? JSON.parse(response.data.response.fields) : [];
      const { exist, notExist } = getVariablesExistAndNotExist(response.data.response.htmlTemplate, fields, currentSection);
      setCurrentSectionsTemplates((prev) => prev.map((item) => (item._id === post.id ? { ...item, ...response.data.response, opened: item.opened, status: item.status, exist, notExist, fields } : item)));
      toast.success(response.data.message);
      const { isDefault, title, _id } = response.data.response;

      setTemplateSections((prev) => {
        if (!isDefault) {
          return prev.filter((section) => section._id !== _id);
        } else {
          const sectionExists = prev.some((section) => section._id === _id);
          if (!sectionExists) {
            const highestOrder = prev.length > 0 ? Math.max(...prev.map((section) => section.defaultOrder || 0)) : -1;
            const newOrder = highestOrder + 1;
            return [...prev, { title, _id, defaultOrder: newOrder }];
          } else {
            return prev.map((section) => (section._id === _id ? { ...section, title } : section));
          }
        }
      });
    }
  };

  // Delete an element template
  const DeleteElementTemplate = async (post) => {
    const response = await deleteRequest("template/section", { ...post });
    if (response.status === 200) {
      setCurrentSectionsTemplates((prev) => prev.filter((item) => item._id !== post.id));
      toast.success(response.data.message);
    }
  };

  // Add a new field to a template's fields array
  const handleAddField = async (item, index, fieldIndex) => {
    try {
      const type = currentSection.VariableSupport.split(",")
        .map((entry) => entry.trim().split(":"))
        .find(([variable]) => variable === item)?.[1];

      const newField = {
        name: item,
        label: item,
        content: "",
        sample: "Sample",
        type: type,
      };

      const newSections = [...currentSectionsTemplates];

      if (typeof fieldIndex === "number") {
        // If adding a nested field (in case of list fields)
        if (!newSections[index].fields[fieldIndex].fields) {
          newSections[index].fields[fieldIndex].fields = [];
        }
        newSections[index].fields[fieldIndex].fields.push(newField);

        const { exist, notExist } = getVariablesExistAndNotExist(newSections[index].fields[fieldIndex].htmlTemplate, newSections[index].fields[fieldIndex].fields, currentSection);
        newSections[index].fields[fieldIndex] = {
          ...newSections[index].fields[fieldIndex],
          exist,
          notExist,
        };
      } else {
        // For top-level fields
        if (!newSections[index].fields) newSections[index].fields = [];
        newSections[index].fields.push(newField);

        const { exist, notExist } = getVariablesExistAndNotExist(newSections[index].htmlTemplate, newSections[index].fields, currentSection);
        newSections[index] = { ...newSections[index], exist, notExist };
      }

      await UpdateElementTemplate({
        id: newSections[index]._id,
        fields: JSON.stringify(newSections[index].fields),
      });
      setCurrentSectionsTemplates(newSections);
    } catch (error) {
      console.error("Error adding field:", error);
    }
  };

  // Remove a field from a template
  const handleDeleteField = async (templateIndex, fieldIndex, fieldChildIndex) => {
    try {
      const newTemplates = [...currentSectionsTemplates];
      const templateToUpdate = newTemplates[templateIndex];
      let updatedFields;

      if (typeof fieldChildIndex === "number") {
        updatedFields = templateToUpdate.fields[fieldIndex].fields.filter((_, idx) => idx !== fieldChildIndex);
        const { exist, notExist } = getVariablesExistAndNotExist(templateToUpdate.fields[fieldIndex].htmlTemplate, updatedFields, currentSection);
        templateToUpdate.fields[fieldIndex] = {
          ...templateToUpdate.fields[fieldIndex],
          fields: updatedFields,
          exist,
          notExist,
        };
      } else {
        updatedFields = templateToUpdate.fields.filter((_, idx) => idx !== fieldIndex);
        const { exist, notExist } = getVariablesExistAndNotExist(templateToUpdate.htmlTemplate, updatedFields, currentSection);
        newTemplates[templateIndex] = {
          ...templateToUpdate,
          fields: updatedFields,
          exist,
          notExist,
        };
      }

      await UpdateElementTemplate({
        id: templateToUpdate._id,
        fields: JSON.stringify(updatedFields),
      });

      setCurrentSectionsTemplates(newTemplates);
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  // Update dataset rows for list fields
  const handleUpdateFieldDataset = async (templateIndex, fieldIndex, post, update = true, rowIndex) => {
    try {
      const newTemplates = [...currentSectionsTemplates];
      const templateToUpdate = newTemplates[templateIndex];
      if (templateToUpdate) {
        templateToUpdate.fields[fieldIndex].dataset[rowIndex] = { ...templateToUpdate.fields[fieldIndex].dataset[rowIndex], ...post };
        await UpdateElementTemplate({
          id: templateToUpdate._id,
          fields: JSON.stringify(templateToUpdate.fields),
        });
      }
      setIsOpen(null);
    } catch {}
  };

  // Update configuration of the section element itself
  const handleUpdateElement = async (id, post) => {
    try {
      const response = await putRequest("template/element", { id, ...post });
      if (response.status === 200) {
        setCurrentSectionElement(response.data.response);
        showToast(response.data.message);

        setIsOpen(null);
      }
    } catch (ee) {}
  };

  // Update a single field's data (like sampleText, demo count, etc.)
  const handleUpdateField = async (templateIndex, fieldIndex, post, update = true, fieldChildIndex) => {
    try {
      const newTemplates = [...currentSectionsTemplates];
      const templateToUpdate = newTemplates[templateIndex];

      if (typeof fieldChildIndex === "number") {
        templateToUpdate.fields[fieldIndex].fields[fieldChildIndex] = {
          ...templateToUpdate.fields[fieldIndex].fields[fieldChildIndex],
          ...post,
        };
      } else {
        if (post.demo !== undefined) {
          const currentDataset = templateToUpdate.fields[fieldIndex].dataset ?? [];
          const newDemoCount = parseInt(post.demo);

          // Adjust the number of dataset rows based on new demo count
          if (!templateToUpdate.fields[fieldIndex].dataset) {
            templateToUpdate.fields[fieldIndex].dataset = [];
          }

          if (currentDataset.length < newDemoCount) {
            const startIndex = currentDataset?.length || 0;
            const newRows = Array.from({ length: newDemoCount - currentDataset.length }, (_, idx) => ({
              _id: startIndex + idx + 1,
            }));
            templateToUpdate.fields[fieldIndex].dataset = [...currentDataset, ...newRows];
          } else if (currentDataset.length > newDemoCount) {
            templateToUpdate.fields[fieldIndex].dataset = currentDataset.slice(0, newDemoCount);
          }
        }

        templateToUpdate.fields[fieldIndex] = {
          ...templateToUpdate.fields[fieldIndex],
          ...post,
        };
      }
      if (update) {
        await UpdateElementTemplate({
          id: templateToUpdate._id,
          fields: JSON.stringify(templateToUpdate.fields),
        });
      }
      setCurrentSectionsTemplates(newTemplates);
      setIsOpen(null);
    } catch (error) {
      console.error("Error updating field:", error);
      throw error;
    }
  };
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col h-screen bg-white">
      <div className="flex items-center h-[60px] border-b px-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="flex items-center text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-md px-3 py-1.5 text-sm">
            <ArrowLeft size={18} className="mr-1.5" />
            Go Back
          </button>

          {/* <div className="h-5 w-[1px] bg-[#E5E7EB] mx-4" />

          <button disabled={!jobadChanged} className="flex items-center text-[#6B7280] hover:text-[#111827] disabled:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <RotateCcw size={18} className="mr-1.5" />
            Reset
          </button>

          <button disabled={history.length <= 1} className="flex items-center text-[#6B7280] hover:text-[#111827]  disabled:opacity-50 disabled:cursor-not-allowed">
            <CornerUpLeft size={20} className="mr-1" />
            Undo
          </button>

          <button disabled={history.length <= 1} className="flex items-center text-[#6B7280] hover:text-[#111827] disabled:opacity-50 disabled:cursor-not-allowed">
            <CornerUpRight size={20} className="mr-1" />
            Redo
          </button> */}
        </div>

        <div className="text-center font-medium text-base flex-1 text-[#111827]">{templateData?.Title}</div>

        <div className="flex items-center space-x-2">
          <div className="flex justify-center p-2 border-b">
            <div className="flex gap-2 bg-gray-100 p-1 rounded">
              <button className={`p-1 rounded ${screenSize === "desktop" ? "bg-white shadow" : ""}`} onClick={() => setScreenSize("desktop")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </button>
              <button className={`p-1 rounded ${screenSize === "tablet" ? "bg-white shadow" : ""}`} onClick={() => setScreenSize("tablet")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12" y2="18"></line>
                </svg>
              </button>
              <button className={`p-1 rounded ${screenSize === "mobile" ? "bg-white shadow" : ""}`} onClick={() => setScreenSize("mobile")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <button
            onClick={async () => {
              console.log("publish");
            }}
            disabled={true}
            className="px-4 py-1.5 text-sm font-medium bg-[#094B96] text-white rounded-md hover:bg-[#083A73] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish Ad
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Elements and Styles */}
        <div className="w-[350px] border-r border-[#E5E7EB] overflow-y-auto p-4 bg-[#FFFFFF]">
          <div className="flex p-3 gap-2 p-3 bg-blue-500 p-3  rounded-md bg-[#F1F7FE]">
            <button
              className={`flex-1 py-2 px-4 text-center rounded-md text-[14px] ${selectionType === "Elements" ? "bg-white text-[#094B96] font-medium border border-[#82BCF7]" : "text-[#6B7280] bg-white/60"}`}
              onClick={() => {
                setSelectionType("Elements");
              }}
            >
              Elements
            </button>
            <button className={`flex-1 py-2 px-4 text-center rounded-md text-[14px] ${selectionType === "styles" ? "bg-white text-[#094B96] font-medium border border-[#82BCF7]" : "text-[#6B7280] bg-white/60"}`} onClick={() => setSelectionType("styles")}>
              Styles
            </button>
          </div>
          <div className={`grid grid-cols-2 gap-3 p-3 mt-3 rounded-md bg-[#F1F7FE] ${selectionType === "Elements" ? "block" : "hidden"}`}>
            {sections?.map((element, index) => (
              <div key={index} className={`flex flex-col items-center justify-center aspect-[5/4] bg-white rounded shadow-sm hover:shadow cursor-pointer ${currentSection?.key === element.key ? "border border-[#094B96]" : ""}`} onClick={() => getElmentTemplates(element)}>
                <span className="text-[#094B96] mb-2 text-2xl">
                  <img src={element.Icon} alt={""} onError={(e) => (e.currentTarget.src = defaultIcon)} />
                </span>
                <span className="text-[12px] text-[#094B96]">{element.name}</span>
              </div>
            ))}
          </div>

          <div className={`mb-4 mt-3 bg-[#F1F7FE] rounded-md p-3 ${selectionType === "styles" ? "block" : "hidden"}`}>
            <Accordion.Root>
              <Accordion.Title
                style={{ cursor: "pointer" }}
                isOpen={openedStyles[0]}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenedStyles((prev) => prev.map((value, index) => (index === 0 ? !value : value)));
                }}
              >
                Style Content
              </Accordion.Title>
              <Accordion.Content className={`${openedStyles[0] ? "block" : "hidden"}`}>
                <CodeEditor
                  language="css"
                  value={mainCss.draftStyles}
                  onChange={async (value) => {
                    await saveDraft({ draftStyles: value });
                  }}
                  label="Main CSS"
                  placeholder={"Paste you CSS content here!"}
                />
              </Accordion.Content>
            </Accordion.Root>
            <Accordion.Root>
              <Accordion.Title
                isOpen={openedStyles[1]}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenedStyles((prev) => prev.map((value, index) => (index === 1 ? !value : value)));
                }}
              >
                Color Theme
              </Accordion.Title>
              <Accordion.Content className={`${openedStyles[1] ? "block" : "hidden"}`}>
                <ColorBoxItem
                  key={"color-select"}
                  onChange={(cssVariables) => {
                    setCssVariables(cssVariables);
                  }}
                  initialColors={colors}
                  updateColors={async (colors) => {
                    await saveDraft({ colors });
                  }}
                />
              </Accordion.Content>
            </Accordion.Root>
            <Accordion.Root>
              <Accordion.Title
                isOpen={openedStyles[2]}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenedStyles((prev) => prev.map((value, index) => (index === 2 ? !value : value)));
                }}
              >
                Meta & Settings
              </Accordion.Title>

              <Accordion.Content className={`${openedStyles[2] ? "block" : "hidden"}`}>
                <div className="form">
                  <CodeEditor
                    value={mainCss.fontReference}
                    onChange={async (value) => {
                      await saveDraft({ fontReference: value });
                    }}
                    label="Font Tags"
                    placeholder={"Paste your font Tag here!"}
                  />
                  <div className="mt-2">
                    <div className="flex flex-col gap-3">
                      <div className="text-sm ">LQ Background Image</div>
                      <img src={template?.["backgroundImage"] ? template?.["backgroundImage"] : avathar} alt="" onError={(e) => (e.currentTarget.src = defaultImage)} className="w-full h-auto object-cover aspect-[16/9]" />
                      <ButtonComponent
                        onClick={() => {
                          setImagePickerVisible({ visible: true, id: "backgroundImage", CompanyID: templateData?.CompanyID, aspectWidth: 1, aspectHeight: 1 });
                        }}
                        title="LQ Background Image"
                        icon={<Edit size={18} />}
                      ></ButtonComponent>
                    </div>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Root>
          </div>
        </div>
        <div className="flex-1  bg-gray-100">
          {currentSection && (
            <ElementTemplateHeading>
              <MainCntrols>
                <div className="head"> {currentSection?.name}</div>
                <div className="head">
                  <ButtonComponent
                    onClick={() => {
                      // Opens a configuration form for the selected section type
                      setIsOpen({
                        submitHandler: (post) => {
                          handleUpdateElement(currentSectionElement._id, post);
                        },
                        submit: "Update",
                        api: "/template/element",
                        header: `Configure ${currentSection?.name}`,
                        description: "",
                        attributes: [
                          {
                            type: "select",
                            apiType: "CSV",
                            radioButton: true,
                            selectApi: "Swap,Multiple",
                            placeholder: "Template Usage Type",
                            name: "type",
                            showItem: "",
                            validation: "",
                            default: currentSectionElement.type ?? "Multiple",
                            label: "Template Usage Type",
                            required: true,
                            view: true,
                            add: true,
                            update: true,
                          },
                          {
                            type: "number",
                            placeholder: "Minimum Template Can be used",
                            name: "minimum",
                            showItem: "",
                            validation: "",
                            condition: {
                              item: "type",
                              if: "Multiple",
                              then: "enabled",
                              else: "disabled",
                            },
                            default: currentSectionElement.minimum ?? 1,
                            label: "Minimum Template Can be used",
                            required: true,
                            view: true,
                            add: true,
                            update: true,
                          },
                          {
                            type: "number",
                            placeholder: "Maximum Template Can be used",
                            name: "maximum",
                            showItem: "",
                            validation: "",
                            condition: {
                              item: "type",
                              if: "Multiple",
                              then: "enabled",
                              else: "disabled",
                            },
                            default: currentSectionElement.maximum ?? 1,
                            label: "Maximum Template Can be used",
                            required: true,
                            view: true,
                            add: true,
                            update: true,
                          },
                        ],
                      });
                    }}
                    label="Configuration"
                    icon={<Settings size={18} />}
                  ></ButtonComponent>
                </div>
              </MainCntrols>
            </ElementTemplateHeading>
          )}
          {/* Render templates for the currently selected section */}
          {currentSectionsTemplates?.length > 0 ? (
            currentSectionsTemplates.map((templateItem, index) => {
              return (
                <div className="flex flex-col gap-2" key={templateItem.id || index}>
                  <MainCntrols view={screenSize}>
                    <div className="head">
                      <div className="rounded-full bg-primary-600 text-white w-6 h-6 flex items-center justify-center">{index + 1}</div>
                    </div>
                    {/* Tabs for switching between demo view, liquid view, HTML editing, fields editing, and settings */}
                    <TabButtons
                      tabs={[
                        { icon: <Layout size={16} />, title: "Respo", key: index + "demo" },
                        { icon: <FileJson size={16} />, title: "Liquid", key: index + "Liquid" },
                        { icon: <Code size={16} />, title: "Code", key: index + "HTML" },
                        { icon: <ListTree size={16} />, title: "Fields", key: index + "Fields" },
                        { icon: <Settings size={16} />, title: "Settings", key: index + "Settings" },
                        { icon: templateItem.opened ? <ChevronUp size={16} /> : <ChevronDown size={16} />, title: "", key: index + "action" },
                      ]}
                      selectedTab={templateItem.status || (index === 0 ? index + "demo" : "")}
                      selectedChange={(val) =>
                        setCurrentSectionsTemplates((prev) => {
                          return prev.map((item, i) => (i === index ? { ...item, status: val === index + "action" ? item.status : val, opened: val === index + "action" ? !(item.opened ?? false) : true } : item));
                        })
                      }
                    />
                  </MainCntrols>
                  {templateItem.opened ? (
                    templateItem.status === index + "demo" || !templateItem.status ? (
                      <PreviewArea fullScreen={templateItem.fullscreen} className="respo" view={screenSize}>
                        {renderElement(templateItem.id, templateItem)}
                        <TemplateAction>
                          <ButtonComponent
                            onClick={() =>
                              setCurrentSectionsTemplates((prev) => {
                                return prev.map((item, i) => (i === index ? { ...item, fullscreen: !(item.fullscreen ?? false) } : item));
                              })
                            }
                            align="center"
                            title={templateItem.fullscreen ? "Close Screen" : "Full Screen"}
                            icon={templateItem.fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                          ></ButtonComponent>
                          <ButtonComponent
                            onClick={async () => {
                              showConfirm({
                                message: `Are you sure to clone this Template Item?`,
                                onConfirm: async () => {
                                  console.log(templateItem._id);
                                  AddNewElementTemplate(templateItem._id, true);
                                },
                              });
                            }}
                            align="center"
                            title={"Clone to New"}
                            icon={<Copy size={18} />}
                          ></ButtonComponent>
                        </TemplateAction>
                      </PreviewArea>
                    ) : templateItem.status === index + "HTML" ? (
                      <MainBox>
                        <CodeEditor
                          language="html"
                          value={templateItem.htmlTemplate}
                          onChange={(value) => {
                            UpdateElementTemplate({ id: templateItem._id, htmlTemplate: value });
                          }}
                          varibales={currentSection.VariableSupport?.split(",").map((item) => item.trim().split(":")?.[0])}
                          label="HTML Template"
                          placeholder={"Paste you HTML content here!"}
                        />
                      </MainBox>
                    ) : templateItem.status === index + "Fields" ? (
                      <TemplateFields templateItem={templateItem} index={index} handleUpdateField={handleUpdateField} ratioOptions={RATIO_OPTIONS} template={{ ID: id }} handleDeleteField={handleDeleteField} getVariablesExistAndNotExist={(html, fields) => getVariablesExistAndNotExist(html, fields, currentSection)} AddField={AddField} handleAddField={handleAddField} handleUpdateFieldDataset={handleUpdateFieldDataset} setIsOpen={setIsOpen} />
                    ) : templateItem.status === index + "Liquid" ? (
                      <PreviewArea view={screenSize}>{templateItem.enableLiquid ? CreateLquidHtml(templateItem.id, templateItem) : <div>Liquid not enabled!</div>}</PreviewArea>
                    ) : templateItem.status === index + "Settings" ? (
                      <MainBox>
                        <Fields>
                          <Field>
                            <table>
                              <thead>
                                <tr>
                                  <th colSpan={2}>
                                    <Heading>
                                      <GetCustomIcon icon={"settings"}></GetCustomIcon>
                                      <span>Settings</span>
                                    </Heading>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Display settings fields and handle updates */}
                                {[
                                  {
                                    label: "Title",
                                    type: INPUT_TYPES.TEXT,
                                    props: {
                                      value: templateItem.title,
                                      selected: templateItem.title,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, title: val }),
                                    },
                                  },
                                  {
                                    label: "Section Type",
                                    type: INPUT_TYPES.SINGLE_SELECT,
                                    props: {
                                      options: ["Container", "Section"],
                                      selected: templateItem.sectionType,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, sectionType: val }),
                                    },
                                  },
                                  {
                                    label: "Add Limit",
                                    type: INPUT_TYPES.SINGLE_SELECT,
                                    props: {
                                      options: ["1", "2", "3", "4", "Any"],
                                      selected: templateItem.addLimit.toString(),
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, addLimit: val }),
                                    },
                                  },
                                  {
                                    label: "Thumbnail Image",
                                    type: INPUT_TYPES.IMAGE,
                                    props: {
                                      min: 1,
                                      value: templateItem.thumbnail || 1,
                                      label: "Thumbnail Image",
                                      height: 9,
                                      width: 16,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, thumbnail: val }),
                                    },
                                  },
                                  {
                                    label: "Add to Default",
                                    type: INPUT_TYPES.BOOLEAN,
                                    props: {
                                      value: templateItem.isDefault,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, isDefault: val }),
                                    },
                                  },
                                  {
                                    label: "Is Mandatory",
                                    type: INPUT_TYPES.BOOLEAN,
                                    props: {
                                      value: templateItem.isMandatory,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, isMandatory: val }),
                                    },
                                  },
                                  {
                                    label: "Enable Template",
                                    type: INPUT_TYPES.BOOLEAN,
                                    props: {
                                      value: templateItem.status,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, status: val }),
                                    },
                                  },
                                  {
                                    type: INPUT_TYPES.HEADING,
                                    label: "Liquid Markings",
                                    icon: "filter",
                                  },
                                  {
                                    label: "Enable Liquid",
                                    type: INPUT_TYPES.BOOLEAN,
                                    props: {
                                      value: templateItem.enableLiquid,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, enableLiquid: val }),
                                    },
                                  },
                                  ...(templateItem.enableLiquid
                                    ? [
                                        {
                                          label: "Liquid Options",
                                          type: INPUT_TYPES.SINGLE_SELECT,
                                          props: {
                                            options: ["description", "responsibilities", "qualifications", "jobBenefits", "contact"],
                                            selected: templateItem.liquidMarker,
                                            onChange: (val) => UpdateElementTemplate({ id: templateItem._id, liquidMarker: val }),
                                            renderLabel: (span) => span,
                                          },
                                        },
                                      ]
                                    : []),
                                  {
                                    type: INPUT_TYPES.HEADING,
                                    label: "Desktop Grid Options",
                                    icon: "desktop",
                                  },
                                  {
                                    label: "Grid Options",
                                    type: INPUT_TYPES.MULTI_SELECT,
                                    props: {
                                      options: [1, 2, 3, 4],
                                      selected: templateItem.gridOptions,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, gridOptions: val }),
                                      renderLabel: (span) => "| ".repeat(span),
                                    },
                                  },
                                  {
                                    label: "Choose Default Grid",
                                    type: INPUT_TYPES.SINGLE_SELECT,
                                    props: {
                                      options: templateItem.gridOptions || [],
                                      selected: templateItem.defaultGrid,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, defaultGrid: val }),
                                      renderLabel: (span) => "| ".repeat(span),
                                    },
                                  },
                                  {
                                    type: INPUT_TYPES.HEADING,
                                    label: "Tablet Grid Options",
                                    icon: "tablet",
                                  },
                                  {
                                    label: "Applicable Grid Options",
                                    type: INPUT_TYPES.MULTI_SELECT,
                                    props: {
                                      options: [2, 3, 4],
                                      selected: templateItem.tabletGridOptions,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, tabletGridOptions: val }),
                                      renderLabel: (span) => "| ".repeat(span),
                                    },
                                  },
                                  {
                                    label: "Choose Default Grid",
                                    type: INPUT_TYPES.SINGLE_SELECT,
                                    props: {
                                      options: templateItem.tabletGridOptions || [],
                                      selected: templateItem.defaultTabletGrid,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, defaultTabletGrid: val }),
                                      renderLabel: (span) => "| ".repeat(span),
                                    },
                                  },
                                  {
                                    type: INPUT_TYPES.HEADING,
                                    label: "Mobile Grid Options",
                                    icon: "mobileview",
                                  },
                                  {
                                    label: "Applicable Grid Options",
                                    type: INPUT_TYPES.MULTI_SELECT,
                                    props: {
                                      options: [2, 4],
                                      selected: templateItem.mobileGridOptions,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, mobileGridOptions: val }),
                                      renderLabel: (span) => "| ".repeat(span),
                                    },
                                  },
                                  {
                                    label: "Choose Default Grid",
                                    type: INPUT_TYPES.SINGLE_SELECT,
                                    props: {
                                      options: templateItem.mobileGridOptions || [],
                                      selected: templateItem.defaultMobileGrid,
                                      onChange: (val) => UpdateElementTemplate({ id: templateItem._id, defaultMobileGrid: val }),
                                      renderLabel: (span) => "| ".repeat(span),
                                    },
                                  },
                                ].map((setting, idx) => (
                                  <tr key={idx} className={setting.type}>
                                    {setting.type === INPUT_TYPES.HEADING ? (
                                      <td colSpan={2}>
                                        <Heading>
                                          {setting.icon && <GetCustomIcon icon={setting.icon}></GetCustomIcon>}
                                          <span> {setting.label}</span>
                                        </Heading>
                                      </td>
                                    ) : (
                                      <React.Fragment>
                                        <td>
                                          <span>{setting.label}</span>
                                        </td>
                                        <td>
                                          <UnifiedInput type={setting.type} {...setting.props} />
                                        </td>
                                      </React.Fragment>
                                    )}
                                  </tr>
                                ))}
                                <tr className="HEADING">
                                  <td colSpan={2} style={{ justifyItems: "right" }}>
                                    <ButtonComponent
                                      onClick={async () => {
                                        showConfirm({
                                          message: `Are you sure to delete this Template?`,
                                          onConfirm: async () => {
                                            DeleteElementTemplate({ id: templateItem._id });
                                          },
                                        });
                                      }}
                                      align="small delete red"
                                      title="Delete"
                                      icon={<Trash2 size={18} />}
                                    ></ButtonComponent>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Field>
                        </Fields>
                      </MainBox>
                    ) : null
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full">No {currentSection?.name} template added!</div>
          )}
          {currentSection && (
            <MainCntrols view={screenSize}>
              <ButtonComponent icon={<Plus size={18} />} title="Add New Template" onClick={() => AddNewElementTemplate()}></ButtonComponent>
            </MainCntrols>
          )}
        </div>
        {/* Drawer for managing the order of default jobAd layers */}
        {templateSections && <FloatingButtonDrawer title={"Default JobAd Layers"} drawerContent={<DraggableList data={templateSections} onChange={(data) => UpdateJobadOrder(data)} />}></FloatingButtonDrawer>}
        {/* AutoForm modal for configuration if triggered */}
        {isOpen && <DynamicForm attributes={isOpen.attributes} onSubmit={isOpen.submitHandler} onClose={() => setIsOpen(null)} header={isOpen.header} description={isOpen.description} submitText={isOpen.submit} />}
        {imagePickerVisible && (
          <MediaPicker
            companyId={imagePickerVisible.CompanyID || null}
            aspectWidth={imagePickerVisible.aspectWidth || 1}
            aspectHeight={imagePickerVisible.aspectHeight || 1}
            visible={imagePickerVisible.visible}
            onClose={() => setImagePickerVisible(null)}
            onSelect={async (image, imageId) => {
              await saveDraft({ [imagePickerVisible.id]: image + "?" + imageId });
              setImagePickerVisible(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TemplateBuilder;
