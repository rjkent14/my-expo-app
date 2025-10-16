import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

// Import screens
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Custom Animated Drawer Content with Accessibility
const CustomDrawerContent = (props) => {
  const { navigation, state } = props;
  const animatedValues = state.routes.map((_, index) =>
    useSharedValue(index === state.index ? 1 : 0)
  );

  const getDrawerIcon = (routeName) => {
    const iconMap = {
      Playlists: 'library-outline',
      Profile: 'person-outline',
      Settings: 'settings-outline',
    };
    return iconMap[routeName] || 'ellipse-outline';
  };

  const getAccessibilityLabel = (routeName) => {
    const labelMap = {
      Playlists: 'Your Library. Browse your music playlists',
      Profile: 'Profile. View and edit your personal information',
      Settings: 'Settings. Customize app preferences and account options',
    };
    return labelMap[routeName] || `${routeName} screen`;
  };

  const getAccessibilityHint = (routeName) => {
    const hintMap = {
      Playlists: 'Double tap to browse your music collection',
      Profile: 'Double tap to manage your profile settings',
      Settings: 'Double tap to access app settings and preferences',
    };
    return hintMap[routeName] || `Navigate to ${routeName}`;
  };

  return (
    <Animated.View
      style={styles.drawerContainer}
      accessible={true}
      accessibilityLabel="Navigation menu"
      accessibilityHint="Swipe from left edge or tap hamburger menu to access navigation options"
      accessibilityRole="menu"
    >
      {/* Drawer Header */}
      <View
        style={styles.drawerHeader}
        accessible={true}
        accessibilityLabel="Spotify music app"
        accessibilityRole="header"
      >
        <View
          style={styles.logoContainer}
          accessible={true}
          accessibilityLabel="Spotify logo"
          accessibilityRole="image"
        >
          <Text style={styles.logoIcon} aria-hidden="true">♪</Text>
        </View>
        <Text
          style={styles.drawerTitle}
          accessible={true}
          accessibilityLabel="Spotify"
          accessibilityRole="text"
        >
          Spotify
        </Text>
      </View>

      {/* Drawer Items */}
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const animatedValue = animatedValues[index];

        React.useEffect(() => {
          animatedValue.value = isActive ? 1 : 0;
        }, [isActive]);

        const animatedStyle = useAnimatedStyle(() => ({
          backgroundColor: withTiming(
            animatedValue.value > 0 ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
            { duration: 300 }
          ),
          transform: [
            {
              scale: withSpring(animatedValue.value > 0 ? 1.02 : 1, {
                stiffness: 300,
                damping: 30,
              }),
            },
          ],
        }));

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.drawerItemContainer}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
            accessibilityLabel={getAccessibilityLabel(route.name)}
            accessibilityHint={getAccessibilityHint(route.name)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Animated.View style={[styles.drawerItem, animatedStyle]}>
              <Ionicons
                name={getDrawerIcon(route.name)}
                size={22}
                color={isActive ? '#1DB954' : '#B3B3B3'}
                style={styles.drawerIcon}
                accessible={true}
                accessibilityLabel={`${route.name} icon`}
              />
              <Text
                style={[
                  styles.drawerLabel,
                  { color: isActive ? '#1DB954' : '#B3B3B3' },
                ]}
                accessible={true}
                accessibilityLabel={`${route.name} menu item`}
              >
                {route.name}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const MainStackNavigator = ({ currentUser, onLogout, initialScreen, onScreenChange }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        animationEnabled: true,
        animationTypeForReplace: 'push',
        // Cross-platform compatibility
        animationDuration: 300,
        // Accessibility improvements
        headerBackAccessibilityLabel: 'Go back',
        headerBackAccessibilityHint: 'Double tap to return to previous screen',
      }}
    >
      <Stack.Screen
        name="MainDrawer"
        options={{ headerShown: false }}
      >
        {() => <MainDrawerNavigator currentUser={currentUser} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              accessibilityLabel="Profile icon"
              accessibilityHint="Shows user profile information"
              accessibilityRole="button"
            >
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#1DB954"
              />
            </TouchableOpacity>
          ),
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              accessibilityLabel="Settings icon"
              accessibilityHint="Access app settings and preferences"
              accessibilityRole="button"
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color="#1DB954"
              />
            </TouchableOpacity>
          ),
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

const MainDrawerNavigator = ({ currentUser, onLogout, initialScreen, onScreenChange }) => {
  // Track screen changes for caching
  useEffect(() => {
    if (onScreenChange && initialScreen) {
      console.log('Setting initial screen:', initialScreen);
    }
  }, [initialScreen, onScreenChange]);

  return (
    <Drawer.Navigator
      initialRouteName={initialScreen || 'Profile'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: '#121212',
          width: 280,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        sceneContainerStyle: {
          backgroundColor: '#121212',
        },
        // Cross-platform animation compatibility
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: Platform.OS === 'ios' ? 300 : 250,
              useNativeDriver: true,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: Platform.OS === 'ios' ? 250 : 200,
              useNativeDriver: true,
            },
          },
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
              useNativeDriver: true,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 250,
              useNativeDriver: true,
            },
          },
        },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        // Accessibility improvements
        drawerActiveBackgroundColor: 'rgba(29, 185, 84, 0.1)',
        drawerActiveTintColor: '#1DB954',
        drawerInactiveTintColor: '#B3B3B3',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen
        name="Playlists"
        component={PlaylistsScreen}
        listeners={{
          focus: () => {
            if (onScreenChange) {
              onScreenChange('Playlists');
            }
          },
        }}
        options={{
          title: 'Your Library',
          headerTitle: 'Good evening',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              accessibilityLabel="Search music"
              accessibilityHint="Tap to search for songs, artists, or playlists"
              accessibilityRole="button"
            >
              <Ionicons
                name="search"
                size={24}
                color="#1DB954"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={{
          focus: () => {
            if (onScreenChange) {
              onScreenChange('Profile');
            }
          },
        }}
        options={{
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ onLogout }}
        listeners={{
          focus: () => {
            if (onScreenChange) {
              onScreenChange('Settings');
            }
          },
        }}
        options={{
          title: 'Settings',
        }}
      />
    </Drawer.Navigator>
  );
};

// Styles for custom drawer
const styles = {
  drawerContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  drawerItemContainer: {
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
  },
  drawerIcon: {
    marginRight: 16,
    width: 24,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 0,
  },
};

export default MainStackNavigator;