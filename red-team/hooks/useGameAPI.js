import { useState } from 'react';
import { Alert } from 'react-native'; // Import Alert from react-native for alerts

/**
 * Custom hook to fetch and handle game-related data.
 */
export const useGameAPI = () => {
    // State to hold the games list
    const [games, setGames] = useState([]);

    // UI state for data fetching & navigation
    const [loading, setLoading] = useState(false);
    const [navigationLoading, setNavigationLoading] = useState(false);

    // State to store any error messages
    const [error, setError] = useState(null);

    /**
     * Helper function to fetch games from the backend.
     * Optionally returns games, useful if we want to use them without updating state.
     */
    const getGamesFromAPI = async () => {
        try {
            const response = await fetch('http://trinity-developments.co.uk/games');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Return sorted games list
            return data.games.sort((a, b) => b.gameId - a.gameId);
        } catch (e) {
            console.error('Error fetching games:', e);
            throw e; // Re-throw to handle in calling function
        }
    };

    /**
     * Fetches games and updates state. Call this in components when you want to refresh the games list.
     */
    const fetchGames = async () => {
        setLoading(true);
        setError(null);

        try {
            const gamesList = await getGamesFromAPI();
            setGames(gamesList); // Update games in state
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Navigates the user to the join game page.
     * Fetches games, checks if there are any lobbies available, and routes accordingly.
     * @param {object} router - Expo Router navigation object
     */
    const navigateToJoinGame = async (router) => {
        setNavigationLoading(true);
        setError(null);

        try {
            const gamesList = await getGamesFromAPI();

            if (gamesList.length > 0) {
                // Navigate to join-game screen, passing games as params (stringified)
                router.push({
                    pathname: '/join-game',
                    params: { games: JSON.stringify(gamesList) },
                });
            } else {
                // Alert if no games are available to join
                Alert.alert("No Games Available", "There are no open lobbies to join at the moment.");
            }

        } catch (e) {
            setError("Failed to load games.");
        } finally {
            setNavigationLoading(false);
        }
    };

    // Expose data and functions from the hook
    return {
        games,                 // The list of games
        loading,               // Whether the games list is loading
        error,                 // Any error messages
        navigationLoading,     // Whether a navigation process is in progress
        fetchGames,            // Function to trigger fetching games
        navigateToJoinGame,    // Function to navigate to join a game
    };
};