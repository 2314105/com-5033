import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';
import { useCreateGame } from '@/hooks/useCreateGame'; // Custom hook for game creation logic

export default function CreateGame() {
    useForceLandscape(); // Lock screen orientation to landscape
    const router = useRouter();

    // Destructure loading state and create function from the hook
    const { createAndJoinGame, loading } = useCreateGame();

    // State variables for form inputs
    const [playerName, setPlayerName] = useState('');
    const [gameName, setGameName] = useState('');
    const [gameLength, setGameLength] = useState('Short'); // "Short" by default
    const [mapId, setMapId] = useState(801); // Static for now, could be dynamic later

    /**
     * Handles form submission.
     * Optionally validate inputs before calling the API.
     */
    const handleCreateGame = () => {
        // Basic validation (optional but recommended)
        if (!playerName.trim() || !gameName.trim()) {
            alert('Please fill in both your name and game name.');
            return;
        }

        createAndJoinGame(gameName, playerName, gameLength, mapId, router);
    };

    /**
     * Handles back navigation to HomePage
     */
    const handleBack = () => {
        router.push('/');
    };

    return (
        <View style={styles.container}>

            {/* Back Button - Top Left */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            {/* Title */}
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
                {['Short', 'Long'].map((value) => (
                    <TouchableOpacity
                        key={value}
                        style={[
                            styles.optionButton,
                            gameLength === value && styles.selectedOption,
                        ]}
                        onPress={() => setGameLength(value)}
                    >
                        <Text style={styles.optionText}>{value}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Confirm Button - Bottom Right */}
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleCreateGame}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Confirm</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Fill the screen
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundColor: '#282c34', // Dark background color
        paddingHorizontal: 20, // Padding on the sides
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
        backgroundColor: '#4CAF50', // Highlight selected option
    },
    optionText: {
        color: 'white',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#D9534F', // Red button for back
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    confirmButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#4CAF50', // Green button for confirm
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