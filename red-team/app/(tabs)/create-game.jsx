import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';
import { useCreateGame } from '@/hooks/useCreateGame'; // Import custom hook

export default function CreateGame() {
    useForceLandscape();
    const router = useRouter();
    const { createAndJoinGame, loading } = useCreateGame();

    // State variables for form inputs
    const [playerName, setPlayerName] = useState('');
    const [gameName, setGameName] = useState('');
    const [gameLength, setGameLength] = useState('Short');
    const [mapId, setMapId] = useState(801);

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
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => createAndJoinGame(gameName, playerName, gameLength, mapId, router)}
                disabled={loading}
            >
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