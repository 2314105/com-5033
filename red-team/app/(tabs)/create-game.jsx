import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';

export default function CreateGame() {
    useForceLandscape();
    const router = useRouter();

    // State variables
    const [playerName, setPlayerName] = useState(''); // Player's name
    const [gameName, setGameName] = useState('');
    const [gameLength, setGameLength] = useState('Short'); // "Short" or "Long"
    const [mapId, setMapId] = useState(801); // Default: "Horsforth"
    const [loading, setLoading] = useState(false);
    const [hasNavigated, setNavigated] = useState(false);

    const handleConfirm = async () => {
        if (!playerName.trim() || !gameName.trim() || loading || hasNavigated) return;
        
        setLoading(true); // Show loading state

        try {
            // Step 1: Create the game
            const createResponse = await fetch('http://trinity-developments.co.uk/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: gameName,
                    gameLength: gameLength.toLowerCase(), // API expects "short" or "long"
                    mapId: mapId // Default: 801 (Horsforth)
                }),
            });

            const createData = await createResponse.json();
            if (!createResponse.ok) {
                Alert.alert("Error", createData.message || "Failed to create game.");
                setLoading(false);
                return;
            }

            const gameId = createData.gameId;
            console.log("Game created successfully:", gameId);

            // Step 2: Join the game as the host with their name
            const joinResponse = await fetch(`http://trinity-developments.co.uk/games/${gameId}/players`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({playerName: playerName}),
            });

            const joinData = await joinResponse.json();
            if (!joinResponse.ok) {
                Alert.alert("Error", joinData.message || "Failed to join game as host.");
                setLoading(false);
                return;
            }

            const playerId = joinData.playerId;
            console.log(`Joined game successfully as host: ${playerId} (Name: ${playerName})`);

            setNavigated(true);
            // Navigate directly to the lobby with `gameId` and `playerId`
            router.push(`/lobby/${gameId}?playerId=${playerId}`);

        } catch (error) {
            console.error("Failed to create/join game:", error);
            Alert.alert("Error", "Failed to create/join game. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button - Top Left */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Create Game</Text>

            {/* Player Name Input */}
            <Text style={styles.label}>Your Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="gray"
                value={playerName}
                onChangeText={setPlayerName}
            />

            {/* Game Name Input */}
            <Text style={styles.label}>Game Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter game name"
                placeholderTextColor="gray"
                value={gameName}
                onChangeText={setGameName}
            />

            {/* Game Length Selection */}
            <Text style={styles.label}>Game Length:</Text>
            <View style={styles.optionContainer}>
                {["Short", "Long"].map((value) => (
                    <TouchableOpacity
                        key={value}
                        style={[styles.optionButton, gameLength === value && styles.selectedOption]}
                        onPress={() => setGameLength(value)}
                    >
                        <Text style={styles.optionText}>{value}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Confirm Button - Bottom Right */}
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm</Text>}
            </TouchableOpacity>
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
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: 'white',
        marginTop: 10,
    },
    input: {
        width: '80%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 18,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    optionButton: {
        backgroundColor: '#444',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    selectedOption: {
        backgroundColor: '#4CAF50',
    },
    optionText: {
        color: 'white',
        fontSize: 16,
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
    confirmButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});