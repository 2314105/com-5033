import { useState, useEffect } from 'react';

/**
 * Handling game fetching and joining.
 */
export const useJoinGame = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch available games from API
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch('http://trinity-developments.co.uk/games');
                const data = await response.json();

                if (response.ok) {
                    const sortedGames = data.games.sort((a, b) => b.gameId - a.gameId);
                    setGames(sortedGames);
                } else {
                    setError(data.message || 'Failed to fetch games.');
                }
            } catch (err) {
                console.error('Failed to fetch games:', err);
                setError('Error fetching games. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    // Function to join a game
    const joinGame = async (gameId, playerName, router) => {
        if (!playerName.trim()) {
            alert("Enter Name", "Please enter a player name before joining.");
            return;
        }

        try {
            console.log(`Joining game: ${gameId} as ${playerName}`);
            const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}/players`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Joined game successfully:', data);
                router.push({ pathname: `/game/${gameId}`, params: { playerId: data.playerId } });
            } else {
                console.warn("API error:", data.message);
                alert(data.message || "Failed to join game.");
            }
        } catch (error) {
            console.error('Error joining game:', error);
            alert('Failed to join game. Please try again.');
        }
    };

    return { games, loading, error, joinGame };
};