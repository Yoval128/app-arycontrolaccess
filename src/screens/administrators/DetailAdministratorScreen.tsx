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
    ScrollView,
    Badge
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

    if (loading) return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} justifyContent="center" alignItems="center">
                <Spinner size="lg" color="primary.500" />
            </Box>
        </NativeBaseProvider>
    );

    if (error) return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} justifyContent="center" alignItems="center" p={5}>
                <Text color="red.500" fontSize="lg">Error: {error}</Text>
            </Box>
        </NativeBaseProvider>
    );

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                <Box flex={1} p={5} bg="background.light">
                    <HStack alignItems="center" mb={4}>
                        <IconButton
                            icon={<Ionicons name="arrow-back" size={24} />}
                            onPress={() => navigation.goBack()}
                            mr={2}
                        />
                        <Text fontSize="xl" fontWeight="bold" color="primary.500">
                            Detalles del Administrador
                        </Text>
                    </HStack>

                    <Box bg="white" p={5} borderRadius="lg" shadow={2}>
                        <VStack space={4}>
                            {/* Sección de información principal */}
                            <HStack space={4} alignItems="center">
                                <Ionicons name="person-circle-outline" size={40} color="#0074E8" />
                                <VStack>
                                    <Text fontSize="lg" fontWeight="bold">
                                        {administrator?.Usuario?.Nombre} {administrator?.Usuario?.Apellido}
                                    </Text>
                                    <Badge
                                        colorScheme={administrator?.Usuario?.Estado === 'activo' ? 'green' : 'red'}
                                        alignSelf="flex-start"
                                        mt={1}
                                    >
                                        {administrator?.Usuario?.Estado}
                                    </Badge>
                                </VStack>
                            </HStack>

                            <Divider my={3} />

                            {/* Sección de detalles */}
                            <VStack space={4}>
                                <HStack justifyContent="space-between">
                                    <HStack space={2} alignItems="center">
                                        <Ionicons name="id-card-outline" size={20} color="#0074E8" />
                                        <Text color="gray.500">ID Administrador:</Text>
                                    </HStack>
                                    <Text fontWeight="medium">{administrator?.ID_Admin}</Text>
                                </HStack>

                                <HStack justifyContent="space-between">
                                    <HStack space={2} alignItems="center">
                                        <Ionicons name="briefcase-outline" size={20} color="#0074E8" />
                                        <Text color="gray.500">Cargo:</Text>
                                    </HStack>
                                    <Text fontWeight="medium">{administrator?.Usuario?.Cargo || "No especificado"}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <HStack space={2} alignItems="center">
                                        <Ionicons name="shield-checkmark-outline" size={20} color="#0074E8" />
                                        <Text color="gray.500">Nivel de permiso:</Text>
                                    </HStack>
                                    <Badge colorScheme={
                                        administrator?.Nivel_Permiso === 'Avanzado' ? 'red' :
                                            administrator?.Nivel_Permiso === 'Medio' ? 'orange' : 'green'
                                    }>
                                        {administrator?.Nivel_Permiso}
                                    </Badge>
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