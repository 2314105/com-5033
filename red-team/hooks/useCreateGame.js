// hooks/useCreateGame.js
import { useState } from 'react';
import { apiRequest } from './api';

/**
 * Custom hook for handling game creation and joining.
 */
export const useCreateGame = () => {
    const [loading, setLoading] = useState(false);
    const [hasNavigated, setHasNavigated] = useState(false);

    /**
     * Creates a game and joins as host.
     * @param {string} gameName - Name of the game
     * @param {string} playerName - Host player name
     * @param {string} gameLength - 'Short' or 'Long'
     * @param {number} mapId - Map ID (default 801)
     * @param {object} router - Expo router instance
     */
    const createAndJoinGame = async (gameName, playerName, gameLength, mapId, router) => {
        if (!playerName.trim() || !gameName.trim()) {
            alert('Please fill in both your player name and game name.');
            return;
        }

        if (loading || hasNavigated) {
            console.log('Blocked duplicate submission');
            return;
        }

        setLoading(true);

        try {
            // STEP 1: Create the game
            const createData = await apiRequest('/games', 'POST', {
                name: gameName,
                gameLength: gameLength.toLowerCase(), // lowercase for API
                mapId: mapId,
            });

            const gameId = createData.gameId;
            console.log('Game created successfully:', gameId);

            // STEP 2: Join as host player
            const joinData = await apiRequest(`/games/${gameId}/players`, 'POST', {
                playerName: playerName,
            });

            const playerId = joinData.playerId;
            console.log(`Joined game successfully as host: Player ID ${playerId}`);

            // STEP 3: Navigate to the lobby screen
            setHasNavigated(true);
            router.push(`/lobby/${gameId}?playerId=${playerId}`);
        } catch (error) {
            console.error('Create/Join game error:', error.message);
            alert(error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return { createAndJoinGame, loading };
};