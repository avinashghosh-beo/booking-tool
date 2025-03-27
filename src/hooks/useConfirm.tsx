import React, { useState, useCallback } from "react";
import type { ReactElement } from "react";
import ConfirmationModal from "../components/modals/Confirmation";

interface ConfirmOptions {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [cancelCallback, setCancelCallback] = useState<(() => void) | null>(null);
  const [confirmText, setConfirmText] = useState("Confirm");
  const [cancelText, setCancelText] = useState("Cancel");

  const showConfirm = useCallback(({ message: confirmMessage, onConfirm, onCancel, confirmText: customConfirmText = "Confirm", cancelText: customCancelText = "Cancel" }: ConfirmOptions) => {
    setMessage(confirmMessage);
    setConfirmCallback(() => onConfirm || (() => {}));
    setCancelCallback(() => onCancel || (() => {}));
    setConfirmText(customConfirmText);
    setCancelText(customCancelText);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmCallback) {
      confirmCallback();
    }
    setIsOpen(false);
  }, [confirmCallback]);

  const handleCancel = useCallback(() => {
    if (cancelCallback) {
      cancelCallback();
    }
    setIsOpen(false);
  }, [cancelCallback]);

  const ConfirmationDialog = useCallback((): ReactElement | null => {
    if (!isOpen) return null;

    return <ConfirmationModal visible={isOpen} title={message} text={message} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} type="confirm" />;
  }, [isOpen, message, handleConfirm, handleCancel, confirmText, cancelText]);

  return {
    showConfirm,
    ConfirmationDialog,
  };
};

export default useConfirm;
