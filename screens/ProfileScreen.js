import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Haptic feedback function
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

export default function ProfileScreen({ route, navigation }) {
  const [user, setUser] = useState({
    name: 'Test User',
    email: 'test@test.com',
    followers: 123,
    following: 45,
    playlists: 12,
    profileImage: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);

  const handleEditProfile = async () => {
    await triggerHapticFeedback('light');
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    await triggerHapticFeedback('success');
    setUser({ ...user, name: editedName });
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = async () => {
    await triggerHapticFeedback('light');
    setEditedName(user.name);
    setIsEditing(false);
  };

  const StatCard = ({ title, value, icon }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color="#1DB954" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={60} color="#B3B3B3" />
            </View>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.nameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="pencil" size={16} color="#1DB954" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard title="Followers" value={user.followers} icon="people-outline" />
        <StatCard title="Following" value={user.following} icon="person-add-outline" />
        <StatCard title="Playlists" value={user.playlists} icon="library-outline" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Ionicons name="heart" size={20} color="#1DB954" />
          <Text style={styles.activityText}>Liked "Bohemian Rhapsody"</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="add-circle" size={20} color="#1DB954" />
          <Text style={styles.activityText}>Created playlist "Chill Vibes"</Text>
          <Text style={styles.activityTime}>1 day ago</Text>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="share" size={20} color="#1DB954" />
          <Text style={styles.activityText}>Shared "Top Hits 2024"</Text>
          <Text style={styles.activityTime}>3 days ago</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="musical-notes" size={20} color="#1DB954" />
          <Text style={styles.actionButtonText}>View All Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="stats-chart" size={20} color="#1DB954" />
          <Text style={styles.actionButtonText}>Listening Stats</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1DB954',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#1DB954',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    minWidth: 200,
  },
  editButtonsContainer: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#1DB954',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
    padding: 8,
    borderRadius: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  editButtonText: {
    color: '#1DB954',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  email: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  activityText: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 16,
  },
  activityTime: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});