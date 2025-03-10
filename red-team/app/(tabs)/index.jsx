import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';
import { useGameAPI } from '@/hooks/useGameAPI'; // Import custom API hook

export default function HomePage() {
  useForceLandscape();
  const router = useRouter();
  const { games, loading, error, navigationLoading, fetchGames, navigateToJoinGame } = useGameAPI();

  // Fetch games when the component loads
  useEffect(() => {
    fetchGames();
  }, []);

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Not A Scotland Yard Game</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/create-game')}>
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigateToJoinGame(router)}>
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/how-to-play')}>
          <Text style={styles.buttonText}>How to Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        {loading && <Text>Loading...</Text>}

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
  gamesList: {
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
  gameItem: {
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  gameItemText: {
    color: 'white',
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
});