import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
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

export default function PlaylistsScreen() {
  const playlists = [
    {
      id: '1',
      title: 'Today\'s Top Hits',
      description: 'The biggest songs of the moment',
      image: 'https://picsum.photos/200/200?random=1',
      songs: 50,
      followers: '28,543,210',
    },
    {
      id: '2',
      title: 'Chill Vibes',
      description: 'Relaxing music for any mood',
      image: 'https://picsum.photos/200/200?random=2',
      songs: 127,
      followers: '1,234,567',
    },
    {
      id: '3',
      title: 'Workout Mix',
      description: 'High energy tracks to fuel your workout',
      image: 'https://picsum.photos/200/200?random=3',
      songs: 89,
      followers: '892,345',
    },
    {
      id: '4',
      title: 'Indie Pop',
      description: 'Discover new indie pop artists',
      image: 'https://picsum.photos/200/200?random=4',
      songs: 156,
      followers: '567,890',
    },
    {
      id: '5',
      title: 'Late Night Drive',
      description: 'Perfect soundtrack for night drives',
      image: 'https://picsum.photos/200/200?random=5',
      songs: 73,
      followers: '445,678',
    },
  ];

  const recentlyPlayed = [
    {
      id: '6',
      title: 'Liked Songs',
      description: 'Songs you love',
      image: 'https://picsum.photos/200/200?random=6',
      songs: 342,
      isLikedSongs: true,
    },
    {
      id: '7',
      title: 'Recently Played',
      description: 'Your listening history',
      image: 'https://picsum.photos/200/200?random=7',
      songs: 28,
      isRecent: true,
    },
  ];

  const PlaylistCard = ({ playlist, size = 'large' }) => {
    const cardWidth = size === 'large' ? width * 0.4 : width * 0.3;

    return (
      <TouchableOpacity
        style={[styles.playlistCard, { width: cardWidth }]}
        onPress={async () => {
          await triggerHapticFeedback('light');
          // Handle playlist press
        }}
      >
        <View style={[styles.playlistImageContainer, { width: cardWidth - 16, height: cardWidth - 16 }]}>
          <Image source={{ uri: playlist.image }} style={styles.playlistImage} />
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={24} color="#121212" />
          </TouchableOpacity>
        </View>
        <Text style={styles.playlistTitle} numberOfLines={1}>
          {playlist.title}
        </Text>
        <Text style={styles.playlistDescription} numberOfLines={2}>
          {playlist.description}
        </Text>
        {playlist.songs && (
          <Text style={styles.playlistMeta}>
            {playlist.songs} songs • {playlist.followers} followers
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const SectionHeader = ({ title, actionText, onActionPress }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.sectionAction}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPlaylistItem = ({ item }) => (
    <PlaylistCard playlist={item} />
  );

  const renderSmallPlaylistItem = ({ item }) => (
    <PlaylistCard playlist={item} size="small" />
  );

  return (
    <ScrollView style={styles.container}>
      {/* Recently Played Section */}
      <View style={styles.section}>
        <SectionHeader title="Recently Played" />
        <FlatList
          data={recentlyPlayed}
          renderItem={renderSmallPlaylistItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Made For You Section */}
      <View style={styles.section}>
        <SectionHeader
          title="Made For You"
          actionText="See all"
        />
        <FlatList
          data={playlists.slice(0, 3)}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Popular Playlists Section */}
      <View style={styles.section}>
        <SectionHeader
          title="Popular Playlists"
          actionText="See all"
        />
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <SectionHeader title="Browse" />
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="search" size={24} color="#1DB954" />
            <Text style={styles.quickActionText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="trending-up" size={24} color="#1DB954" />
            <Text style={styles.quickActionText}>Charts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="radio" size={24} color="#1DB954" />
            <Text style={styles.quickActionText}>Radio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="musical-notes" size={24} color="#1DB954" />
            <Text style={styles.quickActionText}>Genres</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionAction: {
    fontSize: 16,
    color: '#1DB954',
    fontWeight: '600',
  },
  horizontalList: {
    paddingRight: 16,
  },
  playlistCard: {
    marginRight: 16,
  },
  playlistImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  playlistImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  playButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#1DB954',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 4,
  },
  playlistMeta: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    margin: 8,
    minWidth: 80,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});