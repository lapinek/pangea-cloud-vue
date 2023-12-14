// Copyright 2023 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

// import snakeCase from "lodash/snakeCase";

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const generateBase58 = (length: number) => {
  let result = "";
  const setLength = BASE58_ALPHABET.length;
  for (let i = 0; i < length; i++) {
    result += BASE58_ALPHABET.charAt(Math.floor(Math.random() * setLength));
  }

  return result;
};

export const setLocalStorageItem = (key: string, value: object | string) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    return false
  }
  return true
}

export const getLocalStorageItem = (key: string): object | string | null => {
  try {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  } catch (e) {
  }
  return null
}