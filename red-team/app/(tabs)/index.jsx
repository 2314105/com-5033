import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';

export default function HomePage() {
  useForceLandscape();
  const getGamesURL = 'http://trinity-developments.co.uk/games';
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navigationLoading, setNavigationLoading] = useState(false);

  const joinGame = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getGamesURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGames(data.games);
    } catch (e) {
      setError(e.message);
      console.error('Error fetching games: ', e);
    } finally {
      setLoading(false);
    }
  }

  const navigateToJoinGame = async () => {
    setNavigationLoading(true);
    setError(null);

    try {
      const response = await fetch(getGamesURL);
      const data = await response.json();

      if (response.ok) {
        const sortedGames = data.games.sort((a, b) => b.gameId - a.gameId);

        if (sortedGames.length > 0) {
          router.push({ pathname: '/join-game', params: { games: JSON.stringify(sortedGames) } });
        } else {
          Alert.alert("No Games Available", "There are no open lobbies to join at the moment.");
        }
      } else {
        setError("Failed to load games.");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Error fetching games.");
    } finally {
      setNavigationLoading(false);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Not A Scotland Yard Game</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/create-game')}>
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={navigateToJoinGame}>
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/how-to-play')}>
          <Text style={styles.buttonText}>How to Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        {loading && <Text>Loading...</Text>}

        {games  && (
          <ScrollView style={styles.gamesList}>
            {games.map((game, index) => (
              <TouchableOpacity key={index} style={styles.gameItem} onPress={() => router.push(`/game/${game.id}`)}>
                <Text style={styles.gameItemText}>Game ID: {game.gameId}</Text>
                <Text style={styles.gameItemText}>Host: {game.gameName}</Text>
                <Text style={styles.gameItemText}>Players: {game.players}</Text>
                <Text style={styles.gameItemText}>Location: {game.mapName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {navigationLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff"/>
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
    maxWidth: 300
  },
  gameItem: {
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8
  },
  gameItemText: {
    color: 'white'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  overlayText: {
    color: 'white',
    marginTop: 10
  }
});