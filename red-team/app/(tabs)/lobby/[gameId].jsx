import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function LobbyScreen() {
    const router = useRouter();
    const { gameId, playerId } = useLocalSearchParams();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHost, setIsHost] = useState(false);

    // To ensure host determination only runs once
    const isHostSet = useRef(false);

    /**
     * Fetch game details when the component mounts or gameId/playerId changes.
     * Sets game data, and identifies if this player is the host.
     */
    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
                const data = await response.json();

                if (response.ok) {
                    setGame(data);

                    // Determine host only once
                    if (!isHostSet.current) {
                        const firstPlayerId = String(data.players[0].playerId);
                        const currentPlayerId = String(playerId);

                        const hostCheck = firstPlayerId === currentPlayerId;
                        setIsHost(hostCheck);
                        isHostSet.current = true;
                    }
                } else {
                    setError('Failed to fetch game data');
                }
            } catch (err) {
                console.error('Error fetching game details:', err);
                setError('Error fetching game details');
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();

        // Polling game state every 3 seconds to detect game start
        const pollGameState = setInterval(async () => {
            try {
                const res = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
                const data = await res.json();

                if (res.ok) {
                    setGame(data);

                    console.log('Polling game state:', data.state);

                    const normalizedState = data.state.toLowerCase();

                    if (normalizedState === 'fugitive' || normalizedState === 'detective') {
                        console.log('Game has started! Redirecting...');
                        clearInterval(pollGameState);
                        await navigateToGameScreen();
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 3000);

        return () => {
            isHostSet.current = false;
            clearInterval(pollGameState);
        };
    }, [gameId, playerId]);

    /**
     * Navigate the player to their specific game screen based on role.
     */
    const navigateToGameScreen = async () => {
        try {
            const playerResponse = await fetch(`http://trinity-developments.co.uk/players/${playerId}`);
            const playerData = await playerResponse.json();

            if (playerResponse.ok) {
                const role = playerData.role.toLowerCase();

                if (role === 'fugitive') {
                    router.push(`/fugitive/${gameId}?playerId=${playerId}`);
                } else if (role === 'detective') {
                    router.push(`/detective/${gameId}?playerId=${playerId}`);
                } else {
                    Alert.alert('Unknown Role', 'Unable to navigate to the game screen.');
                }
            } else {
                Alert.alert('Error', 'Failed to fetch player role.');
            }
        } catch (error) {
            console.error('Error fetching player role:', error);
            Alert.alert('Error', 'Failed to fetch player role. Please try again.');
        }
    };

    /**
     * Starts the game (only for the host).
     */
    const handleStartGame = async () => {
        try {
            const response = await fetch(
                `http://trinity-developments.co.uk/games/${gameId}/start/${playerId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to start the game.');
            }

            Alert.alert('Game Started!', 'The game has begun.');
        } catch (error) {
            console.error('Error starting game:', error);
            Alert.alert('Error', error.message || 'Failed to start game. Please try again.');
        }
    };

    /**
     * Leaves the lobby and returns the player to the join game screen.
     */
    const handleLeaveGame = () => {
        Alert.alert('Leaving Game', 'Returning to Join Game.');
        router.push('/join-game');
    };

    /**
     * Render loading state
     */
    if (loading) {
        return <ActivityIndicator size="large" color="white" style={styles.loadingIndicator} />;
    }

    /**
     * Render error state
     */
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
            {/* Leave Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleLeaveGame}>
                <Text style={styles.buttonText}>← Leave Lobby</Text>
            </TouchableOpacity>

            {/* Game Info */}
            <Text style={styles.title}>{game.gameName}</Text>
            <Text style={styles.infoText}>Map: {game.mapName}</Text>
            <Text style={styles.infoText}>Players in lobby: {game.players.length}</Text>

            {/* List Players */}
            {game.players.map((player) => (
                <Text key={player.playerId} style={styles.infoText}>
                    {player.playerName}
                </Text>
            ))}

            {/* Start Game button for the host */}
            {isHost && !gameStarted && (
                <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                    <Text style={styles.buttonText}>Start Game</Text>
                </TouchableOpacity>
            )}

            {/* Waiting message for non-host players */}
            {!isHost && !gameStarted && (
                <Text style={styles.waitingText}>Waiting for host to start the game...</Text>
            )}

            {/* Status when game has started */}
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
        textAlign: 'center',
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