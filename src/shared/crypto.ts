import cryptoJS from "crypto-js";

const key = "ini_rahasia";

export const encrypt = (value: any) => {
  const valueString = JSON.stringify(value);

  return cryptoJS.AES.encrypt(valueString, key).toString();
};

export const decrypt = (value: string) => {
  const decryptedValue = cryptoJS.AES.decrypt(value, key).toString(
    cryptoJS.enc.Utf8
  );

  return JSON.parse(decryptedValue);
};
