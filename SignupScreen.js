import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
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
    ScrollView,
    PixelRatio
  } from 'react-native';
import * as Haptics from 'expo-haptics';

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

export default function SignupScreen({ onSwitchToLogin, onSignupSuccess }) {
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values using React Native Animated
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.8);
  const formTranslateY = new Animated.Value(50);

  useEffect(() => {
    // Reset animation values when component mounts
    logoOpacity.setValue(0);
    logoScale.setValue(0.8);
    formTranslateY.setValue(50);

    // Start animations when component mounts
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
  }, []);

  const logoAnimatedStyle = {
    opacity: logoOpacity,
    transform: [{ scale: logoScale }],
  };

  const formAnimatedStyle = {
    transform: [{ translateY: formTranslateY }],
  };

  const handleSignup = async () => {
    // Haptic feedback for button press
    await triggerHapticFeedback('light');

    if (!signupEmail || !signupPassword || !confirmPassword || !fullName) {
      // Haptic feedback for error
      await triggerHapticFeedback('error');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (signupPassword !== confirmPassword) {
      // Haptic feedback for error
      await triggerHapticFeedback('error');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      // Haptic feedback for error
      await triggerHapticFeedback('error');
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    // Simulate signup API call
    setTimeout(async () => {
      setIsLoading(false);

      if (signupEmail.includes('@')) {
        // Haptic feedback for success
        await triggerHapticFeedback('success');
        const newUser = { email: signupEmail, name: fullName };
        if (onSignupSuccess) {
          onSignupSuccess(newUser);
        }
      } else {
        // Haptic feedback for error
        await triggerHapticFeedback('error');
        Alert.alert('Error', 'Please enter a valid email address');
      }
    }, 1500);
  };

  const logoComponent = () => (
    <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
      <Animated.View style={[styles.logoIcon, logoAnimatedStyle]}>
        <Text style={styles.logoText}>♪</Text>
      </Animated.View>
      <Text style={styles.logoTitle}>Spotify</Text>
      <Text style={styles.logoSubtitle}>Create your account</Text>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      {/* Background */}
      <View style={styles.background} />

      {/* Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo Section */}
        {logoComponent()}

        {/* Form Section */}
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
              accessibilityLabel="Full name input field"
              accessibilityHint="Enter your first and last name"
              accessibilityRole="text"
              textContentType="name"
              autoComplete="name"
            />
          </View>

          <View style={[styles.inputGroup, styles.passwordGroup]}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email input field"
              accessibilityHint="Enter your email address for account creation"
              accessibilityRole="text"
              textContentType="emailAddress"
              autoComplete="email"
            />
          </View>

          <View style={[styles.inputGroup, styles.passwordGroup]}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Password input field"
              accessibilityHint="Create a secure password for your account"
              accessibilityRole="text"
              textContentType="newPassword"
              autoComplete="password-new"
            />
          </View>

          <View style={[styles.inputGroup, styles.passwordGroup]}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Confirm password input field"
              accessibilityHint="Re-enter your password to confirm it matches"
              accessibilityRole="text"
              textContentType="password"
              autoComplete="password-new"
            />
          </View>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={async () => {
              await triggerHapticFeedback('light');
              onSwitchToLogin();
            }}
            accessibilityLabel="Sign in link"
            accessibilityHint="Tap to go back to the login screen"
            accessibilityRole="button"
          >
            <Text style={styles.backToLoginText}>
              Already have an account?{' '}
              <Text style={styles.signInLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              accessibilityLabel={agreeToTerms ? "Terms and conditions accepted" : "Accept terms and conditions"}
              accessibilityHint="Tap to agree or disagree with the terms and conditions"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreeToTerms }}
            >
              <Text style={styles.checkboxText}>{agreeToTerms ? '✓' : '○'}</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              I agree to the{' '}
              <Text style={styles.linkText}>Terms and Conditions</Text>
              {' '}and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
            accessibilityLabel={isLoading ? "Creating account, please wait" : "Sign up button"}
            accessibilityHint={isLoading ? "Account creation in progress" : "Tap to create your account with the provided information"}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading }}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
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
    marginTop: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 12,
  },
  passwordGroup: {
    marginTop: 10,
    marginBottom: 12,
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
    paddingHorizontal: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 16,
    alignSelf: 'center',
    width: 200,
    height: 56,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: getScaledFontSize(18),
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  backToLoginButton: {
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 24,
    paddingRight: 20,
  },
  backToLoginText: {
    color: '#B3B3B3',
    fontSize: getScaledFontSize(14),
  },
  signInLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxText: {
    color: '#1DB954',
    fontSize: getScaledFontSize(16),
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: '#B3B3B3',
    fontSize: getScaledFontSize(14),
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: '#1DB954',
    textDecorationLine: 'underline',
  },
});