import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GameScreen() {
    const { gameId } = useLocalSearchParams();
    const mapImage = "http://trinity-developments.co.uk/images/Horsforth_Game_Map.png";

    // Movement Log Entries
    const movementLog = Array.from({ length: 10 }, (_, i) => `Movement ${i + 1}`);

    // State for Modals
    const [howToPlayVisible, setHowToPlayVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);

    return (
        <View style={styles.container}>
            {/* Sticky Header */}
            <Text style={styles.headerText}>Detective Screen</Text>

            {/* Left-side White Container with Scrollable Buttons */}
            <View style={styles.leftContainer}>
                <ScrollView contentContainerStyle={styles.buttonList}>
                    {Array.from({ length: 10 }, (_, i) => (
                        <TouchableOpacity key={i} style={styles.button}>
                            <Text style={styles.buttonText}>Button {i + 1}</Text>
                        </TouchableOpacity>
                    ))}
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
                <Text style={styles.movementLogTitle}>X Movement Log</Text>
                {movementLog.map((movement, index) => (
                    <Text key={index} style={styles.movementLogText}>
                        {movement}
                    </Text>
                ))}
            </View>

            {/* Bottom Centered Buttons */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.bottomButton} onPress={() => setHowToPlayVisible(true)}>
                    <Text style={styles.bottomButtonText}>How to Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => setSettingsVisible(true)}>
                    <Text style={styles.bottomButtonText}>Settings</Text>
                </TouchableOpacity>
            </View>

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
    movementLogText: {
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
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    bottomButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    bottomButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
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
});
