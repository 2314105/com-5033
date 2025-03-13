import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { apiRequest } from './api';

/**
 * Custom hook for handling lobby data and leaving logic.
 * @param {string} gameId - The current game's ID.
 * @param {string} playerId - The current player's ID.
 * @param {object} router - Expo router instance for navigation.
 */
export const useLobby = (gameId, playerId, router) => {
    const [game, setGame] = useState(null);     // Current game state
    const [loading, setLoading] = useState(true); // Whether game details are loading
    const [error, setError] = useState(null);     // Error message (if any)
    const isMounted = useRef(true);               // Track component mount status to avoid setting state on unmount

    /**
     * Fetch game details from the backend API.
     * Wrapped in `useCallback` to prevent unnecessary recreation.
     */
    const fetchGameDetails = useCallback(async () => {
        if (!gameId) return;

        setLoading(true);
        setError(null);

        try {
            console.log(`Fetching details for gameId: ${gameId}`);

            const data = await apiRequest(`/games/${gameId}`);

            if (!isMounted.current) return; // Don't update state if component is unmounted

            console.log('Game data:', data);
            setGame(data);
        } catch (err) {
            console.error('Error fetching game details:', err.message);
            if (isMounted.current) {
                setError(err.message || 'Error fetching game details.');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [gameId]);

    /**
     * Leave the game and remove the player from the lobby.
     * Opens a confirmation dialog and calls the backend API.
     */
    const leaveGame = () => {
        return new Promise((resolve, reject) => {
            Alert.alert(
                'Leave Game?',
                'Are you sure you want to leave the lobby?',
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                    {
                        text: 'Yes',
                        onPress: async () => {
                            try {
                                console.log(`Removing playerId: ${playerId} from gameId: ${gameId}`);

                                await apiRequest(`/players/${playerId}`, 'DELETE');

                                if (!isMounted.current) return; // Extra safety, probably not needed here though

                                console.log('Successfully left game.');

                                Alert.alert('Success', 'You have left the game.', [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            router.push('/join-game'); // Navigate back to the join screen
                                            resolve(true);
                                        },
                                    },
                                ]);
                            } catch (error) {
                                console.error('Error leaving game:', error.message);
                                Alert.alert('Error', error.message || 'Failed to leave game. Please try again.');
                                reject(error);
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        });
    };

    // Fetch game details when component mounts or when gameId changes
    useEffect(() => {
        isMounted.current = true;
        fetchGameDetails();

        // Clean up on unmount
        return () => {
            isMounted.current = false;
        };
    }, [fetchGameDetails]);

    return {
        game,       // Game state data
        loading,    // Loading state
        error,      // Error state
        leaveGame,  // Function to leave the lobby
        fetchGameDetails, // Function to manually refresh game details if needed
    };
};