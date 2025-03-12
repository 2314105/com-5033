import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
    ScrollView, Modal, TextInput, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; // Added Stack import
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GameScreen() {
    const router = useRouter();
    const { gameId, playerId } = useLocalSearchParams();

    const mapImage = "http://trinity-developments.co.uk/images/Horsforth_Game_Map.png";

    const [moveLog, setMoveLog] = useState([]);
    const [howToPlayVisible, setHowToPlayVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [playerData, setPlayerData] = useState(null);
    const [movesData, setMovesData] = useState(null);
    const [startLocation, setStartLocation] = useState(null);
    const [nextLocation, setNextLocation] = useState('');
    const [transportMode, setTransportMode] = useState('');
    const [isAlertShown, setIsAlertShown] = useState(false);

    let intervalId;

    const pollGameState = async () => {
        try {
            const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
            if (!response.ok) return console.error("Failed to poll game state:", response.status);

            const data = await response.json();
            setGameData(data);

            if (data.state === "Over" && !isAlertShown) {
                console.log("Game Over Alert Triggered");
                setIsAlertShown(true);

                const alertMessage = data.winner === "Detective"
                    ? "The fugitive has been caught!"
                    : data.winner === "Fugitive"
                        ? "The fugitive has escaped!"
                        : "The game has ended!";

                Alert.alert("GAME OVER!", alertMessage, [
                    {
                        text: "OK",
                        onPress: () => {
                            clearInterval(intervalId);
                            router.push('/');
                        },
                    },
                ]);
            }
        } catch (error) {
            console.error("Error polling game state:", error);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                console.log("Fetching game with gameId:", gameId);

                const gameResponse = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
                const gameData = await gameResponse.json();
                if (gameResponse.ok) {
                    setGameData(gameData);
                    console.log("Game Data:", gameData);
                }

                const playerResponse = await fetch(`http://trinity-developments.co.uk/players/${playerId}`);
                const playerData = await playerResponse.json();
                if (playerResponse.ok) {
                    setPlayerData(playerData);
                    console.log("Player Data:", playerData);
                }

                const movesResponse = await fetch(`http://trinity-developments.co.uk/players/${playerId}/moves`);
                const movesData = await movesResponse.json();
                if (movesResponse.ok) {
                    setMovesData(movesData);
                    setStartLocation(movesData.startLocation);
                    console.log("Fugitive start location:", movesData.startLocation);
                }

            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
        pollGameState();
        intervalId = setInterval(pollGameState, 3000);

        return () => clearInterval(intervalId);
    }, [gameId, playerId]);

    const isGameOver = (gameData, fugitiveLocation) => {
        if (!gameData?.players) return false;

        return gameData.players.some(player =>
            player.role === 'Fugitive' && player.location === fugitiveLocation
        );
    };

    const handlePlayerMove = async () => {
        if (gameData?.state !== "Detective") {
            Alert.alert("Not your turn", "Please wait for your turn");
            return;
        }

        try {
            const response = await fetch(`http://trinity-developments.co.uk/players/${playerId}/moves`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameID: parseInt(gameId),
                    ticket: transportMode,
                    destination: parseInt(nextLocation),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert("Move Failed", errorData.message || "Failed to submit move.");
                return;
            }

            const responseData = await response.json();
            setStartLocation(nextLocation);

            const gameResponse = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
            const updatedGameData = await gameResponse.json();
            if (gameResponse.ok) {
                setGameData(updatedGameData);

                const newLogEntries = updatedGameData.players.map(player => `${player.playerName} moved to ${player.location}`);
                setMoveLog(newLogEntries);

                if (isGameOver(updatedGameData, nextLocation)) {
                    Alert.alert("GAME OVER!", "The fugitive has been caught");
                }
            }

        } catch (error) {
            Alert.alert("Error", "Wrong transport mode used");
        }

        setNextLocation('');
        setTransportMode('');
        pollGameState();
    };

    return (
        <>
            {/* Hide the header */}
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.container}>
                {/* Left Container: Inputs */}
                <View style={styles.leftContainer}>
                    <Text style={styles.currentLocationText}>
                        Your Current Location: {startLocation ?? 'Loading...'}
                    </Text>

                    <ScrollView contentContainerStyle={styles.buttonList}>
                        {/* Next Location */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Enter your next location:</Text>
                            <TextInput
                                style={styles.input}
                                value={nextLocation}
                                onChangeText={setNextLocation}
                                placeholder='Eg: 2'
                                placeholderTextColor="gray"
                                keyboardType='numeric'
                            />
                        </View>

                        {/* Transport Mode */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Enter mode of transportation:</Text>
                            <TextInput
                                style={styles.input}
                                value={transportMode}
                                onChangeText={setTransportMode}
                                placeholder='Eg: yellow, green, red, black'
                                placeholderTextColor="gray"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handlePlayerMove}
                            disabled={gameData?.state !== "Detective"}
                        >
                            <Text style={styles.submitButtonText}>Move</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Center Map */}
                <View style={styles.mapContainer}>
                    <Image
                        style={styles.mapImage}
                        source={{ uri: mapImage }}
                        resizeMode="contain"
                    />
                </View>

                {/* Right Container */}
                <View style={styles.rightContainer}>
                    <Text style={styles.movementLogTitle}>Move Log</Text>
                    <ScrollView>
                        {moveLog.map((movement, index) => (
                            <Text key={index} style={styles.moveLogText}>{movement}</Text>
                        ))}
                    </ScrollView>

                    {/* How To Play Modal */}
                    <Modal animationType="fade" transparent visible={howToPlayVisible}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>How to Play</Text>
                                <Text style={styles.modalSubTitle}>Gameplay:</Text>
                                <Text style={styles.modalText}>
                                    - Players take turns moving across different locations on the map.{"\n"}
                                    - Use different transport types (Taxi, Bus, Underground) to move.{"\n"}
                                    - Detectives must locate and catch the hidden player.
                                </Text>
                                <Text style={styles.modalSubTitle}>Winning Conditions:</Text>
                                <Text style={styles.modalText}>
                                    - Detectives win by landing on the fugitive's space.{"\n"}
                                    - The fugitive wins by evading capture for a set number of turns.
                                </Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setHowToPlayVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Settings Modal */}
                    <Modal animationType="fade" transparent visible={settingsVisible}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Settings</Text>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>Sound: ON/OFF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>Vibration: ON/OFF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setSettingsVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.bottomButton} onPress={() => setHowToPlayVisible(true)}>
                            <Text style={styles.bottomButtonText}>?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomButton} onPress={() => setSettingsVisible(true)}>
                            <Ionicons name="settings-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        flexDirection: 'row',
    },
    headerText: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
        paddingTop: 20,
        zIndex: 10,
    },
    leftContainer: {
        backgroundColor: '#5e5757',
        width: '15%',
        padding: 10,
        height: '100%',
    },
    buttonList: {
        paddingVertical: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rightContainer: {
        backgroundColor: '#5e5757',
        width: '15%',
        padding: 10,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    movementLogTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    moveLogText: {
        fontSize: 16,
        color: 'white',
        marginVertical: 3,
    },
    mapContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        paddingTop: 20,
    },
    bottomButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    bottomButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign:'center',
        justifyContent:'center'
    },
    modalOverlay: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        width: '100%',
        height: '80%',
        marginTop: 20,
        marginBottom: 20
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    currentLocationText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 8,
        marginTop: 5,
        backgroundColor: 'white'
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 10,
        marginTop: 10
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    inputText: {
        color: 'white',
    }
});