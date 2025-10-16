import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
    if (__DEV__) {
      console.log('Haptics not available on this device');
    }
  }
};

export default function SettingsScreen({ route, navigation }) {
  const { onLogout } = route.params;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const [highQualityEnabled, setHighQualityEnabled] = useState(true);

  const handleLogout = async () => {
    await triggerHapticFeedback('light');
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await triggerHapticFeedback('success');
            onLogout();
          },
        },
      ]
    );
  };

  const SettingRow = ({ title, subtitle, onPress, rightComponent, icon }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        {icon && <Ionicons name={icon} size={24} color="#1DB954" style={styles.settingIcon} />}
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent && <View style={styles.settingRight}>{rightComponent}</View>}
      {onPress && !rightComponent && (
        <Ionicons name="chevron-forward" size={20} color="#B3B3B3" />
      )}
    </TouchableOpacity>
  );

  const ToggleRow = ({ title, subtitle, value, onValueChange, icon }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        {icon && <Ionicons name={icon} size={24} color="#1DB954" style={styles.settingIcon} />}
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3A3A3A', true: '#1DB954' }}
        thumbColor={value ? '#FFFFFF' : '#B3B3B3'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingRow
          title="Profile"
          subtitle="Update your profile information"
          onPress={() => navigation.navigate('Profile')}
          icon="person-outline"
        />
        <SettingRow
          title="Subscription"
          subtitle="Premium • Free until Dec 2024"
          icon="card-outline"
        />
        <SettingRow
          title="Privacy Policy"
          subtitle="Learn how we use your data"
          icon="shield-checkmark-outline"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playback</Text>
        <ToggleRow
          title="Autoplay"
          subtitle="Automatically play similar songs"
          value={autoplayEnabled}
          onValueChange={setAutoplayEnabled}
          icon="play-skip-forward-outline"
        />
        <ToggleRow
          title="High Quality Audio"
          subtitle="Stream music in high quality (uses more data)"
          value={highQualityEnabled}
          onValueChange={setHighQualityEnabled}
          icon="musical-notes-outline"
        />
        <SettingRow
          title="Equalizer"
          subtitle="Customize audio settings"
          icon="options-outline"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <ToggleRow
          title="Push Notifications"
          subtitle="Get notified about new releases and updates"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          icon="notifications-outline"
        />
        <SettingRow
          title="Notification Settings"
          subtitle="Customize what notifications you receive"
          icon="notifications-circle-outline"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <ToggleRow
          title="Dark Mode"
          subtitle="Always use dark theme"
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          icon="moon-outline"
        />
        <SettingRow
          title="Theme"
          subtitle="Choose your preferred theme"
          icon="color-palette-outline"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingRow
          title="Help & Support"
          subtitle="Get help or contact us"
          icon="help-circle-outline"
        />
        <SettingRow
          title="About"
          subtitle="App version 1.0.0"
          icon="information-circle-outline"
        />
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Spotify Clone v1.0.0</Text>
        <Text style={styles.footerSubtext}>Made with ♪ for music lovers</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B3B3B3',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
    width: 24,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#B3B3B3',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 4,
  },
});