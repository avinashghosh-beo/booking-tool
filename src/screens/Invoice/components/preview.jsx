import React, { useState, useEffect } from "react";
import { Loader, X } from "lucide-react";
import { fetchBuffer, getRequest } from "../../../api";
import { useTranslation } from "react-i18next";
const InvoicePreviewModal = ({ id, invoiceNumber, isOpen, onClose, data }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchAndGeneratePDF = async () => {
      if (!id || !isOpen) return;

      try {
        setLoading(true);
        setError(null);

        const result = await fetchBuffer(`invoices/client/${id}`);
        console.log(result);
        if (result.status === 200 && result.data instanceof Blob) {
          const url = URL.createObjectURL(result.data);
          setPdfUrl(url);
        } else {
          throw new Error(result.customMessage || "Failed to load PDF");
        }
      } catch (err) {
        setError(err.message || "Failed to generate PDF");
        console.error("PDF Generation Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGeneratePDF();

    // Cleanup function
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
  }, [id, isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setError(null);
    onClose();
  };

  const handleRetry = () => {
    setPdfUrl(null);
    setError(null);
    setLoading(true);
    fetchAndGeneratePDF();
  };

  if (!isOpen) return null;

  return (
    <div className=" fixed inset-0 z-[2000] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity duration-300" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-[90vw] max-w-4xl h-[90vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              {t("screenNames.invoices")} {invoiceNumber} - {data.Company.Company}
            </h2>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 relative mt-0">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Loader className="h-8 w-8 animate-spin" />
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2 text-red-600">Error Loading PDF {id}</p>
                  <p className="text-sm text-gray-500 mb-4">{error}</p>
                  <div className="flex gap-2">
                    <button onClick={handleRetry} className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors">
                      Retry
                    </button>
                    <button onClick={handleClose} className="px-4 py-2 hover:bg-gray-50 rounded-md transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {pdfUrl && !loading && !error && (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title="Invoice Preview"
                onError={(e) => {
                  console.error("iframe loading error:", e);
                  setError("Failed to display PDF");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
