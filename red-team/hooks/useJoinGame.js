import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiRequest } from './api'; // Import your centralized API handler

/**
 * Custom hook for fetching available games and handling joining a game lobby.
 */
export const useJoinGame = () => {
    const [games, setGames] = useState([]);     // List of available game lobbies
    const [loading, setLoading] = useState(true); // Loading state for fetching games
    const [error, setError] = useState(null);     // Error message if fetching fails

    /**
     * Fetches all available games from the backend API.
     */
    const fetchGames = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiRequest('/games'); // Using the centralized apiRequest!

            const sortedGames = data.games.sort((a, b) => b.gameId - a.gameId);
            setGames(sortedGames);
        } catch (err) {
            console.error('Fetch Games Error:', err.message);
            setError(err.message || 'Error fetching games. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Join a game lobby as a player.
     * @param {string|number} gameId - ID of the game lobby to join.
     * @param {string} playerName - Name of the player joining.
     * @param {object} router - Router instance from expo-router for navigation.
     */
    const joinGame = async (gameId, playerName, router) => {
        if (!playerName.trim()) {
            Alert.alert('Missing Name', 'Please enter a player name before joining.');
            return;
        }

        try {
            console.log(`Joining game ${gameId} as player "${playerName}"`);

            const data = await apiRequest(`/games/${gameId}/players`, 'POST', {
                playerName,
            });

            console.log('Joined game successfully:', data);

            router.push({
                pathname: `/lobby/${gameId}`,
                params: { playerId: data.playerId },
            });
        } catch (error) {
            console.error('Join Game Error:', error.message);
            Alert.alert('Join Failed', error.message || 'Failed to join game.');
        }
    };

    // Fetch games when hook mounts
    useEffect(() => {
        fetchGames();
    }, []);

    return {
        games,
        loading,
        error,
        joinGame,
    };
};