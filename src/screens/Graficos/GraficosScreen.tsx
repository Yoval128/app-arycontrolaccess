import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, HStack, Spinner, ScrollView } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '@env'; // Asegúrate de tener correctamente la URL de la API en el archivo .env

const GraficosScreen = () => {
    const [lastUser, setLastUser] = useState(null);
    const [lastMovement, setLastMovement] = useState(null);
    const [totalDocuments, setTotalDocuments] = useState(null);
    const [lastRfidCards, setLastRfidCards] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(`${API_URL}/api/users/last-user`);
                const userData = await userResponse.json();
                if (userResponse.ok) {
                    setLastUser(userData);
                } else {
                    console.error('Error al obtener el último usuario:', userData.error);
                }

                const movementResponse = await fetch(`${API_URL}/api/documentMovements/last-movement`);
                const movementData = await movementResponse.json();
                if (movementResponse.ok) {
                    setLastMovement(movementData);
                } else {
                    console.error('Error al obtener el último movimiento:', movementData.error);
                }

                const documentsResponse = await fetch(`${API_URL}/api/documents/total-documents`);
                const documentsData = await documentsResponse.json();
                if (documentsData.totalDocuments !== undefined) {
                    setTotalDocuments(documentsData.totalDocuments);
                } else {
                    console.error("Error al obtener el total de documentos");
                }

            } catch (error) {
                console.error('Error al hacer la solicitud:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <NativeBaseProvider>
                <Box safeArea p={5} flex={1} justifyContent="center" alignItems="center" bg="coolGray.100">
                    <Spinner size="lg" color="primary.500" />
                </Box>
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <VStack space={4} px={5} py={4}>
                    {/* Información del último usuario */}
                    <Box
                        bg="white"
                        p={5}
                        borderRadius="lg"
                        shadow={3}
                        borderColor="gray.300"
                        borderWidth={1}
                    >
                        <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                            Último usuario registrado:
                        </Text>
                        <Text fontSize="lg" color="gray.700">
                            {lastUser ? `${lastUser.Nombre} ${lastUser.Apellido}` : 'No hay usuarios registrados'}
                        </Text>

                        {lastUser && (
                            <>
                                <HStack alignItems="center" mt={3}>
                                    <MaterialIcons name="email" size={18} color="gray" />
                                    <Text fontSize="md" color="gray.600" ml={2}>
                                        Correo: {lastUser.Correo}
                                    </Text>
                                </HStack>
                                <HStack alignItems="center" mt={2}>
                                    <MaterialIcons name="work" size={18} color="gray" />
                                    <Text fontSize="md" color="gray.600" ml={2}>
                                        Cargo: {lastUser.Cargo}
                                    </Text>
                                </HStack>
                            </>
                        )}
                    </Box>

                    {/* Información del último movimiento */}
                    {lastMovement && (
                        <Box
                            bg="white"
                            p={5}
                            borderRadius="lg"
                            shadow={3}
                            borderColor="gray.300"
                            borderWidth={1}
                        >
                            <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                                Último movimiento:
                            </Text>
                            <Text fontSize="lg" color="gray.700" mt={2}>
                                Usuario: {lastMovement.Nombre_Usuario} {lastMovement.Apellido_Usuario}
                            </Text>
                            <Text fontSize="md" color="gray.600" mt={2}>
                                Documento: {lastMovement.Nombre_Documento}
                            </Text>
                            <Text fontSize="md" color="gray.600" mt={2}>
                                Fecha y hora de salida: {new Date(lastMovement.Fecha_Hora_Salida).toLocaleString()}
                            </Text>
                            <Text fontSize="md" color="gray.600" mt={2}>
                                Estado: {lastMovement.Estado}
                            </Text>
                        </Box>
                    )}

                    {totalDocuments && (
                        <Box
                            bg="white"
                            p={5}
                            borderRadius="lg"
                            shadow={3}
                            borderColor="gray.300"
                            borderWidth={1}
                        >
                            <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                                Total de Documentos:
                            </Text>
                            <Text fontSize="lg" color="gray.700" mt={2}>
                                Total de Documentos: {totalDocuments}
                            </Text>
                        </Box>
                    )}
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default GraficosScreen;
