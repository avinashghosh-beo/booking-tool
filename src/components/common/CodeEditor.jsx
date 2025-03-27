import React, { useState, useCallback, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import styled, { createGlobalStyle } from "styled-components";
import { css as beautifyCss, html as beautifyHtml } from "js-beautify";
import { minify as minifyCss } from "csso";
import * as csstree from "css-tree";
import { ButtonComponent } from "./Button";
import { Save, Maximize2, Minimize2, FileCode } from "lucide-react";
import Modal from "../hoc/Modal";

// Utility Functions
const initialFormat = (str = "", type = "css") => {
  try {
    switch (type) {
      case "css":
        return beautifyCss(str, {
          indent_size: 2,
          indent_char: " ",
          max_preserve_newlines: 2,
          preserve_newlines: true,
          keep_array_indentation: false,
          break_chained_methods: false,
          indent_scripts: "normal",
          brace_style: "collapse",
          space_before_conditional: true,
          unescape_strings: false,
          jslint_happy: false,
          end_with_newline: false,
          wrap_line_length: 0,
          indent_inner_html: false,
          comma_first: false,
          e4x: false,
          indent_empty_lines: false,
        });
      case "json":
        return JSON.stringify(JSON.parse(str), null, 2);
      case "html":
        return beautifyHtml(str, {
          indent_size: 2,
          indent_char: " ",
          max_preserve_newlines: 2,
          preserve_newlines: true,
          keep_array_indentation: false,
          break_chained_methods: false,
          indent_scripts: "normal",
          brace_style: "collapse",
          space_before_conditional: true,
          unescape_strings: false,
          jslint_happy: false,
          end_with_newline: false,
          wrap_line_length: 0,
          indent_inner_html: false,
          comma_first: false,
          e4x: false,
          indent_empty_lines: false,
        });
      default:
        return str;
    }
  } catch (error) {
    console.error("Format error:", error);
    return str;
  }
};

// const validateCSS = (css) => {
//   try {
//     csstree.parse(css);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// const validateJSON = (json) => {
//   try {
//     JSON.parse(json);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

const minifyCSS = (css) => {
  try {
    return minifyCss(css).css;
  } catch (error) {
    console.error("Minify error:", error);
    return css;
  }
};

// Global styles
const GlobalStyle = createGlobalStyle`
  .editor-line-number {
    position: absolute;
    left: 0px;
    color: #999;
    text-align: right;
    width: 20px;
    user-select: none;
  }
`;

// Styled Components
const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding-bottom: 10px;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  align-items: center;
  div {
    display: flex;
    gap: 10px;
  }
`;

const EditorWrapper = styled.div`
  border: 1px solid ${(props) => (props.hasError ? "red" : "#d1d5db")};
  border-radius: 0.25rem;
  overflow: hidden;
  background-color: #f8f9fa;
  max-height: ${(props) => (props.isEnlarged ? "calc(100vh - 250px)" : "60vh")};
  overflow: auto;
  margin: ${(props) => (props.isEnlarged ? " 0px 30px 20px;" : " 0px 0px 10px;")};
  textarea,
  pre {
    counter-reset: line;
    font-family: "monospace" !important;
    font-size: 14px;
    line-height: 1.5;
    padding: 10px !important;
    min-height: ${(props) => (props.isEnlarged ? "70vh" : "200px")};
  }

  pre * {
    font-family: "monospace" !important;
  }

  textarea {
    outline: none;
    padding-left: 10px !important;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  margin-top: 4px;
`;

// Main Component
const CodeEditor = ({
  value = "",
  label = "Code Editor",
  placeholder = "Enter code here...",
  onChange = () => {},
  language = "html",
  varibales = [],
  t = (str) => str, // Translation function with default
}) => {
  const [code, setCode] = useState(value);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const savedValueRef = useRef(value);

  const validateCode = useCallback(
    (codeText) => {
      if (language === "css") {
        try {
          csstree.parse(codeText);
          setError(null);
        } catch (e) {
          setError(`CSS Error: ${e.message}`);
        }
      } else if (language === "json") {
        try {
          JSON.parse(codeText);
          setError(null);
        } catch (e) {
          setError(`JSON Error: ${e.message}`);
        }
      } else {
        setError(null);
      }
    },
    [language]
  );

  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      validateCode(newCode);
      setIsDirty(newCode !== savedValueRef.current);
    },
    [validateCode]
  );

  const handleFormat = useCallback(() => {
    const formattedCode = initialFormat(code, language);
    setCode(formattedCode);
    validateCode(formattedCode);
    setIsDirty(formattedCode !== savedValueRef.current);
  }, [code, language, validateCode]);

  const handleSave = useCallback(() => {
    if (!error && isDirty) {
      let processedCode = code;
      if (language === "css") {
        processedCode = minifyCSS(code);
      } else if (language === "json") {
        try {
          processedCode = JSON.stringify(JSON.parse(code));
        } catch (e) {
          console.error("JSON parse error:", e);
        }
      }
      onChange(processedCode);
      savedValueRef.current = code;
      setIsDirty(false);
    }
  }, [code, error, isDirty, language, onChange]);

  const toggleEnlarge = useCallback(() => {
    setIsEnlarged((prev) => !prev);
  }, []);

  useEffect(() => {
    validateCode(code);
    setIsDirty(code !== savedValueRef.current);
  }, [code, validateCode]);

  useEffect(() => {
    const formattedValue = initialFormat(value, language);
    savedValueRef.current = formattedValue;
    setCode(formattedValue);
    setIsDirty(false);
  }, [value, language]);

  const handlePaste = useCallback(
    (event) => {
      event.preventDefault();
      const pastedText = event.clipboardData.getData("text");
      const formattedCode = initialFormat(pastedText, language);
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const newValue = code.substring(0, start) + formattedCode + code.substring(end);
      setCode(newValue);
      validateCode(newValue);
      setIsDirty(newValue !== savedValueRef.current);
      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd = start + formattedCode.length;
      }, 0);
    },
    [code, language, validateCode]
  );

  const renderEditor = (isEnlarged) => (
    <>
      <EditorWrapper hasError={!!error} isEnlarged={isEnlarged}>
        <Editor
          value={code}
          onValueChange={handleCodeChange}
          highlight={(code) => highlight(code, languages[language] || languages.clike)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            outline: "none",
          }}
          textareaId="codearea"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const start = e.target.selectionStart;
              const end = e.target.selectionEnd;
              const newValue = code.substring(0, start) + "  " + code.substring(end);
              setCode(newValue);
              setIsDirty(newValue !== savedValueRef.current);
              setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 2;
              }, 0);
            }
          }}
          onPaste={handlePaste}
        />
      </EditorWrapper>
    </>
  );

  return (
    <Column>
      <GlobalStyle />
      <Label>
        <div>
          {label} {varibales.length > 0 ? <span>(Supported Variables: {varibales.join(", ")})</span> : ""}
        </div>
        <div>
          <ButtonComponent colorScheme="secondary" size="sm" icon={<FileCode size={16} />} onClick={handleFormat}></ButtonComponent>
          <ButtonComponent colorScheme="secondary" size="sm" icon={isEnlarged ? <Minimize2 size={16} /> : <Maximize2 size={16} />} onClick={toggleEnlarge}></ButtonComponent>
        </div>
      </Label>
      {renderEditor(false)}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="flex justify-end">
        <ButtonComponent colorScheme="primary" title={t("Save")} icon={<Save size={16} />} onClick={handleSave} disabled={!isDirty || !!error}></ButtonComponent>
      </div>
      <Modal isVisible={isEnlarged} onClose={toggleEnlarge} title={label} size="md">
        {renderEditor(true)}
      </Modal>
    </Column>
  );
};

export default CodeEditor;
