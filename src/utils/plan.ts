import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_PLAN_KEY = 'fitness_app_active_plan';

export const saveActivePlan = async (duration: number | null) => {
  try {
    if (duration === null) {
      await AsyncStorage.removeItem(ACTIVE_PLAN_KEY);
    } else {
      await AsyncStorage.setItem(ACTIVE_PLAN_KEY, duration.toString());
    }
  } catch (error) {
    console.warn('Failed to save active plan:', error);
  }
};

export const loadActivePlan = async (): Promise<number | null> => {
  try {
    const data = await AsyncStorage.getItem(ACTIVE_PLAN_KEY);
    if (data) {
      return parseInt(data, 10);
    }
  } catch (error) {
    console.warn('Failed to load active plan:', error);
  }
  return null;
};
