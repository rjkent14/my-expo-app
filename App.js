import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  PixelRatio
} from 'react-native';
import * as Haptics from 'expo-haptics';
import SignupScreen from './SignupScreen';
import MainAppNavigator from './navigation/MainAppNavigator';
import {
  restoreNavigationState,
  saveNavigationState,
  updateCachedScreen,
  clearNavigationCache,
} from './utils/navigationCache';

const { width, height } = Dimensions.get('window');

// Haptic feedback functions using Expo Haptics
const triggerHapticFeedback = async (type) => {
  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        break;
    }
  } catch (error) {
    // Silently fail if haptics are not available on this device
    // This is normal - not all devices support haptic feedback
    if (__DEV__) {
      console.log('Haptics not available on this device');
    }
  }
};

// Dynamic font scaling function
const getScaledFontSize = (baseSize) => {
  const { fontScale } = Dimensions.get('window');
  return Math.round(PixelRatio.roundToNearestPixel(baseSize * fontScale));
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [initialScreen, setInitialScreen] = useState('Playlists');
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);

  // Animation values using React Native Animated
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.8);
  const formTranslateY = new Animated.Value(50);

  // Function to reset and start animations
  const resetAndStartAnimations = () => {
    // Reset animation values to initial state
    logoOpacity.setValue(0);
    logoScale.setValue(0.8);
    formTranslateY.setValue(50);

    // Start animations
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Load cached navigation state on app startup
  useEffect(() => {
    const loadCachedNavigation = async () => {
      try {
        console.log('Loading cached navigation state...');
        const cachedState = await restoreNavigationState();

        if (cachedState && cachedState.isValid) {
          setInitialScreen(cachedState.lastScreen);
          console.log('Cached screen loaded:', cachedState.lastScreen);
        } else {
          setInitialScreen('Profile'); // Default fallback
          console.log('Using default screen: Profile');
        }
      } catch (error) {
        console.error('Error loading cached navigation:', error);
        setInitialScreen('Profile'); // Safe fallback
      } finally {
        setIsCacheLoaded(true);
      }
    };

    loadCachedNavigation();
  }, []);

  useEffect(() => {
    // Start animations when component mounts
    resetAndStartAnimations();
  }, []);

  // Reset animations when navigating back from signup
  useEffect(() => {
    if (!isSignup) {
      // Small delay to ensure smooth transition
      const timeoutId = setTimeout(() => {
        resetAndStartAnimations();
      }, 100);

      // Cleanup timeout to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [isSignup]);

  const logoAnimatedStyle = {
    opacity: logoOpacity,
    transform: [{ scale: logoScale }],
  };

  const formAnimatedStyle = {
    transform: [{ translateY: formTranslateY }],
  };

  const handleLogin = async () => {
    // Haptic feedback for button press
    await triggerHapticFeedback('light');

    if (!email || !password) {
      // Haptic feedback for error
      await triggerHapticFeedback('error');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Simulate login API call
    setTimeout(async () => {
      setIsLoading(false);

      // Test credentials for validation
      if (email === 'test@test.com' && password === 'password') {
        // Haptic feedback for success
        await triggerHapticFeedback('success');
        setIsAuthenticated(true);
        setCurrentUser({ email, name: 'Test User' });
      } else {
        // Haptic feedback for error
        await triggerHapticFeedback('error');
        Alert.alert('Error', 'Invalid email or password');
      }
    }, 1500);
  };


  const logoComponent = () => (
    <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
      <Animated.View style={[styles.logoIcon, logoAnimatedStyle]}>
        <Text style={styles.logoText}>♪</Text>
      </Animated.View>
      <Text style={styles.logoTitle}>Spotify</Text>
      <Text style={styles.logoSubtitle}>Music for everyone</Text>
    </Animated.View>
  );

  // Show main app if authenticated
  if (isAuthenticated) {
    return (
      <NavigationContainer>
        <MainAppNavigator
          currentUser={currentUser}
          initialScreen={initialScreen}
          onScreenChange={async (newScreen) => {
            try {
              await updateCachedScreen(newScreen);
              setInitialScreen(newScreen);
            } catch (error) {
              console.error('Error updating cached screen:', error);
            }
          }}
          onLogout={() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
            setEmail('');
            setPassword('');
            // Clear cache on logout for privacy
            clearNavigationCache();
          }}
        />
      </NavigationContainer>
    );
  }

  // Show signup screen if isSignup is true
  if (isSignup) {
    return (
      <SignupScreen
        onSwitchToLogin={() => setIsSignup(false)}
        onSignupSuccess={(user) => {
          setIsAuthenticated(true);
          setCurrentUser(user);
          setIsSignup(false);
        }}
      />
    );
  }

  // Otherwise show login screen
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      {/* Background */}
      <View style={styles.background} />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        {logoComponent()}

        {/* Form Section */}
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email or username</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Email or username"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email or username input field"
              accessibilityHint="Enter your email address or username to log in"
              accessibilityRole="text"
              textContentType="username"
              autoComplete="email"
            />
          </View>

          <View style={[styles.inputGroup, styles.passwordGroup]}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Password input field"
              accessibilityHint="Enter your password to log in"
              accessibilityRole="text"
              textContentType="password"
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            accessibilityLabel="Forgot password button"
            accessibilityHint="Tap to reset your password"
            accessibilityRole="button"
          >
            <Text style={styles.forgotButtonText}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityLabel={isLoading ? "Logging in, please wait" : "Log in button"}
            accessibilityHint={isLoading ? "Authentication in progress" : "Tap to log in with your email and password"}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading }}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'LOGGING IN...' : 'LOG IN'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.imageButton}
              accessibilityLabel="Continue with Facebook"
              accessibilityHint="Tap to log in using your Facebook account"
              accessibilityRole="button"
            >
              <Image source={require('./image/facebook.png')} style={styles.socialImage} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageButton}
              accessibilityLabel="Continue with Google"
              accessibilityHint="Tap to log in using your Google account"
              accessibilityRole="button"
            >
              <Image source={require('./image/Google.png')} style={styles.socialImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <TouchableOpacity
              style={styles.signupLinkButton}
              onPress={async () => {
                await triggerHapticFeedback('light');
                setIsSignup(true);
              }}
              accessibilityLabel="Sign up link"
              accessibilityHint="Tap to create a new account"
              accessibilityRole="button"
            >
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#121212', // Spotify dark background
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1DB954', // Spotify green
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: getScaledFontSize(32),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logoTitle: {
    fontSize: getScaledFontSize(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: getScaledFontSize(16),
    color: '#B3B3B3', // Spotify gray text
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 80, // Reduced space between logo and form
  },
  inputGroup: {
    marginBottom: 12, // Further reduced space after email field
  },
  passwordGroup: {
    marginTop: 10, // Further reduced space above password field
    marginBottom: 12, // Further reduced space after password field
  },
  inputLabel: {
    fontSize: getScaledFontSize(16),
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#2A2A2A', // Dark input background
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: getScaledFontSize(16),
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  loginButton: {
    backgroundColor: '#1DB954', // Spotify green
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 60, // Wider button for better text visibility
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 16,
    alignSelf: 'center',
    width: 200, // Fixed width for consistent appearance
    height: 56, // Fixed height for better proportions
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: getScaledFontSize(18), // Slightly larger for better visibility
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  forgotButton: {
    alignItems: 'flex-end', // Align to the right
    marginTop: 4, // Reduced space above forgot password text
    paddingRight: 20, // Add right padding to push it further right
  },
  forgotButtonText: {
    color: '#B3B3B3',
    fontSize: getScaledFontSize(14),
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20, // Reduced space above the social images
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Further reduced space below social buttons
    gap: 30, // Reduced space between the buttons
  },
  facebookButton: {
    backgroundColor: '#1877F2', // Facebook blue
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
    height: 56,
  },
  googleButton: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: 80,
    height: 56,
  },
  socialImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  imageButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: getScaledFontSize(14),
  },
  signupLinkButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  signupLink: {
    color: '#1DB954', // Spotify green
    fontSize: getScaledFontSize(14),
    fontWeight: '600',
  },
});
