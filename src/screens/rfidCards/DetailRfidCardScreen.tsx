import React, {useEffect, useState} from "react";
import {View, Text, NativeBaseProvider, Box, VStack, HStack, Spinner, Badge, Button} from "native-base";
import {Ionicons} from "@expo/vector-icons";
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


    const fetchCardDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidCards/detail-rfid?id=${tarjeta_id}`);
            if (!response.ok) {
                throw new Error("Error al obtener los detalles de la tarjeta RFID");
            }
            const data = await response.json();
            setCard(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center">
                    <Spinner size="lg" color="primary.500"/>
                </Box>
            </NativeBaseProvider>
        );
    }

    if (error) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center">
                    <Text color="red.500">Error: {error}</Text>
                </Box>
            </NativeBaseProvider>
        );
    }

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
                            <Text fontSize="md" fontWeight="bold">
                                ID: {card?.ID_Tarjeta_RFID}
                            </Text>
                        </HStack>

                        <HStack space={2} alignItems="center">
                            <Ionicons name="barcode-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md">Código: {card?.Codigo_RFID || "No asignado"}</Text>
                        </HStack>

                        <HStack space={2} alignItems="center">
                            <Ionicons name="shield-checkmark-outline" size={20} color="#0074E8"/>
                            <Text fontSize="md">Estado: </Text>
                            <Badge colorScheme={card?.Estado_Tarjeta === "Activo" ? "success" : "danger"}>
                                {card?.Estado_Tarjeta}
                            </Badge>
                        </HStack>

                        {card?.ID_Usuario ? (
                            <>
                                <Text fontSize="lg" fontWeight="bold" mt={4} color="primary.500">
                                    Usuario Asignado:
                                </Text>
                                <HStack space={2} alignItems="center">
                                    <Ionicons name="person-outline" size={20} color="#0074E8"/>
                                    <Text fontSize="md">{card.Nombre}</Text>
                                </HStack>

                                <HStack space={2} alignItems="center">
                                    <Ionicons name="briefcase-outline" size={20} color="#0074E8"/>
                                    <Text fontSize="md">Cargo: {card.Cargo}</Text>
                                </HStack>

                                <HStack space={2} alignItems="center">
                                    <Ionicons name="mail-outline" size={20} color="#0074E8"/>
                                    <Text fontSize="md">Correo: {card.Correo}</Text>
                                </HStack>
                            </>
                        ) : (
                            <Text fontSize="md" color="red.500" fontWeight="bold" mt={3}>
                                No hay usuario asignado a esta tarjeta.
                            </Text>
                        )}
                        <HStack space={2} alignItems="center">
                            <Button
                                onPress={() => navigation.navigate("DetailUser", {usuario_id: card.ID_Usuario})}
                                colorScheme="blue">
                                Consultar perfil
                            </Button>
                        </HStack>

                    </VStack>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default DetailRfidCardsScreen;
