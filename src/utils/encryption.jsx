import * as CryptoJS from "crypto-js";
import { Base64 } from "js-base64";

const secretKey = "fitZen";

export function encryptData(data) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  const base64Encrypted = Base64.encode(encrypted); // Encode to Base64 using js-base64
  return base64Encrypted;
}

export function decryptData(encryptedData) {
  const encrypted = Base64.decode(encryptedData); // Decode from Base64 using js-base64
  const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
