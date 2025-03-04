import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function LobbyScreen() {
    const router = useRouter();
    const { gameId, playerId } = useLocalSearchParams(); // Get gameId & playerId from params
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

    // Leave Game & Remove Player from Lobby
    const handleLeaveGame = async () => {
        Alert.alert(
            "Leave Game?",
            "Are you sure you want to leave the lobby?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            console.log(`Removing playerId: ${playerId} from gameId: ${gameId}`);

                            const response = await fetch(`http://trinity-developments.co.uk/players/${playerId}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                            });

                            if (response.ok) {
                                console.log("Successfully left game.");
                                Alert.alert("Success", "You have left the game.");
                                router.push('/join-game'); // Navigate back to join game screen
                            } else {
                                console.error("Failed to leave game.");
                                Alert.alert("Error", "Failed to leave game. Please try again.");
                            }
                        } catch (error) {
                            console.error("Error leaving game:", error);
                            Alert.alert("Error", "Failed to leave game.");
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="white" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    if (error) {
        return <View style={styles.container}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            {/* Leave Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleLeaveGame}>
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
});