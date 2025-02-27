import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LobbyScreen() {
    const router = useRouter();

    // Fake data for now
    const lobbyName = "Mystery Chase";
    const hostName = "Joshua";
    const players = 3;
    const maxPlayers = 6;
    const mapType = "London";
    const gameLength = "Short";
    const isHost = true; // Change to false to simulate a player

    return (
        <View style={styles.background}>
            <View style={styles.overlay}>
                {/* Lobby Info */}
                <Text style={styles.lobbyTitle}>{lobbyName}</Text>
                <Text style={styles.infoText}>Host: {hostName}</Text>
                <Text style={styles.infoText}>Players: {players}/{maxPlayers}</Text>
                <Text style={styles.infoText}>Map: {mapType}</Text>
                <Text style={styles.infoText}>Length: {gameLength}</Text>

                {/* Conditional Buttons */}
                {isHost ? (
                    <TouchableOpacity style={styles.startButton} onPress={() => router.push('/game')}>
                        <Text style={styles.buttonText}>Start Game</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.leaveButton} onPress={() => router.push('/join-game')}>
                        <Text style={styles.buttonText}>Leave Lobby</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'green', // Green placeholder background
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay for readability
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        width: '85%',
    },
    lobbyTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 18,
        color: 'white',
        marginBottom: 5,
    },
    startButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
    },
    leaveButton: {
        backgroundColor: '#D9534F',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});