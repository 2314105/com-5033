import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';
import { useGameAPI } from '@/hooks/useGameAPI';

export default function HomePage() {
  useForceLandscape();    // Enforce landscape mode when this screen is rendered
  const router = useRouter();

  // Destructure values from the custom useGameAPI hook
  const {
    games,
    loading,                // Boolean: true when fetching games list
    error,                  // String or object: error info if fetch failed
    navigationLoading,      // Boolean: true when navigating to join game
    fetchGames,             // Function: triggers fetching games list
    navigateToJoinGame      // Function: handles joining a game and navigation
  } = useGameAPI();

  // Fetch games when the component mounts
  useEffect(() => {
    fetchGames();
  }, []);

  // Handlers for navigation buttons
  const handleCreateGame = () => router.push('/create-game');
  const handleJoinGame = () => navigateToJoinGame(router);
  const handleHowToPlay = () => router.push('/how-to-play');
  const handleSettings = () => router.push('/settings');

  return (
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Not A Scotland Yard Game</Text>

        {/* Main Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleCreateGame}>
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleHowToPlay}>
          <Text style={styles.buttonText}>How to Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        {/* Show loading indicator while fetching games */}
        {loading && <Text>Loading games...</Text>}

        {/* Display any error that occurred while fetching games */}
        {error && <Text style={styles.errorText}>Failed to load games. Please try again.</Text>}

        {/* Overlay loading indicator when navigating to join game */}
        {navigationLoading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.overlayText}>Loading Games...</Text>
            </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayText: {
    color: 'white',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});