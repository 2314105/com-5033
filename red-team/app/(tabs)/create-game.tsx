import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateGame() {
    const router = useRouter();
    const [players, setPlayers] = useState('2');
    const [location, setLocation] = useState('London');
    const [transport, setTransport] = useState('Taxi');

    return (
        <View style={styles.container}>
            {/* Back Button - Top Left */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Create Game</Text>

            <Text style={styles.label}>Select Players:</Text>
            <View style={styles.optionContainer}>
                {["2", "3", "4", "5"].map((value) => (
                    <TouchableOpacity key={value} style={[styles.optionButton, players === value && styles.selectedOption]} onPress={() => setPlayers(value)}>
                        <Text style={styles.optionText}>{value} Players</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Select Location:</Text>
            <View style={styles.optionContainer}>
                {["Horsforth", "Leeds", "Bradford"].map((value) => (
                    <TouchableOpacity key={value} style={[styles.optionButton, location === value && styles.selectedOption]} onPress={() => setLocation(value)}>
                        <Text style={styles.optionText}>{value}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Select Transport:</Text>
            <View style={styles.optionContainer}>
                {["Taxi", "Bus", "Underground", "Secret Routes"].map((value) => (
                    <TouchableOpacity key={value} style={[styles.optionButton, transport === value && styles.selectedOption]} onPress={() => setTransport(value)}>
                        <Text style={styles.optionText}>{value}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/generate-code')}>
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