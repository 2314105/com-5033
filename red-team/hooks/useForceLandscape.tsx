import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function useForceLandscape() {
    useEffect(() => {
        // Lock screen orientation to landscape mode
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };

        lockOrientation();

        return () => {
            // Unlock orientation when leaving the screen if needed
            ScreenOrientation.unlockAsync();
        };
    }, []);
}