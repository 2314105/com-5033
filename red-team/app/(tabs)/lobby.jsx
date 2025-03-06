import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLobby } from '@/hooks/useLobby'; // Import the extracted hook

export default function LobbyScreen() {
    const router = useRouter();
    const { gameId, playerId } = useLocalSearchParams(); // Get gameId & playerId from params
    const { game, loading, error, leaveGame } = useLobby(gameId, playerId, router); // Use the custom hook

    if (loading) {
        return <ActivityIndicator size="large" color="white" style={styles.loader} />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Leave Button */}
            <TouchableOpacity style={styles.backButton} onPress={leaveGame}>
                <Text style={styles.buttonText}>← Leave Lobby</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{game.gameName}</Text>
            <Text style={styles.infoText}>Map: {game.mapName}</Text>
            <Text style={styles.infoText}>Players: {game.players.length}</Text>

            {game.players.map((player) => (
                <Text key={player.playerId} style={styles.infoText}>{player.playerName}</Text>
            ))}
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
        marginBottom: 10,
    },
    infoText: {
        fontSize: 18,
        color: 'white',
        marginBottom: 5,
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
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});