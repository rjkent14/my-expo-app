import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation cache keys
const NAVIGATION_STATE_KEY = '@navigation_state';
const LAST_SCREEN_KEY = '@last_screen';
const CACHE_TIMESTAMP_KEY = '@cache_timestamp';

// Valid screen names in our app
const VALID_SCREENS = ['Playlists', 'Profile', 'Settings'];
const DEFAULT_SCREEN = 'Profile';

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000;

/**
 * Save current navigation state to AsyncStorage
 * @param {string} currentScreen - The currently active screen name
 * @param {object} navigationState - The full navigation state object
 */
export const saveNavigationState = async (currentScreen, navigationState = null) => {
  try {
    if (!currentScreen || !VALID_SCREENS.includes(currentScreen)) {
      console.warn('Invalid screen name provided to saveNavigationState:', currentScreen);
      return false;
    }

    const cacheData = {
      lastScreen: currentScreen,
      navigationState: navigationState,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(LAST_SCREEN_KEY, currentScreen);

    if (navigationState) {
      const stateString = JSON.stringify(navigationState);
      await AsyncStorage.setItem(NAVIGATION_STATE_KEY, stateString);
    }

    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, cacheData.timestamp.toString());

    console.log('Navigation state saved successfully for screen:', currentScreen);
    return true;
  } catch (error) {
    console.error('Error saving navigation state:', error);
    return false;
  }
};

/**
 * Restore navigation state from AsyncStorage
 * @returns {object} Object containing lastScreen and navigationState
 */
export const restoreNavigationState = async () => {
  try {
    // Get cached data
    const lastScreen = await AsyncStorage.getItem(LAST_SCREEN_KEY);
    const navigationStateString = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
    const timestampString = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);

    // Check if cache exists
    if (!lastScreen || !timestampString) {
      console.log('No cached navigation state found, using defaults');
      return {
        lastScreen: DEFAULT_SCREEN,
        navigationState: null,
        isValid: true,
      };
    }

    // Check cache expiry
    const timestamp = parseInt(timestampString);
    const now = Date.now();
    const isExpired = (now - timestamp) > CACHE_EXPIRY_TIME;

    if (isExpired) {
      console.log('Navigation cache expired, clearing and using defaults');
      await clearNavigationCache();
      return {
        lastScreen: DEFAULT_SCREEN,
        navigationState: null,
        isValid: true,
      };
    }

    // Validate cached screen
    if (!VALID_SCREENS.includes(lastScreen)) {
      console.warn('Invalid cached screen found:', lastScreen, 'using default');
      await clearNavigationCache();
      return {
        lastScreen: DEFAULT_SCREEN,
        navigationState: null,
        isValid: true,
      };
    }

    // Parse navigation state if available
    let navigationState = null;
    if (navigationStateString) {
      try {
        navigationState = JSON.parse(navigationStateString);
      } catch (parseError) {
        console.warn('Error parsing cached navigation state:', parseError);
        navigationState = null;
      }
    }

    console.log('Navigation state restored successfully for screen:', lastScreen);
    return {
      lastScreen,
      navigationState,
      isValid: true,
    };
  } catch (error) {
    console.error('Error restoring navigation state:', error);

    // Return safe defaults on error
    return {
      lastScreen: DEFAULT_SCREEN,
      navigationState: null,
      isValid: false,
      error: error.message,
    };
  }
};

/**
 * Clear all navigation cache data
 */
export const clearNavigationCache = async () => {
  try {
    await AsyncStorage.multiRemove([
      NAVIGATION_STATE_KEY,
      LAST_SCREEN_KEY,
      CACHE_TIMESTAMP_KEY,
    ]);
    console.log('Navigation cache cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing navigation cache:', error);
    return false;
  }
};

/**
 * Get the last visited screen with fallback to default
 * @returns {string} The last visited screen name or default
 */
export const getLastVisitedScreen = async () => {
  try {
    const cached = await restoreNavigationState();
    return cached.lastScreen || DEFAULT_SCREEN;
  } catch (error) {
    console.error('Error getting last visited screen:', error);
    return DEFAULT_SCREEN;
  }
};

/**
 * Check if navigation cache is valid and not expired
 * @returns {boolean} True if cache is valid
 */
export const isNavigationCacheValid = async () => {
  try {
    const cached = await restoreNavigationState();
    return cached.isValid && cached.lastScreen !== null;
  } catch (error) {
    console.error('Error checking navigation cache validity:', error);
    return false;
  }
};

/**
 * Update the cached screen when navigation occurs
 * @param {string} newScreen - The new active screen name
 */
export const updateCachedScreen = async (newScreen) => {
  try {
    if (!VALID_SCREENS.includes(newScreen)) {
      console.warn('Invalid screen name for cache update:', newScreen);
      return false;
    }

    await saveNavigationState(newScreen);
    return true;
  } catch (error) {
    console.error('Error updating cached screen:', error);
    return false;
  }
};