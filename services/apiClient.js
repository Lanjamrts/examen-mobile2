import { Platform } from 'react-native';

// Try multiple base URLs to support emulator/device/web without extra config.
// Adjust to your LAN IP if needed (e.g., http://192.168.1.20:4000)
const CANDIDATE_BASE_URLS = [
  'http://10.0.2.2:4000', // Android emulator -> host machine
  'http://localhost:4000', // Web / local
  'http://127.0.0.1:4000',
];

async function tryFetch(url, options, timeoutMs = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(id);
  }
}

async function requestWithFallback(path, options) {
  let lastError = null;
  for (const base of CANDIDATE_BASE_URLS) {
    try {
      return await tryFetch(`${base}${path}`, options);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('All base URLs failed');
}

export async function apiListMeals() {
  return requestWithFallback('/api/meals', { method: 'GET' });
}

export async function apiCreateMeal(payload) {
  return requestWithFallback('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function apiReserveMeal(id) {
  return requestWithFallback(`/api/meals/${id}/reserve`, { method: 'PATCH' });
}


