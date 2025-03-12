import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLobby } from '@/hooks/useLobby'; // Custom hook for fetching lobby data and actions

export default function LobbyScreen() {
    const router = useRouter();
    const { gameId, playerId } = useLocalSearchParams(); // Grab params from the URL

    // Destructure lobby state and actions from the custom hook
    const { game, loading, error, leaveGame } = useLobby(gameId, playerId, router);

    /**
     * Handle user leaving the lobby.
     * Could be expanded to confirm before leaving!
     */
    const handleLeaveLobby = () => {
        leaveGame();
    };

    // Loading screen
    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    // Error screen
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>

                <TouchableOpacity style={styles.backButton} onPress={handleLeaveLobby}>
                    <Text style={styles.buttonText}>← Leave Lobby</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Main lobby view
    return (
        <View style={styles.container}>
            {/* Leave Lobby Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleLeaveLobby}>
                <Text style={styles.buttonText}>← Leave Lobby</Text>
            </TouchableOpacity>

            {/* Lobby Details */}
            <Text style={styles.title}>{game?.gameName || 'Unnamed Game'}</Text>
            <Text style={styles.infoText}>Map: {game?.mapName || 'Unknown Map'}</Text>
            <Text style={styles.infoText}>Players: {game?.players?.length || 0}</Text>

            {/* Player List */}
            {game?.players?.length > 0 ? (
                game.players.map((player) => (
                    <Text key={player.playerId} style={styles.playerName}>
                        {player.playerName}
                    </Text>
                ))
            ) : (
                <Text style={styles.infoText}>Waiting for players...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',      // Center vertically
        alignItems: 'center',          // Center horizontally
        backgroundColor: '#282c34',    // Dark background
        paddingHorizontal: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',      // Center spinner vertically
        alignItems: 'center',          // Center spinner horizontally
        backgroundColor: '#282c34',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 18,
        color: 'white',
        marginBottom: 5,
    },
    playerName: {
        fontSize: 18,
        color: '#4CAF50',
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
        marginBottom: 20,
    },
});