import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function LobbyScreen() {
    const router = useRouter();
    const { gameId, playerId } = useLocalSearchParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const isHostSet = useRef(false);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
                const data = await response.json();

                if (response.ok) {
                    setGame(data);

                    if (!isHostSet.current) {
                        const firstPlayerId = String(data.players[0].playerId);
                        const currentPlayerId = String(playerId);

                        const hostCheck = firstPlayerId === currentPlayerId;
                        setIsHost(hostCheck);
                        isHostSet.current = true;
                    }
                }
            } catch (err) {
                console.error("Error fetching game details:", err);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchGameDetails();

        // Polling for game state changes every 3 seconds
        const pollGameState = setInterval(async () => {
            try {
                const res = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
                const data = await res.json();

                if (res.ok) {
                    setGame(data);

                    console.log("Polling game state:", data.state);

                    const normalizedState = data.state.toLowerCase();

                    if (normalizedState === 'fugitive' || normalizedState === 'detective') {
                        console.log("Game has started! Redirecting...");
                        clearInterval(pollGameState);
                        router.push(`/game/${gameId}?playerId=${playerId}`);
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 3000);

        // Cleanup
        return () => {
            isHostSet.current = false;
            clearInterval(pollGameState);
        };
    }, [gameId, playerId]);

    const handleStartGame = async () => {
        try {
            const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}/start/${playerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to start the game.");
            }

            Alert.alert("Game Started!", "The game has begun.");
            router.push(`/game/${gameId}?playerId=${playerId}`);
        } catch (error) {
            console.error('Error starting game: ', error);
            Alert.alert('Error', error.message || 'Failed to start game. Please try again.');
        }
    };

    const handleLeaveGame = () => {
        Alert.alert("Leaving Game", "Returning to Join Game.");
        router.push('/join-game');
    };

    if (loading) {
        return <ActivityIndicator size="large" color="white" style={styles.loadingIndicator} />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const gameStarted = game.state === 'fugitive' || game.state === 'detective';

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleLeaveGame}>
                <Text style={styles.buttonText}>← Leave Lobby</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{game.gameName}</Text>
            <Text style={styles.infoText}>Map: {game.mapName}</Text>
            <Text style={styles.infoText}>Players in lobby: {game.players.length}</Text>

            {game.players.map((player) => (
                <Text key={player.playerId} style={styles.infoText}>{player.playerName}</Text>
            ))}

            {isHost && !gameStarted && (
                <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                    <Text style={styles.buttonText}>Start Game</Text>
                </TouchableOpacity>
            )}

            {!isHost && !gameStarted && (
                <Text style={styles.waitingText}>Waiting for host to start the game...</Text>
            )}

            {gameStarted && (
                <Text style={styles.waitingText}>Game has started. Loading game screen...</Text>
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
    waitingText: {
        fontSize: 16,
        color: 'white',
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