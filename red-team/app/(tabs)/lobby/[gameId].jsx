import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function LobbyScreen() {
    const router = useRouter();
    const { gameId } = useLocalSearchParams(); // Get gameId from the URL
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch game details when entering the lobby
    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                console.log(`Fetching details for gameId: ${gameId}`);
                const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
                const data = await response.json();

                if (response.ok) {
                    console.log("Game data:", data);
                    setGame(data);
                } else {
                    setError("Failed to load game details.");
                }
            } catch (err) {
                console.error("Error fetching game details:", err);
                setError("Error fetching game details.");
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [gameId]);

    // Start Game (Only for Host)
    const handleStartGame = async () => {
        try {
            const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}/start/1`, { // ⚠️ Replace 1 with actual playerId later
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error("Failed to start the game.");
            }

            Alert.alert("Game Started!", "The game has begun.");
            router.push(`/game/${gameId}`); // 🚀 Send players to the game screen
        } catch (error) {
            console.error('Error starting game: ', error);
            Alert.alert('Error', 'Failed to start game. Please try again.');
        }
    };

    // Leave Game
    const handleLeaveGame = () => {
        Alert.alert("Leaving Game", "Returning to Join Game.");
        router.push('/join-game');
    };

    if (loading) {
        return <ActivityIndicator size="large" color="white" style={styles.loadingIndicator} />;
    }

    if (error) {
        return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            {/* Leave Lobby Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleLeaveGame}>
                <Text style={styles.buttonText}>← Leave Lobby</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{game.gameName}</Text>
            <Text style={styles.infoText}>Map: {game.mapName}</Text>
            <Text style={styles.infoText}>Players: {game.players.length}</Text>

            {game.players.map((player) => (
                <Text key={player.playerId} style={styles.infoText}>{player.playerName}</Text>
            ))}

            {/* Show "Start Game" button only for the host */}
            {game.hostId === 1 && ( // ⚠️ Replace 1 with actual host playerId
                <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                    <Text style={styles.buttonText}>Start Game</Text>
                </TouchableOpacity>
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
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    startButton: {
        backgroundColor: '#4CAF50',
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
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
});