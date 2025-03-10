import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Modal } from 'react-native';
import useForceLandscape from '@/hooks/useForceLandscape';
import { useGame } from '@/hooks/useGame';

export default function GameScreen() {
    useForceLandscape();
    const {
        isSettingsOpen, setIsSettingsOpen,
        errorMessage, isTabOpen, toggleTab, slideAnim,
        handleQuit, handleTicketPress
    } = useGame();

    // Example ticket numbers (replace with actual game logic)
    const tickets = { T: 3, B: 2, U: 1, S: 1 };
    const horsforthMapURI = 'http://trinity-developments.co.uk/images/Horsforth_Game_Map.png';

    const GameLogic {
    return (
        <View style={styles.container}>
            {/* Error Message Box */}
            {errorMessage !== '' && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
            )}

            {/* Full-Screen Map */}
            <View style={styles.map}>
                <Image source={{ uri: horsforthMapURI }} style={styles.mapImage} resizeMode='contain' />
            </View>

            {/* Sidebar for Move History */}
            <Animated.View style={[styles.sideTab, { left: slideAnim }]}>
                <Text style={styles.tabText}>X’s Moves (Coming Soon)</Text>
            </Animated.View>

            {/* Top Bar (Moves & Settings) */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.topButton} onPress={toggleTab}>
                    <Text style={styles.topButtonText}>{isTabOpen ? 'Close Moves' : 'Moves'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsSettingsOpen(true)}>
                    <Text style={styles.settingsText}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {/* Player Ticket Selection on the Left Side */}
            <View style={styles.leftSideContainer}>
                <Text style={styles.sideTitle}>Tickets</Text>
                <View style={styles.ticketsContainer}>
                    {Object.entries(tickets).map(([ticket, count]) => (
                        <TouchableOpacity key={ticket} style={styles.ticket} onPress={() => handleTicketPress(ticket)}>
                            <Image 
                                source={require(`../../assets/images/Yellow Ticket.png`)}
                                style={styles.ticketImage} 
                            />
                            <Text style={styles.ticketText}>{ticket}: {count}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>


            {/* Settings Modal */}
            <Modal transparent={true} animationType="fade" visible={isSettingsOpen} onRequestClose={() => setIsSettingsOpen(false)}>
                <View style={styles.overlay}>
                    <View style={styles.settingsContainer}>
                        <Text style={styles.settingsTitle}>Settings</Text>

                        <TouchableOpacity style={styles.settingsButton} onPress={() => alert('Help Selected')}>
                            <Text style={styles.buttonText}>Help</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingsButton} onPress={handleQuit}>
                            <Text style={styles.buttonText}>Quit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setIsSettingsOpen(false)}>
                            <Text style={styles.buttonText}>Close</Text>
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
        backgroundColor: '#282c34',
    },
    map: {
        flex: 1,
    },
    sideTab: {
        position: 'absolute',
        top: 50,
        left: -200,
        width: 200,
        height: '80%',
        backgroundColor: '#444',
        padding: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
    },
    tabText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    topBar: {
        position: 'absolute',
        top: 20,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    topButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingsText: {
        fontSize: 28,
        color: 'white',
    },
    infoCard: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -150 }],
        width: 350,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },

    leftSideContainer: {
        position: 'absolute',
        left: 10,
        top: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        zIndex: 10,
    },
    
    sideTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ticketsContainer: {
        flexDirection: 'column', 
        alignItems: 'center',
    },
    ticket: {
        backgroundColor: '#666',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ticketImage: {
        width: 24,
        height: 24,
        marginRight: 5,
    },
    ticketText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsContainer: {
        width: 250,
        backgroundColor: '#444',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    settingsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    settingsButton: {
        backgroundColor: '#666',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#D9534F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorBox: {
        position: 'absolute',
        top: 10,
        width: '90%',
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    errorText: {
        color: 'white',
        fontSize: 16,
    },
    mapImage: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
});