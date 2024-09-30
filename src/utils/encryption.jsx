// Encode data to Base64
export function encryptData(data) {
  return window.btoa(data);
}

// Decode data from Base64
export function decryptData(base64Data) {
  return window.atob(base64Data);
}

const testString = "Hello World";

const encrypted = encryptData(testString);
console.log("Encrypted:", encrypted);

const decrypted = decryptData(encrypted);
console.log("Decrypted:", decrypted); // Should output "Hello World"
