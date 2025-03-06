import { useState, useRef } from 'react';
import { Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Handling game screen logic.
 */
export const useGame = () => {
    const router = useRouter();

    // State for settings modal
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Sidebar animation
    const [isTabOpen, setIsTabOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-200)).current; // Start hidden

    // Toggle side tab animation
    const toggleTab = () => {
        Animated.timing(slideAnim, {
            toValue: isTabOpen ? -200 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsTabOpen(!isTabOpen);
    };

    // Handle quitting game
    const handleQuit = () => {
        setIsSettingsOpen(false);
        setTimeout(() => {
            router.push('/');
        }, 300);
    };

    // Handle ticket press (player move)
    const handleTicketPress = (ticketType) => {
        Alert.alert(`Moving using ${ticketType}`);
    };

    return {
        isSettingsOpen,
        setIsSettingsOpen,
        errorMessage,
        setErrorMessage,
        isTabOpen,
        toggleTab,
        slideAnim,
        handleQuit,
        handleTicketPress,
    };
};