import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';
import { useJoinGame } from '@/hooks/useJoinGame'; // Custom hook for joining games

export default function JoinGame() {
    useForceLandscape(); // Lock orientation to landscape
    const router = useRouter();

    // Destructure state and functions from custom hook
    const { games, loading, error, joinGame } = useJoinGame();

    const [playerName, setPlayerName] = useState('');

    // Dynamically adjust card width based on screen size
    const screenWidth = Dimensions.get('window').width;

    /**
     * Handles joining a game after validating input.
     * @param {string} gameId - ID of the game lobby to join.
     */
    const handleJoinGame = (gameId) => {
        if (!playerName.trim()) {
            Alert.alert('Missing Name', 'Please enter your player name before joining a game.');
            return;
        }

        joinGame(gameId, playerName, router);
    };

    /**
     * Handles back navigation.
     */
    const handleBack = () => {
        router.push('/');
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>

            {/* Title */}
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

            {/* Show error message if any */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Loading indicator when fetching games */}
            {loading ? (
                <ActivityIndicator size="large" color="white" />
            ) : (
                <FlatList
                    data={games}
                    keyExtractor={(item) => item.gameId.toString()}
                    contentContainerStyle={styles.listContent}
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
                                onPress={() => handleJoinGame(item.gameId)}
                            >
                                <Text style={styles.buttonText}>Join</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No games available. Try refreshing!</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Fill screen
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
    emptyText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    lobbyCard: {
        backgroundColor: '#444',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    listContent: {
        paddingBottom: 40, // Adds bottom padding so content isn't cut off on smaller screens
    },
});