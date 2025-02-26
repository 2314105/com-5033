import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Back Button - Top Left */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Settings</Text>

            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Sound: ON/OFF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Vibration: ON/OFF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Language: English</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Reset Game Data</Text>
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
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
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
        fontSize: 18,
        fontWeight: 'bold',
    },
});