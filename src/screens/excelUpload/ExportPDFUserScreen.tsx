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
    ScrollView,
    useColorModeValue
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

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
    const infoBoxBg = useColorModeValue("blue.50", "blue.900");
    const infoBoxBorder = useColorModeValue("blue.200", "blue.700");
    const instructionsBg = useColorModeValue("gray.100", "gray.700");
    const progressBg = useColorModeValue("gray.200", "gray.600");
    const dividerColor = useColorModeValue("gray.200", "gray.600");

    const generatePDF = async () => {
        setIsGenerating(true);
        setDownloadProgress(0);

        try {
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

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            const fileName = `usuarios_${formattedDate}.pdf`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} bg={bgColor}>
                <Box safeArea p={5} flex={1}>
                    <VStack space={4}>
                        {/* Header */}
                        <HStack alignItems="center" space={2}>
                            <Icon as={Ionicons} name="document-text" size={6} color="primary.600" />
                            <Heading size="lg" color="primary.600">
                                Exportar Usuarios
                            </Heading>
                        </HStack>

                        <Divider my={2} bg={dividerColor} />

                        {/* Información */}
                        <Box bg={infoBoxBg} p={4} borderRadius="md" borderWidth={1} borderColor={infoBoxBorder}>
                            <Text bold mb={2} color={textColor}>Generar reporte de usuarios</Text>
                            <Text color={textColor}>
                                Esta función generará un documento PDF con la lista completa de usuarios registrados en el sistema.
                            </Text>
                        </Box>

                        {/* Estado de progreso */}
                        {isGenerating && (
                            <Box mt={4}>
                                <HStack justifyContent="space-between" mb={1}>
                                    <Text fontSize="sm" color={secondaryTextColor}>Progreso:</Text>
                                    <Text fontSize="sm" bold color={textColor}>{Math.round(downloadProgress)}%</Text>
                                </HStack>
                                <Box w="100%" bg={progressBg} borderRadius="full" h={2}>
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
                        <Box mt={8} p={3} bg={instructionsBg} borderRadius="md">
                            <Text bold mb={2} color={textColor}>Instrucciones:</Text>
                            <VStack space={2}>
                                <HStack space={2} alignItems="flex-start">
                                    <Icon as={Ionicons} name="information-circle" size={4} mt={0.5} color="primary.600" />
                                    <Text flex={1} color={textColor}>El PDF se generará con los datos actuales del sistema</Text>
                                </HStack>
                                <HStack space={2} alignItems="flex-start">
                                    <Icon as={Ionicons} name="information-circle" size={4} mt={0.5} color="primary.600" />
                                    <Text flex={1} color={textColor}>En dispositivos móviles se abrirá el menú para compartir</Text>
                                </HStack>
                                <HStack space={2} alignItems="flex-start">
                                    <Icon as={Ionicons} name="information-circle" size={4} mt={0.5} color="primary.600" />
                                    <Text flex={1} color={textColor}>En web se descargará automáticamente</Text>
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