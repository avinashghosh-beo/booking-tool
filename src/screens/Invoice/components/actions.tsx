import { ButtonComponent } from "../../../components/common/Button";
import { Download, Eye } from "lucide-react";
import React, { useState } from "react";
import InvoicePreviewModal from "./preview";
import { fetchBuffer } from "../../../api";

const InvoiceActions = ({ value, rowData }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      const result = await fetchBuffer(`invoices/client/${rowData?.ID}`);
      if (result.status === 200 && result.data instanceof Blob) {
        // Create a download link and trigger it
        const url = URL.createObjectURL(result.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Rechnung_${rowData?.IssueNumber || "download"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  return (
    <div className="flex-row gap-2 flex">
      <ButtonComponent
        size="sm"
        colorScheme="light"
        icon={<Eye size={16} />}
        onClick={() => {
          setIsPreviewOpen(true);
        }}
      />
      <ButtonComponent size="sm" colorScheme="light" icon={<Download size={16} />} onClick={handleDownloadPDF} />
      <InvoicePreviewModal
        data={rowData}
        invoiceNumber={rowData?.IssueNumber}
        isOpen={isPreviewOpen}
        id={rowData?.ID}
        onClose={() => {
          setIsPreviewOpen(false);
        }}
      />
    </div>
  );
};

export default InvoiceActions;
