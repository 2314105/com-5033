import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HowToPlay() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>How to Play</Text>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.ruleTitle}>Objective:</Text>
                <Text style={styles.ruleText}>
                    The goal of the game is to strategically navigate the map and capture or evade opponents.
                </Text>

                <Text style={styles.ruleTitle}>Gameplay:</Text>
                <Text style={styles.ruleText}>
                    - Players take turns moving across different locations on the map.
                    {'\n'}- Use different transport types (Taxi, Bus, Underground) to move.
                    {'\n'}- The detective team must locate and catch the hidden player.
                </Text>

                <Text style={styles.ruleTitle}>Winning Conditions:</Text>
                <Text style={styles.ruleText}>
                    - The detectives win if they land on the same space as the hidden player.
                    {'\n'}- The hidden player wins if they evade capture for a set number of turns.
                </Text>

                <Text style={styles.ruleTitle}>Tips:</Text>
                <Text style={styles.ruleText}>
                    - Plan your routes strategically to cut off the hidden player's escape.
                    {'\n'}- Keep track of past movements to predict the next move.
                </Text>
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
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
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    scrollContainer: {
        width: '100%',
        maxHeight: '70%',
        padding: 10,
    },
    ruleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    ruleText: {
        fontSize: 16,
        color: 'white',
        marginTop: 5,
    },
    backButton: {
        backgroundColor: '#D9534F',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
