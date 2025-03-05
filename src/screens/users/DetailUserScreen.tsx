import React, { useEffect, useState } from "react";
import { View, Text, NativeBaseProvider, Box, VStack, HStack, Avatar, Spinner, IconButton, Divider } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import customTheme from "../../themes/index";
import { API_URL } from "@env";

const DetailUserScreen = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { usuario_id } = route.params;

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/user/${usuario_id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del usuario');
            }
            const data = await response.json();
            setUser(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner size="lg" color="primary.500" />;
    if (error) return <Text color="red.500">Error: {error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea p={5} bg="background.light" flex={1}>
                <HStack alignItems="center" mb={4}>
                    <Ionicons name="person-outline" size={28} color="#003469" />
                    <Text fontSize="xl" fontWeight="bold" ml={2} color="primary.500">
                        Detalles del Usuario
                    </Text>
                </HStack>

                <Box bg="white" p={5} borderRadius="lg" shadow={2}>
                    <HStack space={4} alignItems="center">
                        <Avatar bg="primary.400" size="xl">{user?.Nombre[0]}</Avatar>
                        <VStack>
                            <Text fontSize="lg" fontWeight="bold">{user?.Nombre} {user?.Apellido}</Text>
                            <Text fontSize="md" color="gray.500">{user?.Cargo}</Text>
                            <Text fontSize="sm" color="gray.400">{user?.Correo}</Text>
                        </VStack>
                    </HStack>
                    <Divider my={3} />
                    <VStack space={3}>
                        <HStack space={2} alignItems="center">
                            <Ionicons name="call-outline" size={20} color="#0074E8" />
                            <Text fontSize="md">{user?.Telefono || "No disponible"}</Text>
                        </HStack>
                        <HStack space={2} alignItems="center">
                            <Ionicons name="card-outline" size={20} color="#0074E8" />
                            <Text fontSize="md">ID Tarjeta: {user?.ID_Tarjeta_RFID || "No asignado"}</Text>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default DetailUserScreen;
