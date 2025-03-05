import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Spinner,
    Divider,
    IconButton,
    ScrollView
} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from "@react-navigation/native";
import customTheme from "../../themes/index";
import { API_URL } from "@env";

const DetailAdministratorScreen = () => {
    const [administrator, setAdministrator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { admin_id } = route.params;

    useEffect(() => {
        fetchAdministratorDetails();
    }, []);

    const fetchAdministratorDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/administrators/administrator/${admin_id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del administrador');
            }
            const data = await response.json();
            setAdministrator(data);
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
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                <Box flex={1} p={5} bg="background.light">
                    <HStack alignItems="center" mb={4}>
                        <Ionicons name="person-circle-outline" size={28} color="#003469" />
                        <Text fontSize="xl" fontWeight="bold" ml={2} color="primary.500">
                            Detalles del Administrador
                        </Text>
                    </HStack>

                    <Box bg="white" p={5} borderRadius="lg" shadow={2}>
                        <VStack space={4}>
                            <HStack space={4} alignItems="center">
                                <IconButton icon={<Ionicons name="person" size={20} color="#0074E8" />} />
                                <VStack>
                                    <Text fontSize="md" color="gray.500">{administrator?.ID_Usuario}</Text>
                                      </VStack>
                            </HStack>
                            <Divider my={3} />
                            <VStack space={3}>
                                <HStack space={2} alignItems="center">
                                    <Ionicons name="id-card-outline" size={20} color="#0074E8" />
                                    <Text fontSize="md">ID Administrador: {administrator?.ID_Admin}</Text>
                                </HStack>
                                <HStack space={2} alignItems="center">
                                    <Ionicons name="time-outline" size={20} color="#0074E8" />
                                    <Text fontSize="md">Último acceso: {administrator?.Nivel_Permiso || "No disponible"}</Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default DetailAdministratorScreen;