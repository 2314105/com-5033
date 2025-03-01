import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';

export default function CreateGame() {
    useForceLandscape();
    const router = useRouter();
    const [hostName, setHostName] = useState('');
    const [gameLength, setGameLength] = useState('Short');
    const [players, setPlayers] = useState('3');
    const gameId = '';

    const handleConfirm = () => {
        router.push({
            pathname: '/lobby',
            params: {
                hostName: hostName,
                gameLength: gameLength,
                players: players,
                maxPlayers: 6,
                gameId: gameId,               
            },
        });
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Create Game</Text>

            {/* Host Name Input */}
            <Text style={styles.label}>Host Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="gray"
                value={hostName}
                onChangeText={setHostName}
            />

            {/* Game Length Toggle */}
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

            {/* Player Amount Selection (3-6) */}
            <Text style={styles.label}>Number of Players:</Text>
            <View style={styles.optionContainer}>
                {["3", "4", "5", "6"].map((value) => (
                    <TouchableOpacity
                        key={value}
                        style={[styles.optionButton, players === value && styles.selectedOption]}
                        onPress={() => setPlayers(value)}
                    >
                        <Text style={styles.optionText}>{value} Players</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
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