import React, { useState } from "react";
import {
    Box,
    Text,
    Button,
    Icon,
    VStack,
    HStack,
    Spinner,
    useToast,
    NativeBaseProvider,
    Heading,
    Badge,
    Divider,
    Alert,
    ScrollView
} from "native-base";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { API_URL } from "@env";
import customTheme from "../../themes";

const ExportPDFUserScreen = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const toast = useToast();

    const generatePDF = async () => {
        setIsGenerating(true);
        setDownloadProgress(0);

        try {
            // Mostrar notificación de inicio
            toast.show({
                title: "Generando PDF",
                status: "info",
                placement: "top",
                duration: 2000,
            });

            const response = await fetch(`${API_URL}/api/users/generate-pdf`);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            // Crear nombre de archivo con fecha
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            const fileName = `usuarios_${formattedDate}.pdf`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            // Descargar el archivo con progreso
            const downloadResumable = FileSystem.createDownloadResumable(
                `${API_URL}/api/users/generate-pdf`,
                fileUri,
                {},
                (downloadProgress) => {
                    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                    setDownloadProgress(progress * 100);
                }
            );

            const { uri } = await downloadResumable.downloadAsync();

            // Intentar compartir el archivo
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Compartir lista de usuarios',
                    UTI: 'com.adobe.pdf'
                });
            } else {
                toast.show({
                    title: "Descarga completada",
                    description: `Archivo guardado en: ${uri}`,
                    status: "success",
                    placement: "top",
                    duration: 4000,
                });
            }

        } catch (error) {
            console.error("Error al generar PDF:", error);
            toast.show({
                title: "Error",
                description: "No se pudo generar el PDF",
                status: "error",
                placement: "top",
                duration: 3000,
            });
        } finally {
            setIsGenerating(false);
            setDownloadProgress(0);
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} bg="gray.50">
                <Box safeArea p={5} flex={1}>
                    <VStack space={4}>
                        {/* Header */}
                        <HStack alignItems="center" space={2}>
                            <Icon as={Ionicons} name="document-text" size={6} color="primary.600" />
                            <Heading size="lg" color="primary.600">
                                Exportar Usuarios
                            </Heading>
                        </HStack>

                        <Divider my={2} />

                        {/* Información */}
                        <Box bg="blue.50" p={4} borderRadius="md" borderWidth={1} borderColor="blue.200">
                            <Text bold mb={2}>Generar reporte de usuarios</Text>
                            <Text>
                                Esta función generará un documento PDF con la lista completa de usuarios registrados en el sistema.
                            </Text>
                        </Box>

                        {/* Estado de progreso */}
                        {isGenerating && (
                            <Box mt={4}>
                                <HStack justifyContent="space-between" mb={1}>
                                    <Text fontSize="sm" color="gray.600">Progreso:</Text>
                                    <Text fontSize="sm" bold>{Math.round(downloadProgress)}%</Text>
                                </HStack>
                                <Box w="100%" bg="gray.200" borderRadius="full" h={2}>
                                    <Box
                                        bg="primary.500"
                                        borderRadius="full"
                                        h={2}
                                        w={`${downloadProgress}%`}
                                    />
                                </Box>
                            </Box>
                        )}

                        {/* Botón principal */}
                        <Button
                            mt={6}
                            size="lg"
                            colorScheme="primary"
                            leftIcon={<Icon as={MaterialIcons} name="picture-as-pdf" size={5} />}
                            onPress={generatePDF}
                            isLoading={isGenerating}
                            isLoadingText="Generando PDF..."
                            isDisabled={isGenerating}
                        >
                            Generar PDF
                        </Button>

                        {/* Instrucciones */}
                        <Box mt={8} p={3} bg="gray.100" borderRadius="md">
                            <Text bold mb={2}>Instrucciones:</Text>
                            <VStack space={2}>
                                <HStack space={2} alignItems="flex-start">
                                    <Icon as={Ionicons} name="information-circle" size={4} mt={0.5} color="primary.600" />
                                    <Text flex={1}>El PDF se generará con los datos actuales del sistema</Text>
                                </HStack>
                                <HStack space={2} alignItems="flex-start">
                                    <Icon as={Ionicons} name="information-circle" size={4} mt={0.5} color="primary.600" />
                                    <Text flex={1}>En dispositivos móviles se abrirá el menú para compartir</Text>
                                </HStack>
                                <HStack space={2} alignItems="flex-start">
                                    <Icon as={Ionicons} name="information-circle" size={4} mt={0.5} color="primary.600" />
                                    <Text flex={1}>En web se descargará automáticamente</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default ExportPDFUserScreen;