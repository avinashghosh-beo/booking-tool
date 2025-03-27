import React, { useState, useRef, useEffect } from "react";
import { ButtonComponent } from "../common/Button";
import Modal from "../hoc/Modal";
import { VerifiedIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const VerifyCode = ({
  visible,
  onClose,
  onConfirm,
  requestNewOtp = () => {},
  loading = false,
}) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");
      // Move focus to the next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleConfirm = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      onConfirm(otpValue);
    } else {
      setError(t("errorMessages.otpIncomplete"));
    }
  };

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <div className="grid max-w-full gap-4">
        <div className="flex items-center gap-x-2">
          <div className="grid rounded-full size-12 bg-secondary-50 place-items-center">
            <div className="grid rounded-full place-content-center size-10 bg-secondary-100 text-secondary-500">
              <VerifiedIcon />
            </div>
          </div>
          <div className="font-semibold">{t("screenNames.verifyCode")}</div>
        </div>
        <p className="text-center text-gray-700">
          {t("strings.enterOtpSentToEmail")}
        </p>
        <div className="max-h-96 overflow-hidden overflow-y-auto flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 p-2 border border-gray-300 rounded text-center"
              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
          {error && <p className="text-danger-500">{error}</p>}
        </div>
        <p className="text-center text-gray-500 mt-2">
          {t("strings.otpExpiresIn")} {formatTime(timeLeft)}
        </p>
        <a
          onClick={() => {
              setOtp(["", "", "", "", "", ""]);
              setTimeLeft(600);
              requestNewOtp();
          }}
          className="text-center text-gray-50 text-primary-500 cursor-pointer mt-2"
        >
          {t("strings.requestNewOtp")}
        </a>

        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <ButtonComponent
            buttonStyle="w-full"
            colorScheme="light"
            onClick={() => {
              setOtp(["", "", "", "", "", ""]);
              setTimeLeft(600);
              onClose();
            }}
            title={t("buttonLabels.cancel")}
            size="md"
          />
          <ButtonComponent
            loading={loading}
            buttonStyle="w-full"
            colorScheme="primary"
            onClick={handleConfirm}
            title={t("buttonLabels.submit")}
            size="md"
            disabled={otp.join("").length !== 6}
          />
        </div>
      </div>
    </Modal>
  );
};

export default VerifyCode;
