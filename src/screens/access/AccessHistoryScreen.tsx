import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Spinner,
    HStack,
    VStack,
    ScrollView,
    NativeBaseProvider,
    Box
} from "native-base";
import { API_URL } from "@env";
import customTheme from "../../themes/index";
import { useNavigation } from '@react-navigation/native';

const AccessHistoryScreen = () => {
    const [accessHistory, setAccessHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchAccessHistory(); // Cargar historial de manera inicial
        const intervalId = setInterval(fetchAccessHistory, 5000); // Actualiza cada 5 segundos

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    const fetchAccessHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/access/historial-rfid`);
            const data = await response.json();
            setAccessHistory(data); // Actualiza el historial con los datos más recientes
        } catch (error) {
            console.error("Error fetching access history:", error);
            setError("Error al cargar el historial");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner size="lg" color="primary.500" />;
    if (error) return <Text color="red">{error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <VStack flex={1} p={5}>
                    <Text fontSize="lg" fontWeight="bold" mb={5}>Historial de Accesos</Text>

                    <Box>
                        <Text>Visualización de los accesos detectados por la tarjeta RFID:</Text>
                    </Box>

                    <FlatList
                        data={accessHistory}
                        keyExtractor={(item, index) => index.toString()} // Usa el índice como clave
                        renderItem={({ item }) => (
                            <View bg="white" p={4} mb={4} borderRadius="md" shadow={2}>
                                <HStack alignItems="center" justifyContent="space-between">
                                    <VStack>
                                        <Text fontWeight="bold">Tarjeta RFID: {item.rfid}</Text>
                                        <Text fontSize="sm">Hora: {item.time}</Text>
                                    </VStack>
                                </HStack>
                            </View>
                        )}
                    />
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AccessHistoryScreen;
