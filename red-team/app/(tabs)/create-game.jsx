import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';

export default function CreateGame() {
    useForceLandscape();
    const router = useRouter();

    // State variables
    const [gameName, setGameName] = useState('');
    const [gameLength, setGameLength] = useState('Short'); // "Short" or "Long"
    const [mapId, setMapId] = useState(801); // Default: "Horsforth"
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!gameName.trim()) {
            Alert.alert("Error", "Please enter a game name.");
            return;
        }

        setLoading(true); // Show loading state

        try {
            const response = await fetch('http://trinity-developments.co.uk/games', {
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

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", `Game "${gameName}" created successfully!`);

                // 🚀 Navigate back to **Home Page** instead of Join Game
                router.push('/');
            } else {
                Alert.alert("Error", data.message || "Failed to create game.");
            }
        } catch (error) {
            console.error("Failed to create game:", error);
            Alert.alert("Error", "Failed to create game. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Create Game</Text>

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

            {/* Confirm Button */}
            <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
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
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 20,
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
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});