import { useState, useEffect } from 'react';

/**
 * Handling lobby logic.
 */
export const useLobby = (gameId, playerId, router) => {
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
    const leaveGame = async () => {
        return new Promise((resolve, reject) => {
            Alert.alert(
                "Leave Game?",
                "Are you sure you want to leave the lobby?",
                [
                    { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
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
                                    resolve(true);
                                } else {
                                    console.error("Failed to leave game.");
                                    Alert.alert("Error", "Failed to leave game. Please try again.");
                                    reject(new Error("Failed to leave game."));
                                }
                            } catch (error) {
                                console.error("Error leaving game:", error);
                                Alert.alert("Error", "Failed to leave game.");
                                reject(error);
                            }
                        },
                    },
                ]
            );
        });
    };

    return { game, loading, error, leaveGame };
};