import { getJSON, setJSON } from './storageService';
import { mockMeals } from '../data/mockData';

const MEALS_KEY = '@meals';

export const getMeals = async () => {
  try {
    const storedMeals = await getJSON(MEALS_KEY);
    if (Array.isArray(storedMeals)) {
      return storedMeals;
    }
    await setJSON(MEALS_KEY, mockMeals);
    return mockMeals;
  } catch (error) {
    console.error('Error getting meals:', error);
    return mockMeals;
  }
};

export const addMeal = async (meal) => {
  try {
    const meals = await getMeals();
    const newMeal = {
      ...meal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      reserved: false,
    };
    const base = Array.isArray(meals) ? meals : [];
    const updatedMeals = [...base, newMeal];
    await setJSON(MEALS_KEY, updatedMeals);
    return newMeal;
  } catch (error) {
    console.error('Error adding meal:', error);
    throw error;
  }
};

export const reserveMeal = async (mealId) => {
  try {
    const meals = await getMeals();
    const updatedMeals = meals.map(meal =>
      meal.id === mealId ? { ...meal, reserved: true } : meal
    );
    await setJSON(MEALS_KEY, updatedMeals);
  } catch (error) {
    console.error('Error reserving meal:', error);
    throw error;
  }
};