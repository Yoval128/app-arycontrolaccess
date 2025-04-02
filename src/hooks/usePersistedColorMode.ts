// hooks/usePersistedColorMode.ts
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorMode } from "native-base";

const COLOR_MODE_KEY = "color-mode";

const usePersistedColorMode = () => {
    const { colorMode, setColorMode } = useColorMode();

    // Cargar el colorMode guardado cuando se inicia la app
    useEffect(() => {
        const loadColorMode = async () => {
            try {
                const savedMode = await AsyncStorage.getItem(COLOR_MODE_KEY);
                if (savedMode) {
                    setColorMode(savedMode);
                }
            } catch (error) {
                console.error("Error loading color mode:", error);
            }
        };
        loadColorMode();
    }, [setColorMode]);

    // Guardar el colorMode cada vez que cambia
    useEffect(() => {
        const saveColorMode = async () => {
            try {
                await AsyncStorage.setItem(COLOR_MODE_KEY, colorMode);
            } catch (error) {
                console.error("Error saving color mode:", error);
            }
        };
        saveColorMode();
    }, [colorMode]);

    return { colorMode, setColorMode }; // Retornamos los valores para poder usarlos si es necesario
};

export default usePersistedColorMode;