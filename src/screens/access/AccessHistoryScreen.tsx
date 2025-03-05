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
    IconButton,
    Button
} from "native-base";
import { API_URL } from "@env";
import customTheme from "../../themes/index";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const AccessHistoryScreen = () => {
    const [accessData, setAccessData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigation = useNavigation();

    useEffect(() => {
        fetchAccessHistory();
    }, []);

    const fetchAccessHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/access/list-access`);
            const data = await response.json();
            setAccessData(data);
        } catch (error) {
            console.error("Error fetching access data:", error);
            setError("Error al cargar los accesos");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner size="lg" color="primary.500" />;
    if (error) return <Text color="red">{error}</Text>;

    const totalPages = Math.ceil(accessData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = accessData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <VStack flex={1} p={5}>
                    <Text fontSize="lg" fontWeight="bold" mb={5}>Historial de Accesos</Text>

                    <FlatList
                        data={paginatedData}
                        keyExtractor={(item) => item.ID_Acceso.toString()}
                        renderItem={({ item }) => (
                            <View bg="white" p={4} mb={4} borderRadius="md" shadow={2}>
                                <HStack alignItems="center" justifyContent="space-between">
                                    <VStack>
                                        <Text fontWeight="bold">{item.Tipo_Acceso}</Text>
                                        <Text fontSize="sm">{item.Ubicacion}</Text>
                                        <Text fontSize="xs" color="gray.500">{new Date(item.Fecha_Hora).toLocaleString()}</Text>
                                    </VStack>
                                    <IconButton
                                        icon={<Ionicons name="eye-outline" size={20} color="blue" />}
                                        onPress={() => navigation.navigate("AccessDetail", { accessId: item.ID_Acceso })}
                                    />
                                </HStack>
                            </View>
                        )}
                    />

                    <HStack justifyContent="center" space={3} mt={4}>
                        <Button onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))} isDisabled={currentPage === 1}>Anterior</Button>
                        <Text>{currentPage} de {totalPages}</Text>
                        <Button onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} isDisabled={currentPage === totalPages}>Siguiente</Button>
                    </HStack>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AccessHistoryScreen;
