import React, { useEffect, useState } from "react";
import { View, Text, NativeBaseProvider, Box, VStack, HStack, Spinner, IconButton, Divider, Badge } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import customTheme from "../../themes/index";
import { API_URL } from "@env";

const DetailRfidTagsScreen = () => {
    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { tag_id } = route.params;

    useEffect(() => {
        fetchTagDetails();
    }, []);

    const fetchTagDetails = async () => {
        console.log("Tag ID:", tag_id);
        try {
            const response = await fetch(`${API_URL}/api/rfidTags/tag-rfid/${tag_id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la etiqueta RFID');
            }
            const data = await response.json();
            setTag(data);
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
                    <Ionicons name="pricetag-outline" size={28} color="#003469" />
                    <Text fontSize="xl" fontWeight="bold" ml={2} color="primary.500">
                        Detalles de la Etiqueta RFID
                    </Text>
                </HStack>

                <Box bg="white" p={5} borderRadius="lg" shadow={2}>
                    <VStack space={4}>
                        <HStack space={2} alignItems="center">
                            <Ionicons name="barcode-outline" size={20} color="#0074E8" />
                            <Text fontSize="md" fontWeight="bold">ID: {tag?.ID_Etiqueta_RFID}</Text>
                        </HStack>

                        <HStack space={2} alignItems="center">
                            <Ionicons name="cube-outline" size={20} color="#0074E8" />
                            <Text fontSize="md">Asociado a: {tag?.Codigo_RFID || "No asignado"}</Text>
                        </HStack>
                        <HStack space={2} alignItems="center">
                            <Ionicons name="shield-checkmark-outline" size={20} color="#0074E8" />
                            <Text fontSize="md">Estado: </Text>
                            <Badge colorScheme={tag?.Estado ? "success" : "danger"}>
                                {tag?.activo ? "Activo" : "Inactivo"}
                            </Badge>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default DetailRfidTagsScreen;
