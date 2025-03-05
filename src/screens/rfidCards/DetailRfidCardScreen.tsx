import React, {useEffect, useState} from "react";
import {View, Text, NativeBaseProvider, Box, VStack, HStack, Spinner, Badge} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";

const DetailRfidCardsScreen = () => {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const {tarjeta_id} = route.params;

    useEffect(() => {
        fetchCardDetails();
    }, []);
    console.log(tarjeta_id);
    console.log(card);
    const fetchCardDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidCards/rfid/${tarjeta_id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la tarjeta RFID');
            }
            const data = await response.json();
            setCard(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner size="lg" color="primary.500"/>;
    if (error) return <Text color="red.500">Error: {error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea p={5} bg="background.light" flex={1}>
                <HStack alignItems="center" mb={4}>
                    <Ionicons name="card-outline" size={28} color="#003469"/>
                    <Text fontSize="xl" fontWeight="bold" ml={2} color="primary.500">
                        Detalles de la Tarjeta RFID
                    </Text>
                </HStack>

                <Box bg="white" p={5} borderRadius="lg" shadow={2}>
                    <VStack space={4}>
                        <HStack space={2} alignItems="center">
                            <Ionicons name="id-card-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md" fontWeight="bold">ID: {card?.ID_Tarjeta_RFID}</Text>
                        </HStack>

                        <HStack space={2} alignItems="center">
                            <Ionicons name="person-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md">Codigo: {card?.Codigo_RFID || "No asignado"}</Text>
                        </HStack>


                        <HStack space={2} alignItems="center">
                            <Ionicons name="shield-checkmark-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md">Estado: </Text>
                            <Badge colorScheme={card?.Estado ? "success" : "danger"}>
                                {card?.Estado ? "Activo" : "Inactivo"}
                            </Badge>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default DetailRfidCardsScreen;
