import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GameScreen() {
    const { gameId } = useLocalSearchParams();
    const mapImage = "http://trinity-developments.co.uk/images/Horsforth_Game_Map.png";

    // Movement Log Entries
    const movementLog = Array.from({ length: 10 }, (_, i) => `Movement ${i + 1}`);

    return (
        <View style={styles.container}>
            {/* Sticky Header */}
            <Text style={styles.headerText}>Detective Screen</Text>

            {/* Left-side White Container with Scrollable Buttons */}
            <View style={styles.leftContainer}>
                <ScrollView contentContainerStyle={styles.buttonList}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 6</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 9</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Button 10</Text>
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

            {/* Right-side Container with X Movement Log */}
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
                <TouchableOpacity style={styles.bottomButton}>
                    <Text style={styles.bottomButtonText}>How to Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton}>
                    <Text style={styles.bottomButtonText}>Settings</Text>
                </TouchableOpacity>
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
        justifyContent: 'flex-start', // Stack items from top to bottom
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
});
