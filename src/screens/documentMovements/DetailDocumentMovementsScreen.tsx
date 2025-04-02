import React, {useEffect, useState} from "react";
import {View, Text, NativeBaseProvider, Box, VStack, HStack, Spinner, IconButton, Divider, Badge} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";

const DetailDocumentMovementsScreen = () => {
    const [movement, setMovement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const {movement_id} = route.params; // Obtener el ID del movimiento desde los parámetros

    useEffect(() => {
        fetchMovementDetails();
    }, []);

    // Función para obtener los detalles del movimiento
    const fetchMovementDetails = async () => {
        console.log("Movement ID:", movement_id);
        try {
            const response = await fetch(`${API_URL}/api/documentMovements/movement/${movement_id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del movimiento');
            }
            const data = await response.json();
            setMovement(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Si está cargando, mostramos un Spinner
    if (loading) return <Spinner size="lg" color="primary.500"/>;
    // Si hay un error, mostramos un mensaje de error
    if (error) return <Text color="red.500">Error: {error}</Text>;

    // Función para formatear la fecha
    const formatDate = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleDateString(); // Muestra solo la fecha
    };

    // Función para formatear la hora en formato 12 horas con AM/PM
    const formatTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});
    };


    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea p={5} bg="background.light" flex={1}>
                <HStack alignItems="center" mb={4} bg="primary.500" p={4} borderRadius="md" shadow={3}
                        justifyContent="center">
                    <Ionicons name="document-text-outline" size={28} color="white"/>
                    <Text fontSize="xl" fontWeight="bold" ml={2} color="white">
                        Detalles del Movimiento de Documento
                    </Text>
                </HStack>

                <Box bg="white" p={5} borderRadius="lg" shadow={2}>
                    <VStack space={4}>
                        <HStack space={2} alignItems="center">
                            <Ionicons name="barcode-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md" fontWeight="bold">Realizado por: {movement?.Nombre_Usuario} {movement?.Apellido_Usuario}</Text>
                        </HStack>

                        <HStack space={2} alignItems="center">
                            <Ionicons name="document-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md">Documento: {movement?.Nombre_Documento} </Text>
                        </HStack>

                        <HStack space={2} alignItems="center">
                            <Ionicons name="calendar-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md">Fecha: {formatDate(movement?.Fecha_Hora_Salida)}</Text>
                        </HStack>

                        <HStack space={2} alignItems="center">
                            <Ionicons name="time-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md">Hora: {formatTime(movement?.Fecha_Hora_Entrada)}</Text>
                        </HStack>

                        <HStack space={2} alignItems="center">
                            <Ionicons name="shield-checkmark-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md">Estado: </Text>
                            <Badge colorScheme={movement?.Estado === "Completado" ? "success" : "warning"}>
                                {movement?.Estado}
                            </Badge>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default DetailDocumentMovementsScreen;
