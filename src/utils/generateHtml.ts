import { getColorVars } from "./getColorVaribales";

export const generateHtml = async (
  liquid,
  jobAd,
  sections,
  styles,
  colors,
  meta = {
    title: "",
    description: "",
    keywords: "",
    location: {
      einsatzort: "",
      postleitzahl: "",
      bewerben: "",
    },
    branding: {
      heroImage: "",
      backgroundImage: "",
      primaryColor: "#F5F5F5",
      secondaryColor: "#00528c",
    },
    template: "1",
    anzeige: "2",
  },
  fontFamily = "https://fonts.googleapis.com/css2?family=Dosis:wght@300;400;500;600;700&display=swap"
) => {
  try {
    const replacePlaceholders = async (template, data, fieldData, childData) => {
      let htmlWithInputs = template;
      const matches = template.match(/\{(.*?)\}/g) || [];
      for (const match of matches) {
        const key = match.replace(/[{}]/g, "");
        const field = data?.find((field) => field.name === key);

        if (field) {
          let replacement = match;
          if (field.type === "list") {
            const childTemplate = field;
            if (childTemplate) {
              let childrenHtml = "";
              const dataset = field.dataset ?? [];
              const childDataItem = childData?.[key] ?? [];
              const childFields = childTemplate.fields;

              for (let i = 0; i < childDataItem.length; i++) {
                let childHtml = childTemplate.htmlTemplate;
                const childMatches = childHtml.match(/\{(.*?)\}/g) || [];

                for (const childMatch of childMatches) {
                  const childKey = childMatch.replace(/[{}]/g, "");
                  const childField = childFields?.find((field) => field.name === childKey);

                  if (childField) {
                    let childReplacement = childMatch;
                    if (childField.type === "parent") {
                      const parentField = data?.find((field) => field.name === childField.name);
                      if (parentField) {
                        childReplacement = fieldData?.[childField.name] ? fieldData[childField.name] : parentField.sampleText;
                      }
                    } else {
                      if (childField.type === "image") {
                        const imageUrl = childDataItem?.[i]?.[childKey] || dataset?.[i]?.[childKey] || childField.sampleImage;
                        childReplacement = imageUrl;
                      } else {
                        childReplacement = childDataItem?.[i]?.[childKey] || dataset?.[i]?.[childKey] || childField.sampleText;
                      }
                    }
                    childHtml = childHtml.replace(childMatch, childReplacement);
                  }
                }
                childrenHtml += childHtml;
              }
              replacement = childrenHtml;
            }
          } else {
            if (field.type === "image" || field.type === "lq-image") {
              const imageUrl = fieldData?.[key] ? fieldData[key] : field.sampleImage;
              replacement = imageUrl;
            } else {
              replacement = fieldData?.[key] ? fieldData[key] : field.sampleText;
            }
          }

          htmlWithInputs = htmlWithInputs.replace(match, replacement);
        }
      }

      return htmlWithInputs;
    };

    const CreateLquid = async (template, data, fieldData, childData) => {
      const matches = template.match(/\{(.*?)\}/g) || [];

      const heading = <any[]>[];
      const description = <any[]>[];
      const list = <any[]>[];
      const LQ = <any[]>[];

      for (const match of matches) {
        const key = match.replace(/[{}]/g, "");
        const field = data?.find((field) => field.name === key);
        if (!field) {
          // No field found for this variable
        } else if (field.type === "lq-image") {
          const value = fieldData?.[key + "LQ"] || field.sampleLqImage;
          LQ.push(value);
        } else if (field && field.type !== "image") {
          if (field.type === "list") {
            const childTemplate = field;
            if (childTemplate) {
              const dataset = field.dataset ?? [];
              const childDataItem = childData?.[key] ?? [];
              const childFields = childTemplate.fields;

              for (let i = 0; i < childDataItem.length; i++) {
                let childHead = <any[]>[],
                  childDescription = <any[]>[];
                let childHtmlOut = <any[]>[];
                const childMatches = childTemplate.htmlTemplate.match(/\{(.*?)\}/g) || [];

                for (const childMatch of childMatches) {
                  const childKey = childMatch.replace(/[{}]/g, "");
                  const childField = childFields?.find((field) => field.name === childKey);

                  if (childField) {
                    if (childField.type === "text") {
                      const childReplacement = childDataItem?.[i]?.[childKey] || dataset?.[i]?.[childKey] || childField.sampleText;
                      childHead.push(childReplacement);
                    } else if (childField.type === "textarea") {
                      const childReplacement = childDataItem?.[i]?.[childKey] || dataset?.[i]?.[childKey] || childField.sampleText;
                      childDescription.push(childReplacement);
                    }
                  }
                }
                if (childHead.length > 0) childHtmlOut.push(childHead.join(", "));
                if (childDescription.length > 0) childHtmlOut.push(childDescription.join(", "));

                if (childHtmlOut.length === 1) {
                  list.push(childHtmlOut.join(""));
                } else if (childHtmlOut.length === 2) {
                  list.push(`<strong>${childHtmlOut[0]}</strong>: ${childHtmlOut[1]}`);
                }
              }
            }
          } else {
            if (field.type === "text") {
              const value = fieldData?.[key] || field.sampleText;
              if (value) heading.push(value);
            }
            if (field.type === "textarea") {
              const value = fieldData?.[key] || field.sampleText;
              if (value) description.push(value);
            }
          }
        }
      }
      return { heading: heading.join(","), description: description.join(","), list, LQ };
    };
    const gridResponsive = `/* Base Grid */ .section { display: grid; gap: 1rem; } /* Desktop (default, above 1024px) */ .section.grid-1 { grid-column: span 1; } .section.grid-2 { grid-column: span 2; } .section.grid-3 { grid-column: span 3; } .section.grid-4 { grid-column: span 4; } /* Tablet (768px to 1024px) */ @media (max-width: 1024px) { .section.tab-1 { grid-column: span 1; } .section.tab-2 { grid-column: span 2; } .section.tab-3 { grid-column: span 3; } .section.tab-4 { grid-column: span 4; } } /* Mobile (below 768px) */ @media (max-width: 767px) { .section.mobile-1 { grid-column: span 1; } .section.mobile-2 { grid-column: span 2; } .section.mobile-3 { grid-column: span 3; } .section.mobile-4 { grid-column: span 4; } } /* Container for sections */ .grid-container { display: grid; grid-template-columns: repeat(4, 1fr); }`;
    const header = `<!DOCTYPE html>  
    <html lang="de">
      <head>  
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />  
        <meta name="viewport" content="width=device-width,initial-scale=1">  
        <meta name="description" content="${meta.description}">  
        <meta name="keywords" content="${meta.keywords}">  
        <title>${meta.company} -- ${meta.title}</title>  
        <!--  
        ##Einsatzort: Dunmylocation  
        ##Postleitzahl: 12345  
        ##Bewerben: https://www.koenigsteiner.com  
        -->  
        <!-- LD // COLORS -->   
        <meta name="brandingPrimaryColor" content="#FFFFFF" />   
        <!-- Background, only on mobile devices -->   
        <meta name="brandingSecondaryColor" content="#0080D0" />   
        <!-- Headlines and links -->  
        <meta name="brandingImageBackground" content="hintergrund.jpg" data-bmo-einpacken="content" />  
        <meta name="bmo-stst-liquid-marker-template" content="${meta.template}">  
        <meta name="bmo-stst-liquid-marker-anzeige" content="${meta.anzeige}">  
        <link rel="preconnect" href="https://fonts.googleapis.com">  
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>  
        <link href="${fontFamily}" rel="stylesheet">  
        <style>*{font-family:"Dosis";}${gridResponsive}${getColorVars(colors)} ${styles || ""}</style>
      </head>`;

    const footer = `</html>`;

    const wrapContainer = (html, liquid, LQ) => {
      if (liquid) {
        const LQs = LQ.flat()
          .map((url) => `<img style="max-width:100%;" src="${url}" alt="" />`)
          .join("");
        return `<body  itemscope="" itemtype="http://schema.org/JobPosting">  
          <div class="container" itemscope="" itemtype="http://schema.org/JobPosting">  
            <div class="box" id="head">  
              <div id="logo">  
                <img src="logo_treffer.png" width="100%" alt="Firmenlogo">  
              </div>  
              <div id="right">  
                <h1>${meta.company}</h1>  
                <h2>${meta.title}</h2>  
                <div id="city">${meta.location.einsatzort}</div>  
              </div>  
              <div class="clear"></div>  
            </div>  
            <div class="banner" id="head">${LQs}</div>  
            ${html}  
          </div>  
        </body>`;
      } else {
        return `<body  itemscope="" itemtype="http://schema.org/JobPosting" class="grid-container">${html}</body>`;
      }
    };

    let content = "";
    const LqImages = [];
    if (liquid) {
      const filteredJobAd = jobAd.filter((item) => {
        const section = sections.find((s) => s.key === item.elementType);
        const template = section?.templates?.find((t) => t._id === item.template);
        return template?.enableLiquid !== false;
      });

      // Partition by SortMode
      const topAds = <any[]>[];
      const middleAds = <any[]>[];
      const bottomAds = <any[]>[];

      for (const ad of filteredJobAd) {
        const section = sections.find((s) => s.key === ad.elementType);
        const sortMode = section?.SortMode || "Middle"; // default "Middle"
        if (sortMode === "Top") topAds.push(ad);
        else if (sortMode === "Bottom") bottomAds.push(ad);
        else middleAds.push(ad);
      }

      // Sort topAds by section.sortOrder
      topAds.sort((a, b) => {
        const sectionA = sections.find((item) => item.key === a.elementType);
        const sectionB = sections.find((item) => item.key === b.elementType);
        return (sectionA?.sortOrder || 0) - (sectionB?.sortOrder || 0);
      });

      // Sort middleAds with original logic
      middleAds.sort((a, b) => {
        const sectionA = sections.find((item) => item.key === a.elementType);
        const sectionB = sections.find((item) => item.key === b.elementType);

        const sortOrderComparison = (sectionA?.sortOrder || 0) - (sectionB?.sortOrder || 0);
        if (sortOrderComparison !== 0) {
          return sortOrderComparison;
        }

        const elementTypeComparison = (a.elementType || "").localeCompare(b.elementType || "");
        if (elementTypeComparison !== 0) {
          return elementTypeComparison;
        }

        const templateA = sectionA?.templates?.find((item) => item._id === a.template);
        const templateB = sectionB?.templates?.find((item) => item._id === b.template);

        return (templateB?.isMandatory || false) - (templateA?.isMandatory || false);
      });

      // Sort bottomAds by section.sortOrder
      bottomAds.sort((a, b) => {
        const sectionA = sections.find((item) => item.key === a.elementType);
        const sectionB = sections.find((item) => item.key === b.elementType);
        return (sectionA?.sortOrder || 0) - (sectionB?.sortOrder || 0);
      });

      // A helper function to render ads using CreateLquid logic
      const renderLquidBlock = async (element) => {
        const section = sections.find((item) => item.key === element.elementType);
        const template = section?.templates?.find((item) => item._id === element.template);
        if (!template) {
          return `<!--Template not found for ${element.elementType}-->`;
        }
        const fields = JSON.parse(template.fields?.length > 0 ? template.fields : "[]");
        const fieldData = element.data;
        const childData = element.childData;

        const { heading, description, list, LQ } = await CreateLquid(template.htmlTemplate, fields, fieldData, childData);
        const liquidMarker = template.liquidMarker || "middle"; // default marker if not provided
        // const LQs = LQ.flat()
        //   .map((url) => `<img style="max-width:100%;" src="${url}" alt="" />`)
        //   .join("");
        LqImages.push(...LQ);
        if (heading.length > 0 || description.length > 0 || list.length > 0) {
          return `<div class="box">
            ${heading.length > 0 ? `<h1 data-bmo-itemprop="${liquidMarker}-title">Jetzt bewerben:</h1>` : ""}
            <div itemprop="${liquidMarker}">
              ${heading.length > 0 ? heading : ""}
              ${list.length > 0 ? `<ul>${list.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
            </div>
          </div>`;
        } else {
          // If no content, return empty
          return "";
        }
      };

      // Render topAds
      for (const element of topAds) {
        content += await renderLquidBlock(element);
      }

      // Group and render middleAds with liquid logic
      const groupedMiddleAd = middleAds.reduce((acc, current) => {
        const section = sections.find((item) => item.key === current.elementType);
        const reference = section?.key || "Uncategorized";
        if (!acc[reference]) {
          acc[reference] = [];
        }
        current.section = section;
        acc[reference].push(current);
        return acc;
      }, {});

      for (const [, items] of Object.entries(groupedMiddleAd)) {
        let htmlOutput = "";
        let heading = "",
          description = "",
          list = [],
          liquidMarker = "",
          LQ = [];

        await Promise.all(
          items.map(async (element, index) => {
            const { section } = element;
            const template = section?.templates?.find((item) => item._id === element.template);
            if (!template) return;

            const fields = JSON.parse(template.fields?.length > 0 ? template.fields : "[]");
            const fieldData = element.data;
            const childData = element.childData;
            const { heading: temp1, description: temp2, list: temp3, LQ: temp4 } = await CreateLquid(template.htmlTemplate, fields, fieldData, childData);
            liquidMarker = template.liquidMarker;
            if (index === 0) {
              heading += temp1;
            }
            description += temp2;
            list.push(...temp3);
            LQ.push(temp4);
          })
        );

        if (heading.length > 0 || description.length > 0 || list.length > 0 || LQ.flat().length > 0) {
          htmlOutput = `  
            <div class="box">  
              ${heading.length > 0 ? `<h1 data-bmo-itemprop="${liquidMarker}-title">${heading}</h1>` : ""}  
              <div itemprop="${liquidMarker}">  
                ${description.length > 0 ? description : ""}  
                ${
                  list.length > 0
                    ? `  
                    <ul>  
                      ${list.map((item) => `<li>${item}</li>`).join("")}  
                    </ul>  
                  `
                    : ""
                }  
              </div>  
            </div>  
          `;
        }
        content += htmlOutput;
      }

      // Render bottomAds
      for (const element of bottomAds) {
        content += await renderLquidBlock(element);
      }
    } else {
      // Non-liquid logic remains unchanged
      const contentPromises = jobAd.map(async (element) => {
        const section = sections.find((item) => item.key === element.elementType);
        const template = section?.templates?.find((item) => item._id === element.template);

        if (!template) {
          return `<!--Template not found for ${element.elementType}-->`;
        }
        const secitonType = template.sectionType;
        const gridClass = element.gridSpan || "1";
        const tabClass = element.tabletGridSpan || gridClass;
        const mobileClass = element.mobileGridSpan || tabClass;
        const fields = JSON.parse(template.fields?.length > 0 ? template.fields : "[]");
        const fieldData = element.data;
        const childData = element.childData;
        const newHtml = await replacePlaceholders(template.htmlTemplate, fields, fieldData, childData);
        return `<div class="section grid-${gridClass} tab-${tabClass} mobile-${mobileClass} data-element-type="${element.elementType}">${secitonType === "Section" ? newHtml : `<div class="container">${newHtml}</div>`}</div>`;
      });
      content = (await Promise.all(contentPromises)).join("");
    }

    const fullHtml = header + wrapContainer(content, liquid, LqImages) + footer;
    return fullHtml;
  } catch (error) {
    console.error("Error in generateHtml:", error);
    throw error;
  }
};
