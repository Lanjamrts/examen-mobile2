import { getJSON, setJSON } from './storageService';
import { mockMeals } from '../data/mockData';
import { apiListMeals, apiCreateMeal, apiReserveMeal } from './apiClient';

const MEALS_KEY = '@meals';

export const getMeals = async () => {
  // Try remote API first
  try {
    const remote = await apiListMeals();
    if (Array.isArray(remote) && remote.length) {
      await setJSON(MEALS_KEY, remote);
      return remote;
    }
  } catch {}

  // Fallback to local storage or seed with mock
  try {
    const storedMeals = await getJSON(MEALS_KEY);
    if (Array.isArray(storedMeals) && storedMeals.length) {
      return storedMeals;
    }
  } catch {}

  await setJSON(MEALS_KEY, mockMeals);
  return mockMeals;
};

export const addMeal = async (meal) => {
  // Try remote create
  try {
    const created = await apiCreateMeal(meal);
    // Update local cache
    const current = (await getJSON(MEALS_KEY)) || [];
    await setJSON(MEALS_KEY, [created, ...current]);
    return created;
  } catch {}

  // Local fallback
  const meals = await getMeals();
  const newMeal = {
    ...meal,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    reserved: false,
  };
  const base = Array.isArray(meals) ? meals : [];
  const updatedMeals = [newMeal, ...base];
  await setJSON(MEALS_KEY, updatedMeals);
  return newMeal;
};

export const reserveMeal = async (mealId) => {
  // Try remote reserve
  try {
    const updated = await apiReserveMeal(mealId);
    const meals = (await getJSON(MEALS_KEY)) || [];
    const merged = meals.map(m => (m.id === mealId ? updated : m));
    await setJSON(MEALS_KEY, merged);
    return;
  } catch {}

  // Local fallback
  const meals = await getMeals();
  const updatedMeals = meals.map(meal =>
    meal.id === mealId ? { ...meal, reserved: true } : meal
  );
  await setJSON(MEALS_KEY, updatedMeals);
};