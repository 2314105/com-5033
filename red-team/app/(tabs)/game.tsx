import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import { useRouter } from 'expo-router';

export default function GameScreen() {
    const router = useRouter();
    const [isTabOpen, setIsTabOpen] = useState(false);
    const slideAnim = new Animated.Value(isTabOpen ? 0 : -200);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Toggle side tab animation
    const toggleTab = () => {
        Animated.timing(slideAnim, {
            toValue: isTabOpen ? -200 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsTabOpen(!isTabOpen);
    };

    // Function to Quit: Close Settings First, Then Navigate
    const handleQuit = () => {
        setIsSettingsOpen(false);
        setTimeout(() => {
            router.push('/');
        }, 300); // Delay navigation slightly to allow modal close animation
    };

    return (
        <View style={styles.container}>
            {/* Full-Screen Map Placeholder (Green Background for Now) */}
            <View style={styles.map} />

            {/* Side Tab */}
            <Animated.View style={[styles.sideTab, { left: slideAnim }]}>
                <Text style={styles.tabText}>Moves from X (Coming Soon)</Text>
            </Animated.View>

            {/* Tab Toggle Button */}
            <TouchableOpacity style={styles.toggleButton} onPress={toggleTab}>
                <Text style={styles.buttonText}>{isTabOpen ? 'Close' : 'Open'} Moves</Text>
            </TouchableOpacity>

            {/* Settings Button (Top Right) */}
            <TouchableOpacity style={styles.settingsButton} onPress={() => setIsSettingsOpen(true)}>
                <Text style={styles.settingsText}>⚙️</Text>
            </TouchableOpacity>

            {/* Settings Modal */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={isSettingsOpen}
                onRequestClose={() => setIsSettingsOpen(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.settingsContainer}>
                        <Text style={styles.settingsTitle}>Settings</Text>

                        <TouchableOpacity style={styles.optionButton} onPress={() => alert('Help Selected')}>
                            <Text style={styles.optionText}>Help</Text>
                        </TouchableOpacity>

                        {/* Quit Button (Now Closes Modal Before Navigating) */}
                        <TouchableOpacity style={styles.optionButton} onPress={handleQuit}>
                            <Text style={styles.optionText}>Quit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setIsSettingsOpen(false)}>
                            <Text style={styles.optionText}>Close</Text>
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
        backgroundColor: 'green', // Placeholder for map
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
    toggleButton: {
        position: 'absolute',
        top: 50,
        left: 10,
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingsButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 50,
    },
    settingsText: {
        fontSize: 24,
        color: 'white',
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
    optionButton: {
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
    optionText: {
        color: 'white',
        fontSize: 16,
    },
});