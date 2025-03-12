import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function GameScreen() {
    const { gameId, playerId } = useLocalSearchParams();
    const mapImage = "http://trinity-developments.co.uk/images/Horsforth_Game_Map.png";
    const gameStatus = "http://trinity-developments.co.uk/games/{gameId}"; // Can GET game status 
    const playerStatus = "http://trinity-developments.co.uk/players/{playerId}"; // Can GET current player status AND DELETE player from game
    const playerMoves = "http://trinity-developments.co.uk/players/{playerId}/moves"; // Can GET player move history AND POST player move
    const router = useRouter();

    // Move Log
    const [moveLog, setMoveLog] = useState([]);

    // States
    const [howToPlayVisible, setHowToPlayVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [gameData, setGameData] = useState(null);
    const [playerData, setPlayerData] = useState(null);
    const [movesData, setMovesData] = useState(null);
    const [startLocation, setStartLocation] = useState(null);
    const [nextLocation, setNextLocation] = useState('');
    const [transportMode, setTransportMode] = useState('');
    const [isAlertShown, setIsAlertShown] = useState(false);
    const intervalRef = useRef(null);


    const pollGameState = async () => {
        try {
            const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
            if (response.ok) {
                const data = await response.json();
                setGameData(data);

                if (data.state === "Over") {
                    if (!isAlertShown) {
                        setIsAlertShown(true);
                        let alertMessage = "";
                        if (data.winner === "Detective") {
                            alertMessage = "The fugitive has been caught!";
                        } else if (data.winner === "Fugitive") {
                            alertMessage = "The fugitive has escaped!";
                        } else{
                            alertMessage = "The game has ended!";
                        }
    
                        Alert.alert("GAME OVER!", alertMessage, [
                            {
                                text: "OK",
                                onPress: () => {
                                    if (intervalRef.current) {
                                        clearInterval(intervalRef.current);
                                    }
                                    router.push('/')
                                },
                            },
                        ]);
                    }
                    return;
                }
            } else {
                console.error("Failed to poll game state: ", response.status);
            }
        } catch (error) {
            console.error("Error pollin game state: ", error);
        }
    };

    useEffect(() => {
        const fetchGameAndPlayerData = async () => {
            try {
                console.log("Fetching game with gameId: ", gameId);

                // GAME DATA
                const gameResponse = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
                if (gameResponse.ok) {
                    const gameData = await gameResponse.json();
                    setGameData(gameData);
                    console.log("Game Data: ", gameData);
                } else {
                    console.error("Failed to fetch game data: ", gameResponse.status);
                }

                // PLAYER DATA
                const playerResponse = await fetch(`http://trinity-developments.co.uk/players/${playerId}`);
                if (playerResponse.ok) {
                    const playerData = await playerResponse.json();
                    setPlayerData(playerData);
                    console.log("Player Data: ", playerData);
                } else {
                    console.error("Failed to fetch player data: ", playerResponse.status);
                }

                // MOVES DATA
                const movesResponse = await fetch(`http://trinity-developments.co.uk/players/${playerId}/moves`);
                if (movesResponse.ok) {
                    const movesData = await movesResponse.json();
                    setMovesData(movesData);
                    setStartLocation(movesData.startLocation);
                    console.log("Fugitive start location: ", movesData.startLocation);
                } else {
                    console.log("Failed to fetch moves data: ", movesResponse.status)
                }
            } catch (error) {
                console.log("Error fetching data: ", error)
            }
        };

        fetchGameAndPlayerData();
        pollGameState();

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(pollGameState, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [gameId, playerId]);


    const isGameOver = (gameData, fugitiveLocation) => {
        if (!gameData || !gameData.players) return false;

        for (const player of gameData.players) {
            if (player.role === 'Detective' && player.location === fugitiveLocation) {
                return true;
            }
        }
        return false;
    }


    const handlePlayerMove = async () => {
        if (gameData && gameData.state !== "Fugitive") {
            Alert.alert("Not your turn", "Please wait your turn.");
            return;
        }

        try {
            const response = await fetch(`http://trinity-developments.co.uk/players/${playerId}/moves`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gameID: parseInt(gameId),
                    ticket: transportMode,
                    destination: parseInt(nextLocation),
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Move Successful: ", responseData);
                setStartLocation(nextLocation);
                fugitiveLocation = nextLocation;

                const gameResponse = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
                if (gameResponse.ok) {
                    const gameData = await gameResponse.json();
                    setGameData(gameData);
                    console.log("Updated Game Data: ", gameData);

                    const newLogEntries = gameData.players.map(player => {
                        return `${player.playerName} moved to ${player.location}`;
                    });
                    setMoveLog(newLogEntries);

                    if (isGameOver(gameData, nextLocation)) {
                        Alert.alert("GAME OVER!", "The fugitive has been caught");
                    }

                } else {
                    console.log("OOPSIE!")
                }
            } else {
                const errorData = await response.json();
                console.error("Move Failed:", response.status, errorData);
                Alert.alert("Move Failed", errorData.message || "Failed to submit move.");
            }
        } catch (error) {
            console.error("Error submitting move:", error);
            Alert.alert("Error", "Wrong transport mode used");
        }
    
        setNextLocation('');
        setTransportMode('');
        pollGameState();
    };


    return (
        <View style={styles.container}>
            {/* Left-side White Container with Scrollable Buttons */}
            <View style={styles.leftContainer}>
                <View>
                    <Text style={styles.currentLocationText}>Your Current Location: {startLocation !== null ? startLocation : 'Loading...'}</Text>
                </View>
                <ScrollView contentContainerStyle={styles.buttonList}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputText}>Enter your next location:</Text>

                        <TextInput
                            style={styles.input}
                            value={nextLocation}
                            onChangeText={setNextLocation}
                            placeholder='Eg: 2'
                            placeholderTextColor="gray"
                        />
                    </View>

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

                    <TouchableOpacity style={styles.submitButton} onPress={handlePlayerMove} disabled={gameData && gameData.state !== "Fugitive"}>
                        <Text style={styles.submitButtonText}>Move</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Centered Full Map */}
            <View style={styles.mapContainer}>
                <Image
                    style={styles.mapImage}
                    source={{ uri: mapImage }}
                    resizeMode="contain"
                />
            </View>

            {/* Right-side Container with Movement Log */}
            <View style={styles.rightContainer}>
                <Text style={styles.movementLogTitle}>Move Log</Text>

                <ScrollView>
                    {moveLog.map((movement, index) => {
                        return (
                            <Text key={index} style={styles.moveLogText}>
                                {movement}
                            </Text>
                        );
                    })}
                </ScrollView>

                {/* Modal for "How to Play" */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={howToPlayVisible}
                    onRequestClose={() => setHowToPlayVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>

                            <Text style={styles.modalTitle}>How to Play</Text>

                            <Text style={styles.modalSubTitle}>Gameplay:</Text>
                            
                            <Text style={styles.modalText}>
                                - Players take turns moving across different locations on the map.
                                {'\n'}- Use different transport types (Taxi, Bus, Underground) to move.
                                {'\n'}- The detective team must locate and catch the hidden player.
                            </Text>

                            <Text style={styles.modalSubTitle}>Winning Conditions:</Text>
                            <Text style={styles.modalText}>
                                - The detectives win if they land on the same space as the hidden player.
                                {'\n'}- The hidden player wins if they evade capture for a set number of turns.
                            </Text>

                            <Text style={styles.modalSubTitle}>Tips:</Text>
                            <Text style={styles.modalText}>
                                - Plan your routes strategically to cut off the hidden player's escape.
                                {'\n'}- Keep track of past movements to predict the next move.
                            </Text>

                            <TouchableOpacity style={styles.closeButton} onPress={() => setHowToPlayVisible(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

                {/* Modal for "Settings" */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={settingsVisible}
                    onRequestClose={() => setSettingsVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>

                            <Text style={styles.modalTitle}>Settings</Text>

                            <TouchableOpacity style={styles.button} onPress={() => {}}>
                                <Text style={styles.buttonText}>Sound: ON/OFF</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={() => {}}>
                                <Text style={styles.buttonText}>Vibration: ON/OFF</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeButton} onPress={() => setSettingsVisible(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>


                {/* Bottom Centered Buttons */}
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
        justifyContent: 'center',
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