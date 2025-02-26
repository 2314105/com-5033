import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function GenerateCode() {
    const router = useRouter();
    const [name, setName] = useState('');
    const code = "RG-TC-GI";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Generate Code</Text>

            <Text style={styles.label}>Enter Your Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Generated Code:</Text>
            <Text style={styles.code}>{code}</Text>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/game')}>
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Back</Text>
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
    },
    code: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
    },
    backButton: {
        backgroundColor: '#D9534F',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
