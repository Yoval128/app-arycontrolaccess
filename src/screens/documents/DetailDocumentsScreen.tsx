import React, {useEffect, useState} from "react";
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
    Button,
    Link
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {useRoute, useNavigation} from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import customTheme from "../../themes/index";
import {API_URL} from "@env";

const DetailDocumentsScreen = () => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const {documento_id} = route.params;

    useEffect(() => {
        fetchDocumentDetails();
    }, []);

    const fetchDocumentDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documents/document/${documento_id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del documento');
            }
            const data = await response.json();
            setDocument(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAndOpen = async () => {
        if (!document?.filePath) {
            alert('No hay archivo asociado a este documento');
            return;
        }

        setDownloading(true);
        try {
            const fileUri = `${API_URL}/${document.filePath}`;
            const downloadResumable = FileSystem.createDownloadResumable(
                fileUri,
                FileSystem.documentDirectory + document.filePath.split('/').pop(),
                {}
            );

            const {uri} = await downloadResumable.downloadAsync();

            // Verificar si podemos compartir/abrir el archivo
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                alert('El archivo se ha descargado pero no se puede abrir directamente');
            }
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
            alert('Error al descargar el archivo: ' + error.message);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <Spinner size="lg" color="primary.500"/>;
    if (error) return <Text color="red.500">Error: {error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}} keyboardShouldPersistTaps="handled">
                <Box flex={1} p={5} bg="background.light">
                    <HStack alignItems="center" mb={4} bg="primary.500" p={4} borderRadius="md" shadow={3}
                            justifyContent="center">>
                        <Ionicons name="document-text-outline" size={28} color="#003469"/>
                        <Text fontSize="2xl" fontWeight="bold" ml={3} color="white">
                            Detalles del Documento
                        </Text>
                    </HStack>

                    <Box bg="white" p={5} borderRadius="lg" shadow={2}>
                        <VStack space={4}>
                            <HStack space={4} alignItems="center">
                                <IconButton icon={<Ionicons name="file-tray" size={20} color="#0074E8"/>}/>
                                <VStack>
                                    <Text fontSize="lg" fontWeight="bold">{document?.Nombre_Documento}</Text>
                                    <Text fontSize="md" color="gray.500">{document?.Ubicacion}</Text>
                                    <Text fontSize="sm"
                                          color="gray.400">{document?.Tipo_Documento || "No disponible"}</Text>
                                </VStack>
                            </HStack>
                            <Divider my={3}/>
                            <VStack space={3}>
                                <HStack space={2} alignItems="center">
                                    <Ionicons name="card-outline" size={20} color="#0074E8"/>
                                    <Text fontSize="md">ID Documento: {document?.ID_Documento}</Text>
                                </HStack>
                                <HStack space={2} alignItems="center">
                                    <Ionicons name="cloud-upload-outline" size={20} color="#0074E8"/>
                                    <Text fontSize="md">{document?.Estado || "Estado no disponible"}</Text>
                                </HStack>
                            </VStack>

                            {/* Sección del archivo */}
                            {document?.filePath && (
                                <>
                                    <Divider my={3}/>
                                    <VStack space={3}>
                                        <Text fontSize="md" fontWeight="bold">Archivo adjunto:</Text>
                                        <HStack space={2} alignItems="center">
                                            <Ionicons name="document-attach-outline" size={20} color="#0074E8"/>
                                            <Text fontSize="md" flex={1} numberOfLines={1} ellipsizeMode="tail">
                                                {document.filePath.split('/').pop()}
                                            </Text>
                                        </HStack>
                                        <Button
                                            onPress={handleDownloadAndOpen}
                                            isLoading={downloading}
                                            leftIcon={<Ionicons name="download-outline" size={20} color="white"/>}
                                            colorScheme="primary"
                                            mt={2}
                                        >
                                            Descargar y abrir
                                        </Button>
                                    </VStack>
                                </>
                            )}
                        </VStack>
                    </Box>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default DetailDocumentsScreen;