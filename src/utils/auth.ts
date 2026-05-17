import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory login state (fallback if AsyncStorage unavailable)
let loggedIn = false;
const AUTH_KEY = 'fitness_app_auth_state';

/**
 * Persist login state to AsyncStorage
 */
const saveAuthState = async (isLoggedIn: boolean) => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ loggedIn: isLoggedIn }));
  } catch (error) {
    console.warn('Failed to persist auth state:', error);
  }
};

/**
 * Load login state from AsyncStorage
 */
const loadAuthState = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.loggedIn ?? false;
    }
  } catch (error) {
    console.warn('Failed to load auth state:', error);
  }
  return false;
};

/**
 * Initialize auth state from storage (called on app startup)
 */
export const initializeAuth = async (): Promise<boolean> => {
  const savedState = await loadAuthState();
  loggedIn = savedState;
  return savedState;
};

/**
 * Log in the user (persisted across app restarts)
 */
export const loginUser = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(async () => {
      loggedIn = true;
      await saveAuthState(true);
      console.log('User logged in');
      resolve();
    }, 500);
  });
};

/**
 * Log out the user
 */
export const logoutUser = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(async () => {
      loggedIn = false;
      await saveAuthState(false);
      console.log('User logged out');
      resolve();
    }, 500);
  });
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(loggedIn);
    }, 100);
  });
};
