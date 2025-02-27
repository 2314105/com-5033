import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function JoinLobbyScreen() {
    const router = useRouter();
    const [playerName, setPlayerName] = useState('');

    const handleJoinLobby = () => {
        if (playerName.trim() === '') return; // Prevent empty name

        // Navigate to the lobby screen with player name
        router.push({
            pathname: '/lobby',
            params: {
                lobbyName: 'Mystery Chase', // Placeholder, replace later with actual lobby name
                hostName: 'Joshua', // Placeholder, replace with actual host
                players: 3, // Placeholder, will be dynamic later
                maxPlayers: 6, // Placeholder
                mapType: 'London', // Placeholder
                isHost: false, // Player, not host
                playerName: playerName, // Send player's name
            }
        });
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/join-game')}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Enter Your Name</Text>

            {/* Player Name Input */}
            <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="gray"
                value={playerName}
                onChangeText={setPlayerName}
            />

            {/* Join Lobby Button */}
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinLobby}>
                <Text style={styles.buttonText}>Join Lobby</Text>
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
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 18,
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#D9534F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});