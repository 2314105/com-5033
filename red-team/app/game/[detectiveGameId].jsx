import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 

export default function GameScreen() {
    const { gameId } = useLocalSearchParams();
    const mapImage = "http://trinity-developments.co.uk/images/Horsforth_Game_Map.png";

    return (
        <View style={styles.container}>
            {/* Sticky Header */}
            <Text style={styles.headerText}>Detective Screen</Text>
            
            {/* Left-side White Container with Scrollable Buttons */}
            <View style={styles.leftContainer}>
                <ScrollView contentContainerStyle={styles.buttonList}>
                    {/* Example buttons */}
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
                    {/* Add more buttons as needed */}
                </ScrollView>
            </View>

            {/* Full-Screen Map */}
            <Image
                style={styles.mapImage}
                source={{ uri: mapImage }}
                resizeMode='contain'
            />   

            
            {/* Right-side Container with X Movement Log */}
            <View style={styles.rightContainer}>
                <Text style={styles.movementLogText}>X Movement Log</Text>
                {/* You can add movement log details here */}
            </View>
            
            {/* GAME LOGIC */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        flexDirection: 'row', // Place the left, right containers and map side by side
    },
    text: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 20
    },
    mapImage: {
        width: '75%', // Adjust width to leave space for the left container
        height: '100%',
    },
    headerText: {
        position: 'absolute', // Make the header fixed at the top
        top: 0,
        left: 0,
        right: 0,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
        paddingTop: 20, // Adjust top padding to make space from the top of the screen
        zIndex: 10, // Ensure it stays on top of other content
    },
    leftContainer: {
        backgroundColor: 'white',
        width: '12%', // Adjust width as needed for your design
        padding: 10,
        justifyContent: 'flex-start',
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
        position: 'absolute',  // Make the container fixed
        top: 0,                // Stick to the top
        right: 0,              // Stick to the right side
        backgroundColor: 'white',
        width: '12%',          // Adjust the width as needed
        padding: 10,
        justifyContent: 'flex-start',
        height: '100%',        // Take the full height of the screen
    },
    movementLogText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
    },
});
