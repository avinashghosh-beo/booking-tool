import React, { useState } from "react";
import { PencilIcon, UploadIcon } from "../icons";
import wordIcon from "../../assets/Icons/WordIcon.png";
import pdfIcon from "../../assets/Icons/PdfIcon.png";
import fileIcon from "../../assets/Icons/FileIcon.png";
import { useTranslation } from "react-i18next";

const FileUploader = ({
  file,
  setFile,
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  allowedExtensions = [".pdf", ".doc", ".docx"],
  showPreview = true,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear previous error
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setError("Invalid file type. Please upload a PDF or Word document.");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(null); // Clear previous error
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const selectedFile = event.dataTransfer.files[0];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setError("Invalid file type. Please upload a PDF or Word document.");
      }
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
  };

  const fileTypeIcons = {
    word: wordIcon,
    pdf: pdfIcon,
    fileIcon: fileIcon,
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType?.includes("pdf")) {
      return fileTypeIcons["pdf"];
    }
    if (fileType?.includes("msword")) {
      return fileTypeIcons["word"];
    }
    return fileTypeIcons["fileIcon"];
  };

  return (
    <div className="w-full h-full">
      {file && showPreview ? (
        <div className="flex h-full flex-col items-start justify-center p-6 text-center border border-dotted rounded-md cursor-pointer border-primary-500 bg-primary-100">
          <p className="pb-4 text-lg font-medium text-primary-500">
            {t("shortStrings.browseFile")}
          </p>
          <div className="flex w-full">
            <img
              src={getFileTypeIcon(file?.type)}
              alt="word-file"
              className="h-12"
            />
            <div className="flex items-center justify-start flex-grow px-4">
              <p className="mt-2">{file.name}</p>
            </div>
            <button onClick={handleClear} className="">
              <PencilIcon />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex h-full flex-col items-center justify-center p-6 text-center border border-dashed rounded-md cursor-pointer border-primary-300 hover:border-primary-400 bg-primary-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <p className="pb-4 text-primary-500">
            <UploadIcon />
          </p>
          <p className="mb-1">
            <strong>{t("shortStrings.clickToUpload")}</strong> {` `}
            {t("shortStrings.orDragAndDrop")}
          </p>
          <p className="text-xs text-gray-500">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
          <input
            type="file"
            accept={allowedExtensions.join(",")}
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <button
            type="button"
            className="hidden px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
          >
            {t("shortStrings.browseFile")}
          </button>
        </div>
      )}
      {error && <p className="mt-4 text-danger-500">{error}</p>}
    </div>
  );
};

export default FileUploader;
