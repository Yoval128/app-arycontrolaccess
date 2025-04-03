import React, { useEffect, useState } from "react";
import { View, Text, NativeBaseProvider, Box, VStack, HStack, Spinner, Badge, Button, Input, Alert } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import * as FileSystem from "expo-file-system";

NfcManager.start(); // Inicializa NFC

const DetailRfidCardsScreen = () => {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState("");
    const [rfidCode, setRfidCode] = useState("");
    const [downloading, setDownloading] = useState(false);

    const route = useRoute();
    const navigation = useNavigation();
    const { tarjeta_id } = route.params;

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

    // Función para leer el código RFID con NFC
    const readRFID = async () => {
        try {
            await NfcManager.requestTechnology(NfcTech.NfcA);
            const tag = await NfcManager.getTag();
            if (tag) {
                setRfidCode(tag.id);
                Alert.alert("Éxito", `Código RFID leído: ${tag.id}`);
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo leer la tarjeta NFC");
        } finally {
            NfcManager.cancelTechnologyRequest();
        }
    };

    // Función para descargar el documento
    const downloadDocument = async () => {
        if (!password || !rfidCode) {
            Alert.alert("Error", "Ingresa la contraseña y lee la tarjeta RFID");
            return;
        }

        setDownloading(true);

        try {
            const apiUrl = `${API_URL}/api/documents/download?rfid=${rfidCode}&password=${password}`;
            const fileUri = FileSystem.documentDirectory + "documento.pdf";

            const response = await FileSystem.downloadAsync(apiUrl, fileUri);

            if (response.status === 200) {
                Alert.alert("Éxito", "Documento descargado correctamente", [
                    { text: "Abrir", onPress: () => FileSystem.getContentUriAsync(fileUri).then(uri => FileSystem.openDocumentAsync(uri)) }
                ]);
            } else {
                Alert.alert("Error", "No se pudo descargar el documento");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al descargar");
        } finally {
            setDownloading(false);
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

                        <Input
                            placeholder="Ingresa tu contraseña"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            borderWidth={1}
                            borderRadius={5}
                            p={2}
                        />

                        <Button colorScheme="blue" mt={3} onPress={readRFID}>
                            Leer Tarjeta RFID
                        </Button>

                        <Button
                            colorScheme="green"
                            mt={3}
                            isLoading={downloading}
                            onPress={downloadDocument}
                        >
                            Descargar Documento
                        </Button>
                    </VStack>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default DetailRfidCardsScreen;
