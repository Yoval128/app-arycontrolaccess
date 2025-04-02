import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, HStack, Spinner, ScrollView, useColorModeValue } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '@env';

const GraficosScreen = () => {
    const [data, setData] = useState({
        lastUser: null,
        lastMovement: null,
        totalDocuments: 0,
        lastRFIDCard: null,
    });
    const [loading, setLoading] = useState(true);

    // Colores adaptables al tema
    const bgColor = useColorModeValue("coolGray.100", "coolGray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
    const cardBorderColor = useColorModeValue("gray.300", "gray.700");
    const iconColor = useColorModeValue("#007bff", "#60a5fa");
    const titleColor = useColorModeValue("primary.600", "primary.300");
    const spinnerColor = useColorModeValue("primary.500", "primary.300");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    fetch(`${API_URL}/api/users/last-user`).then(res => res.json()),
                    fetch(`${API_URL}/api/documentMovements/last-movement`).then(res => res.json()),
                    fetch(`${API_URL}/api/documents/total-documents`).then(res => res.json()),
                    fetch(`${API_URL}/api/rfidCards/last-rfidCard`).then(res => res.json())
                ]);

                setData({
                    lastUser: responses[0] || null,
                    lastMovement: responses[1] || null,
                    totalDocuments: responses[2]?.totalDocuments ?? 0,
                    lastRFIDCard: responses[3] || null,
                });
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
                <Box flex={1} justifyContent="center" alignItems="center" bg={bgColor}>
                    <Spinner size="lg" color={spinnerColor} />
                </Box>
            </NativeBaseProvider>
        );
    }

    const Card = ({ icon, title, children }) => (
        <Box bg={cardBg} p={5} borderRadius="lg" shadow={3} borderWidth={1} borderColor={cardBorderColor}>
            <HStack alignItems="center" space={3} mb={2}>
                <MaterialIcons name={icon} size={24} color={iconColor} />
                <Text fontSize="xl" fontWeight="bold" color={titleColor}>{title}</Text>
            </HStack>
            {children}
        </Box>
    );

    return (
        <NativeBaseProvider>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} bg={bgColor}>
                <VStack space={4}>
                    {/* Último usuario registrado */}
                    <Card icon="person" title="Último usuario registrado">
                        <Text fontSize="lg" color={textColor}>
                            {data.lastUser ? `${data.lastUser.Nombre} ${data.lastUser.Apellido}` : 'No hay usuarios registrados'}
                        </Text>
                        {data.lastUser && (
                            <>
                                <HStack alignItems="center" mt={3}>
                                    <MaterialIcons name="email" size={18} color={secondaryTextColor} />
                                    <Text fontSize="md" color={secondaryTextColor} ml={2}>{data.lastUser.Correo}</Text>
                                </HStack>
                                <HStack alignItems="center" mt={2}>
                                    <MaterialIcons name="work" size={18} color={secondaryTextColor} />
                                    <Text fontSize="md" color={secondaryTextColor} ml={2}>{data.lastUser.Cargo}</Text>
                                </HStack>
                            </>
                        )}
                    </Card>

                    {/* Último movimiento */}
                    {data.lastMovement && (
                        <Card icon="history" title="Último movimiento">
                            <Text fontSize="md" color={textColor}>
                                Usuario: {data.lastMovement.Nombre_Usuario} {data.lastMovement.Apellido_Usuario}
                            </Text>
                            <Text fontSize="md" color={secondaryTextColor} mt={2}>Documento: {data.lastMovement.Nombre_Documento}</Text>
                            <Text fontSize="md" color={secondaryTextColor} mt={2}>Fecha: {new Date(data.lastMovement.Fecha_Hora_Salida).toLocaleString()}</Text>
                            <Text fontSize="md" color={secondaryTextColor} mt={2}>Estado: {data.lastMovement.Estado}</Text>
                        </Card>
                    )}

                    {/* Total de documentos */}
                    <Card icon="folder" title="Total de Documentos">
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>{data.totalDocuments}</Text>
                    </Card>

                    {/* Última tarjeta RFID */}
                    {data.lastRFIDCard ? (
                        <Card icon="credit-card" title="Última Tarjeta RFID">
                            <Text fontSize="md" color={textColor}>Código: {data.lastRFIDCard.Codigo_RFID}</Text>
                            <Text fontSize="md" color={secondaryTextColor} mt={2}>Estado: {data.lastRFIDCard.Estado_Tarjeta}</Text>
                            {data.lastRFIDCard.Usuario_Asignado ? (
                                <>
                                    <Text fontSize="md" color={secondaryTextColor} mt={2}>Asignado a: {data.lastRFIDCard.Usuario_Asignado.Nombre_Completo}</Text>
                                    <Text fontSize="md" color={secondaryTextColor}>Cargo: {data.lastRFIDCard.Usuario_Asignado.Cargo}</Text>
                                    <Text fontSize="md" color={secondaryTextColor}>Correo: {data.lastRFIDCard.Usuario_Asignado.Correo}</Text>
                                </>
                            ) : (
                                <Text fontSize="md" color="red.500" fontWeight="bold">No asignada</Text>
                            )}
                        </Card>
                    ) : (
                        <Text fontSize="md" color={secondaryTextColor} textAlign="center">No hay información de la última tarjeta RFID.</Text>
                    )}
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default GraficosScreen;