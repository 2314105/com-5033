import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

    export default function GameScreen() {
        const { gameId } = useLocalSearchParams();
        const mapImage = "http://trinity-developments.co.uk/images/Horsforth_Game_Map.png";
        
        return (
            <View style={styles.container}>
                {/* Red Text at the Top */}
                <Text style={styles.headerText}>X Screen</Text>
                
                <Image 
                    style={styles.mapImage}
                    source={{ uri: mapImage}}
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
            width: '100%',
            height: '100%',
        },
        headerText: {
            fontSize: 24,       // You can adjust the size to fit your design
            fontWeight: 'bold',
            color: 'red',       // Red text
            textAlign: 'center',
            marginTop: 20,      // Add some space from the top of the screen
        },
    });