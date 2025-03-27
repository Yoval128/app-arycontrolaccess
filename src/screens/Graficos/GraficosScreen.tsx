import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, HStack, Heading, Spinner, ScrollView } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GraficosScreen = () => {
    const [lastUser, setLastUser] = useState(null);
    const [lastMovement, setLastMovement] = useState(null);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [lastRFID, setLastRFID] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            // Obtener token de AsyncStorage si es necesario
            const token = await AsyncStorage.getItem('userToken');

            // Hacer todas las peticiones necesarias
            const [userResponse] = await Promise.all([
                fetch(`${API_URL}/api/users/last-user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }),
                // Aquí deberías agregar las otras llamadas para lastMovement, totalDocuments y lastRFID
                // fetch(...),
                // fetch(...),
                // fetch(...)
            ]);

            // Procesar respuesta del último usuario
            if (userResponse.ok) {
                const userData = await userResponse.json();
                setLastUser(userData);
            } else {
                console.error('Error al obtener último usuario:', userResponse.status);
            }

            // Aquí procesarías las otras respuestas...

            setLoading(false);
        } catch (error) {
            console.error('Error al obtener datos:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box safeArea p={5} bg="background.light" flex={1} justifyContent="center" alignItems="center">
                    <Spinner size="lg" />
                </Box>
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <HStack alignItems="center" mb={6} bg="primary.500" p={4} borderRadius="md" shadow={3} justifyContent="center">
                        <Ionicons name="stats-chart" size={25} color="white" />
                        <Text fontSize="2xl" fontWeight="bold" ml={3} color="white">
                            Estadisticas
                        </Text>
                    </HStack>

                    <VStack space={4}>
                        <Box bg="white" p={4} borderRadius="md" shadow={2}>
                            <Text fontSize="lg" fontWeight="bold">Último usuario registrado:</Text>
                            <Text>{lastUser ? `${lastUser.Nombre} ${lastUser.Apellido}` : 'No hay usuarios registrados'}</Text>
                        </Box>

                        <Box bg="white" p={4} borderRadius="md" shadow={2}>
                            <Text fontSize="lg" fontWeight="bold">Último movimiento registrado:</Text>
                            <Text>{lastMovement ? `Movimiento: ${lastMovement.tipo_movimiento} - Documento: ${lastMovement.documento_id}` : 'No hay movimientos registrados'}</Text>
                        </Box>

                        <Box bg="white" p={4} borderRadius="md" shadow={2}>
                            <Text fontSize="lg" fontWeight="bold">Total de documentos:</Text>
                            <Text>{totalDocuments}</Text>
                        </Box>

                        <Box bg="white" p={4} borderRadius="md" shadow={2}>
                            <Text fontSize="lg" fontWeight="bold">Último registro de tarjeta RFID:</Text>
                            <Text>{lastRFID ? `Tarjeta: ${lastRFID.numero_tarjeta} - Asignada a: ${lastRFID.usuario_id}` : 'No hay tarjetas registradas'}</Text>
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default GraficosScreen;