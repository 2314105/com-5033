import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

    export default function GameScreen() {
        const { gameId } = useLocalSearchParams();
        const mapImage = "http://trinity-developments.co.uk/images/Horsforth_Game_Map.png";
        
        return (
            <View style={styles.container}>
                <Image 
                    style={styles.mapImage}
                    source={{ uri: mapImage}}
                    resizeMode='contain'
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
            width: '90%',
            height: '90%'
        }
    });