import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Not A Scotland Yard Game</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/create-game')}>
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/join-game')}>
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/how-to-play')}>
          <Text style={styles.buttonText}>How to Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
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
});