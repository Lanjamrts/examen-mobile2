// Safe storage wrapper: uses AsyncStorage if available, otherwise in-memory fallback
let AsyncStorage = null;
try {
  // Optional dependency; will fail gracefully if not installed
  AsyncStorage = require('@react-native-async-storage/async-storage').default || null;
} catch (e) {
  AsyncStorage = null;
}

const memoryStore = {};

export const getItem = async (key) => {
  if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
    return AsyncStorage.getItem(key);
  }
  return key in memoryStore ? String(memoryStore[key]) : null;
};

export const setItem = async (key, value) => {
  if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
    return AsyncStorage.setItem(key, value);
  }
  memoryStore[key] = value;
};

export const getJSON = async (key) => {
  const value = await getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

export const setJSON = async (key, obj) => {
  try {
    const serialized = JSON.stringify(obj === undefined ? null : obj);
    return setItem(key, serialized);
  } catch (e) {
    // Fallback to empty object to avoid undefined writes
    return setItem(key, '{}');
  }
};


