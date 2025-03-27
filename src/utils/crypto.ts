import CryptoJS from "crypto-js";
let ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Encrypt data
export const encryptData = (data: object): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

// Decrypt data
export const decryptData = (encryptedData: string): object | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
};

const SECRET_KEY = import.meta.env.VITE_ENC_KEY;

// decryption fn from old codebase
export const encrypt = (id) => {
  const ciphertext = CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
  return encodeURIComponent(ciphertext); // URL-safe
};

// decryption fn from old codebase
export const decrypt = (encryptedId) => {
  const decodedCiphertext = decodeURIComponent(encryptedId);
  const bytes = CryptoJS.AES.decrypt(decodedCiphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
