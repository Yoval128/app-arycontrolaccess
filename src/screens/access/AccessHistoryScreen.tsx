import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Spinner,
    HStack,
    VStack,
    NativeBaseProvider,
    Box,
    Heading,
    Center,
    useToast,
    Button,
    Icon
} from "native-base";
import { API_URL } from "@env";
import customTheme from "../../themes/index";
import { useFocusEffect } from '@react-navigation/native';
import {Ionicons, MaterialIcons} from "@expo/vector-icons";

const AccessHistoryScreen = () => {
    const [accessHistory, setAccessHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();

    // Función para cargar el historial
    const fetchAccessHistory = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`${API_URL}/api/access/list-access-detailed`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAccessHistory(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching access history:", error);
            setError("Error al cargar el historial");

            toast.show({
                title: "Error",
                description: "No se pudo cargar el historial de accesos",
                status: "error",
                placement: "top"
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Cargar datos cuando el componente recibe foco
    useFocusEffect(
        useCallback(() => {
            fetchAccessHistory();
        }, [fetchAccessHistory])
    );

    // Función para formatear la fecha
    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateTimeString).toLocaleDateString('es-ES', options);
    };

    // Componente de lista vacía
    const EmptyListComponent = () => (
        <Center flex={1} py={10}>
            <Icon as={MaterialIcons} name="history" size={12} color="gray.400" mb={2} />
            <Text color="gray.500" fontSize="lg">No hay registros de acceso</Text>
            <Button
                mt={4}
                onPress={fetchAccessHistory}
                leftIcon={<Icon as={MaterialIcons} name="refresh" />}
                isLoading={refreshing}
            >
                Recargar
            </Button>
        </Center>
    );

    // Componente de carga
    if (loading) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Center flex={1}>
                    <Spinner size="lg" color="primary.500" />
                    <Text mt={2}>Cargando historial...</Text>
                </Center>
            </NativeBaseProvider>
        );
    }

    // Componente de error
    if (error) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Center flex={1} px={5}>
                    <Icon as={MaterialIcons} name="error" size={12} color="red.500" mb={2} />
                    <Text color="red.500" fontSize="lg" textAlign="center">{error}</Text>
                    <Button
                        mt={4}
                        onPress={fetchAccessHistory}
                        leftIcon={<Icon as={MaterialIcons} name="refresh" />}
                    >
                        Reintentar
                    </Button>
                </Center>
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} bg="gray.50" safeArea >
                <VStack px={4} pt={4} space={4}  >
                    <Heading size="lg" color="white" padding="2" bg="primary.500" p={4} borderRadius="md" shadow={3}
                             justifyContent="center" textAlign="center" >Historial de Accesos</Heading>
                    <Text color="gray.600">
                        Registros de accesos detectados mediante tarjetas RFID
                    </Text>
                </VStack>

                <FlatList
                    data={accessHistory}
                    keyExtractor={(item) => item.ID_Acceso.toString()}
                    contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 4 }}
                    ListEmptyComponent={<EmptyListComponent />}
                    refreshing={refreshing}
                    onRefresh={fetchAccessHistory}
                    renderItem={({ item }) => (
                        <Box
                            bg="white"
                            p={4}
                            mb={3}
                            borderRadius="md"
                            shadow={1}
                            borderLeftWidth={4}
                            borderLeftColor={item.Tipo_Acceso === 'Ingreso' ? 'green.500' : 'red.500'}
                        >
                            <VStack space={2}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text fontWeight="bold" fontSize="lg">
                                        {item.Nombre} {item.Apellido}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        {formatDateTime(item.Fecha_Hora)}
                                    </Text>
                                </HStack>

                                <Text fontSize="sm" color="gray.600">
                                    <Text fontWeight="semibold">Cargo:</Text> {item.Cargo}
                                </Text>

                                <Text fontSize="sm" color="gray.600">
                                    <Text fontWeight="semibold">Tarjeta RFID:</Text> {item.Codigo_RFID}
                                </Text>

                                <HStack justifyContent="space-between" mt={2}>
                                    <Box
                                        px={2}
                                        py={1}
                                        bg={item.Tipo_Acceso === 'Ingreso' ? 'green.100' : 'red.100'}
                                        borderRadius="full"
                                    >
                                        <Text
                                            color={item.Tipo_Acceso === 'Ingreso' ? 'green.800' : 'red.800'}
                                            fontSize="xs"
                                            fontWeight="bold"
                                        >
                                            {item.Tipo_Acceso.toUpperCase()}
                                        </Text>
                                    </Box>
                                    <Text fontSize="sm" color="gray.600">
                                        <Text fontWeight="semibold">Ubicación:</Text> {item.Ubicacion}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    )}
                />
            </Box>
        </NativeBaseProvider>
    );
};

export default AccessHistoryScreen;