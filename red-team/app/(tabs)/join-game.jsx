import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';

export default function JoinGame() {
    useForceLandscape();
    const router = useRouter();

    // Get screen width
    const screenWidth = Dimensions.get('window').width;

    // Mock lobby data (replace with real data from an API later)
    const [lobbies, setLobbies] = useState([
        { id: '1', name: 'London Chase', players: 3, maxPlayers: 6, length: 'Short', map: 'London' },
        { id: '2', name: 'Leeds Pursuit', players: 4, maxPlayers: 5, length: 'Long', map: 'Leeds' },
        { id: '3', name: 'Horsforth Hideout', players: 2, maxPlayers: 4, length: 'Short', map: 'Horsforth' },
    ]);

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Join a Game</Text>

            {/* Lobby List */}
            <FlatList
                data={lobbies}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.lobbyCard, { width: screenWidth * 0.8 }]}>
                        <View style={styles.lobbyInfoContainer}>
                            <Text style={styles.lobbyName}>{item.name}</Text>
                            <Text style={styles.lobbyInfo}>Players: {item.players}/{item.maxPlayers}</Text>
                            <Text style={styles.lobbyInfo}>Length: {item.length}</Text>
                            <Text style={styles.lobbyInfo}>Map: {item.map}</Text>
                        </View>

                        {/* Join Button (Bottom Right) */}
                        <TouchableOpacity style={styles.joinButton} onPress={() => router.push('/join-lobby')}>
                            <Text style={styles.buttonText}>Join</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
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
        paddingTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
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
    lobbyCard: {
        backgroundColor: '#444',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        flexDirection: 'row', // Align Join button to the right
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lobbyInfoContainer: {
        flex: 1, // Makes sure the text takes up available space
    },
    lobbyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    lobbyInfo: {
        fontSize: 16,
        color: 'white',
        marginBottom: 2,
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-end', // Aligns the button to the bottom right
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});