import { useState } from 'react';

/**
 * Custom hook for handling game creation and joining.
 */
export const useCreateGame = () => {
    const [loading, setLoading] = useState(false);
    const [hasNavigated, setNavigated] = useState(false);

    const createAndJoinGame = async (gameName, playerName, gameLength, mapId, router) => {
        if (!playerName.trim() || !gameName.trim() || loading || hasNavigated) return;

        setLoading(true);

        try {
            // Step 1: Create the game
            const createResponse = await fetch('http://trinity-developments.co.uk/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: gameName,
                    gameLength: gameLength.toLowerCase(), // API expects "short" or "long"
                    mapId: mapId, // Default: 801 (Horsforth)
                }),
            });

            const createData = await createResponse.json();
            if (!createResponse.ok) {
                alert(createData.message || "Failed to create game.");
                setLoading(false);
                return;
            }

            const gameId = createData.gameId;
            console.log("Game created successfully:", gameId);

            // Step 2: Join the game as the host with their name
            const joinResponse = await fetch(`http://trinity-developments.co.uk/games/${gameId}/players`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName: playerName }),
            });

            const joinData = await joinResponse.json();
            if (!joinResponse.ok) {
                alert(joinData.message || "Failed to join game as host.");
                setLoading(false);
                return;
            }

            const playerId = joinData.playerId;
            console.log(`Joined game successfully as host: ${playerId} (Name: ${playerName})`);

            setNavigated(true);
            // Navigate directly to the lobby
            router.push(`/lobby/${gameId}?playerId=${playerId}`);

        } catch (error) {
            console.error("Failed to create/join game:", error);
            alert("Error: Failed to create/join game. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return { createAndJoinGame, loading };
};