import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

    export default function GameScreen() {
        const { gameId } = useLocalSearchParams();

        const mapImage = "http://trinity-developments.co.uk/images/Horsforth_Game_Map.png";
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Game ID: {gameId}</Text>
                <Image
                    source={{ uri: mapImage }}
                    style={styles.mapImage}
                    resizeMode='center'
                />

                {/* GAME LOGIC */}
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
        },
        text: {
            color: '#fff',
            fontSize: 20,
            marginBottom: 20
        },
        mapImage: {
            width: 580,
        }
    });