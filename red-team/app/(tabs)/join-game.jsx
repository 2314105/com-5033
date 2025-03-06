import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';
import { useJoinGame } from '@/hooks/useJoinGame'; // Import the extracted hook

export default function JoinGame() {
    useForceLandscape();
    const router = useRouter();
    const { games, loading, error, joinGame } = useJoinGame(); // Use the custom hook
    const [playerName, setPlayerName] = useState('');

    // Get screen width
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Join a Game</Text>

            {/* Player Name Input */}
            <Text style={styles.label}>Enter Your Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="gray"
                value={playerName}
                onChangeText={setPlayerName}
            />

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Loading Indicator */}
            {loading ? (
                <ActivityIndicator size="large" color="white" />
            ) : (
                <FlatList
                    data={games}
                    keyExtractor={(item) => item.gameId.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.lobbyCard, { width: screenWidth * 0.8 }]}>
                            <View style={styles.lobbyInfoContainer}>
                                <Text style={styles.lobbyName}>{item.gameName || 'Unnamed Game'}</Text>
                                <Text style={styles.lobbyInfo}>Map: {item.mapName}</Text>
                                <Text style={styles.lobbyInfo}>Players: {item.players.length}</Text>
                            </View>

                            {/* Join Game Button */}
                            <TouchableOpacity
                                style={styles.joinButton}
                                onPress={() => joinGame(item.gameId, playerName, router)}
                            >
                                <Text style={styles.buttonText}>Join</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
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
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#D9534F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        marginBottom: 10,
    },
    lobbyCard: {
        backgroundColor: '#444',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    lobbyInfoContainer: {
        flex: 1,
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
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});