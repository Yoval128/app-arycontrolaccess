import React, { useState } from "react";
import { View, Text, Button, Alert, HStack, NativeBaseProvider, ScrollView, Box } from "native-base";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { API_URL } from "@env";
import customTheme from "../../themes";
import { Ionicons } from "@expo/vector-icons";

const ExportPDFUserScreen = () => {
    const [loading, setLoading] = useState(false);

    // Función para descargar y guardar el PDF
    const generatePDF = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/users/generate-pdf`);
            if (!response.ok) {
                throw new Error("No se pudo descargar el PDF.");
            }

            // Leer los datos en formato blob
            const blob = await response.blob();
            const reader = new FileReader();

            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Data = reader.result.split(",")[1];

                // Obtener la fecha actual para el nombre del archivo
                const currentDate = new Date();
                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
                const fileName = `usuarios_${formattedDate}.pdf`;

                // Ruta donde se guardará el archivo en el dispositivo
                const pdfUri = `${FileSystem.documentDirectory}${fileName}`;

                // Guardar el archivo en el sistema de archivos
                await FileSystem.writeAsStringAsync(pdfUri, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Compartir el archivo si es posible
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(pdfUri);
                } else {
                    Alert.alert("Descarga completada", `El archivo ha sido guardado en:\n${pdfUri}`);
                }
            };
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            Alert.alert("Error", "Ocurrió un error al descargar el PDF.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <HStack alignItems="center" mb={4}>
                        <Text fontSize="xl" fontWeight="bold" ml={2} color="primary.500">
                            Exportar usuarios
                        </Text>
                    </HStack>
                    <Button onPress={generatePDF} isLoading={loading} colorScheme="blue">
                        <Ionicons name="download" size={20} color="white" />
                        <Text color="white" ml={2}>
                            Exportar a PDF
                        </Text>
                    </Button>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default ExportPDFUserScreen;
