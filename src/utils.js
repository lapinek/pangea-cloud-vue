// Copyright 2023 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

// import snakeCase from "lodash/snakeCase";

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

/**
 * 
 * @param {number} length 
 * @returns 
 */
export const generateBase58 = (length) => {
  let result = ""
  const setLength = BASE58_ALPHABET.length
  for (let i = 0; i < length; i++) {
    result += BASE58_ALPHABET.charAt(Math.floor(Math.random() * setLength))
  }

  return result
}

/**
 * 
 * @param {string} key 
 * @param {string|object} value 
 * @returns 
 */
export const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    return false
  }
  return true
}

/**
 * 
 * @param {string} key 
 * @returns 
 */
export const getLocalStorageItem = (key) => {
  try {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  } catch (e) { 
    return null
  }
  
}
