import { useState } from 'react';

/**
 * fetching and handling game-related data.
 */
export const useGameAPI = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [navigationLoading, setNavigationLoading] = useState(false);

    const fetchGames = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://trinity-developments.co.uk/games');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setGames(data.games.sort((a, b) => b.gameId - a.gameId)); // Sort games (latest first)
        } catch (e) {
            setError(e.message);
            console.error('Error fetching games:', e);
        } finally {
            setLoading(false);
        }
    };

    const navigateToJoinGame = async (router) => {
        setNavigationLoading(true);
        setError(null);
        try {
            const response = await fetch('http://trinity-developments.co.uk/games');
            const data = await response.json();

            if (response.ok) {
                const sortedGames = data.games.sort((a, b) => b.gameId - a.gameId);

                if (sortedGames.length > 0) {
                    router.push({ pathname: '/join-game', params: { games: JSON.stringify(sortedGames) } });
                } else {
                    alert("No Games Available", "There are no open lobbies to join at the moment.");
                }
            } else {
                setError("Failed to load games.");
            }
        } catch (error) {
            console.error("Error fetching games:", error);
            setError("Error fetching games.");
        } finally {
            setNavigationLoading(false);
        }
    };

    return { games, loading, error, navigationLoading, fetchGames, navigateToJoinGame };
};