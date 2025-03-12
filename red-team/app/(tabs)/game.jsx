import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
    Modal,
    ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useForceLandscape from '@/hooks/useForceLandscape';

// Static ticket types (could be pulled from config later)
const TICKETS = ['Taxi', 'Bus', 'Underground'];

export default function GameScreen() {
    useForceLandscape(); // Force landscape orientation for better map display

    const router = useRouter();
    const { gameId, playerId, role } = useLocalSearchParams(); // Params passed to the route

    // State variables
    const [gameData, setGameData] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isTabOpen, setIsTabOpen] = useState(false);
    const [slideAnim] = useState(new Animated.Value(-200)); // Controls side tab sliding

    const mapImage = 'http://trinity-developments.co.uk/images/Horsforth_Game_Map.png';

    /**
     * Fetch game data from API when component mounts or gameId changes
     */
    const fetchGameData = useCallback(async () => {
        try {
            const response = await fetch(`http://trinity-developments.co.uk/games/${gameId}`);
            const data = await response.json();
            setGameData(data);
        } catch (error) {
            console.error('Failed to fetch game data:', error);
        }
    }, [gameId]);

    useEffect(() => {
        fetchGameData();
        // Optional: Setup polling here for real-time updates
    }, [fetchGameData]);

    /**
     * Toggle the Move History tab open/close
     */
    const toggleTab = () => {
        Animated.timing(slideAnim, {
            toValue: isTabOpen ? -200 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsTabOpen(!isTabOpen);
    };

    /**
     * Handle quitting the game and navigating home
     */
    const handleQuit = () => {
        // Optional: Confirm before quitting
        router.push('/');
    };

    /**
     * Handle player selecting a ticket to move
     */
    const handleTicketPress = (ticket) => {
        console.log(`Ticket selected: ${ticket}`);
        // TODO: Implement player move logic here
    };

    /**
     * If data isn't loaded yet, show loading state
     */
    if (!gameData) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading Game...</Text>
            </View>
        );
    }

    // Destructure useful data from the gameData
    const { playerPosition, possibleMoves, detectives, mrXLog, lastKnownPosition } = gameData;

    return (
        <View style={styles.container}>
            {/* ========================= Map Display ========================= */}
            <View style={styles.map}>
                <Image source={{ uri: mapImage }} style={styles.mapImage} resizeMode="contain" />
            </View>

            {/* ========================= Left Sidebar ========================= */}
            <View style={styles.leftSidebar}>
                <Text style={styles.sidebarTitle}>
                    {role === 'mrX' ? 'Current Position' : 'Your Position'}
                </Text>
                <Text style={styles.positionText}>{playerPosition}</Text>

                <Text style={styles.sidebarTitle}>Available Moves</Text>
                <ScrollView style={styles.moveList}>
                    {possibleMoves.map((move, index) => (
                        <View key={index} style={styles.moveItem}>
                            <Text style={styles.moveText}>
                                To {move.destination} ({move.transport})
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* ========================= Right Sidebar ========================= */}
            <View style={styles.rightSidebar}>
                {/* Settings Button */}
                <TouchableOpacity style={styles.settingsIcon} onPress={() => setIsSettingsOpen(true)}>
                    <Text style={styles.settingsText}>⚙️</Text>
                </TouchableOpacity>

                {/* Role-Specific Info */}
                {role === 'mrX' ? (
                    <>
                        <Text style={styles.sidebarTitle}>Detective Positions</Text>
                        <ScrollView style={styles.moveList}>
                            {detectives.map((det, index) => (
                                <View key={index} style={styles.moveItem}>
                                    <Text style={styles.moveText}>
                                        {det.name}: {det.position}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </>
                ) : (
                    <>
                        <Text style={styles.sidebarTitle}>Mr. X Last Known</Text>
                        <Text style={styles.positionText}>
                            {lastKnownPosition || 'Unknown'}
                        </Text>

                        <Text style={styles.sidebarTitle}>Mr. X Movement Log</Text>
                        <ScrollView style={styles.moveList}>
                            {mrXLog.map((log, index) => (
                                <View key={index} style={styles.moveItem}>
                                    <Text style={styles.moveText}>
                                        Round {log.round}: {log.transport}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </>
                )}
            </View>

            {/* ========================= Moves History Side Tab ========================= */}
            <Animated.View style={[styles.sideTab, { left: slideAnim }]}>
                <Text style={styles.tabText}>Move History (Coming Soon)</Text>
            </Animated.View>

            {/* ========================= Top Bar Controls ========================= */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.topButton} onPress={toggleTab}>
                    <Text style={styles.topButtonText}>{isTabOpen ? 'Close Moves' : 'Moves'}</Text>
                </TouchableOpacity>
            </View>

            {/* ========================= Player Tickets ========================= */}
            <View style={styles.infoCard}>
                <View style={styles.ticketsContainer}>
                    {TICKETS.map((ticket, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.ticket}
                            onPress={() => handleTicketPress(ticket)}
                        >
                            <Text style={styles.ticketText}>{ticket}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* ========================= Settings Modal ========================= */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={isSettingsOpen}
                onRequestClose={() => setIsSettingsOpen(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.settingsContainer}>
                        <Text style={styles.settingsTitle}>Settings</Text>

                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => alert('Help Selected')}
                        >
                            <Text style={styles.buttonText}>Help</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingsButton} onPress={handleQuit}>
                            <Text style={styles.buttonText}>Quit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsSettingsOpen(false)}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}