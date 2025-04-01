import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Text,
    Icon,
    VStack,
    HStack,
    Spinner,
    Alert,
    Divider,
    useToast,
    Badge,
    Heading,
} from "native-base";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import mime from "react-native-mime-types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { API_URL } from "@env";
import {Linking} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";

const UploadExcelUsersScreen = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const toast = useToast();
    const templateUrl = `${API_URL}/api/downloads/excelTemplates/Usuarios.xlsx`;
    const localUri = FileSystem.documentDirectory + "usuarios.xls";
    const navigation = useNavigation();
    const route = useRoute();
    const [toastId, setToastId] = useState(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"],
            });

            if (result.canceled) {
                showToast("Selección cancelada", "info");
                return;
            }

            setFile(result.assets[0]);
            const toastId = toast.show({
                description: "Archivo seleccionado",
                status: "success",
                duration: 5000, // Duración del toast en milisegundos
            });

            // Ocultar el toast después de 6 segundos
            setTimeout(() => {
                toast.close(toastId);
            }, 6000);

        } catch (error) {
            console.error("Error al seleccionar el archivo:", error);
            showToast("Error al seleccionar archivo", "error");
        }
    };

    const uploadFile = async () => {
        if (!file) {
            showToast("Por favor selecciona un archivo", "warning");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: mime.lookup(file.name) || "application/octet-stream",
        });

        try {
            const response = await fetch(`${API_URL}/api/uploads/upload-excel-usuarios`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const textResponse = await response.text();

            try {
                const jsonResponse = JSON.parse(textResponse);
                showToast("Archivo procesado correctamente", "success", jsonResponse.message);
                console.log("Success", jsonResponse.message);
                navigation.goBack();
            } catch (jsonError) {
                showToast("Respuesta del servidor", "info", textResponse);
            }
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            showToast("Error al subir el archivo", "error");
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (toastId) {
                toast.close(toastId);
            }
        };
    }, [toastId]);

    const downloadTemplate = async () => {
        setIsDownloading(true);
        try {
            // Usando una ruta local para descargar el archivo en el dispositivo
            const localUri = FileSystem.documentDirectory + "usuarios.xlsx";
            const { uri } = await FileSystem.downloadAsync(templateUrl, localUri);
            toast.show({ title: "Plantilla descargada", status: "success", description: `Guardado en: ${uri}` });

        } catch (error) {
            toast.show({ title: "Error al descargar plantilla", status: "error" });
            console.error("Error al descargar el archivo:", error);
        } finally {
            setIsDownloading(false);
        }
    };
    const showToast = (title, status, description = "") => {
        toast.show({
            title,
            description,
            status,
            placement: "top",
            duration: 3000,
        });
    };

    const downloadTemplateP10 = () => {
        const url = `${API_URL}/api/downloads/excelTemplates/Usuarios.xlsx`; // Usando backticks para interpolación de la variable
        Linking.openURL(url).catch((err) => console.error('Error al abrir la URL:', err));
    };

    return (
        <Box flex={1} p={4} bg="gray.50">
            <VStack space={4} flex={1}>
                <Heading size="lg" mb={2}>Carga Masiva de Usuarios</Heading>
                <Text color="gray.600">
                    Sube un archivo Excel con la información de los usuarios para registrarlos en el sistema.
                </Text>
                <Divider my={2} />

                {/* Sección de archivo seleccionado */}
                {file && (
                    <Box bg="blue.50" p={3} borderRadius="md" borderWidth={1} borderColor="blue.200">
                        <HStack space={2} alignItems="center">
                            <Icon as={Ionicons} name="document" color="blue.500" size={5} />
                            <VStack flex={1}>
                                <Text bold>{file.name}</Text>
                                <Text fontSize="xs" color="gray.500">
                                    {(file.size / 1024).toFixed(2)} KB
                                </Text>
                            </VStack>
                            <Badge colorScheme="blue">Seleccionado</Badge>
                        </HStack>
                    </Box>
                )}

                {/* Botones de acción */}
                <VStack space={3}>
                    <Button
                        leftIcon={<Icon as={Ionicons} name="document" size={5} />}
                        colorScheme="primary"
                        onPress={pickDocument}
                        isDisabled={isUploading || isDownloading}
                    >
                        Seleccionar Archivo Excel
                    </Button>

                    <Button
                        leftIcon={<Icon as={MaterialIcons} name="cloud-upload" size={5} />}
                        colorScheme="success"
                        onPress={uploadFile}
                        isDisabled={!file || isUploading || isDownloading}
                        isLoading={isUploading}
                        isLoadingText="Subiendo..."
                    >
                        Subir Archivo
                    </Button>

                    <Divider my={2} />

                    <Text color="gray.600" textAlign="center">
                        ¿No tienes la plantilla? Descárgala aquí:
                    </Text>

                    <Button
                        leftIcon={<Icon as={MaterialIcons} name="file-download" size={5} />}
                        variant="outline"
                        colorScheme="blue"
                        onPress={downloadTemplateP10}
                        isDisabled={isUploading || isDownloading}
                        isLoading={isDownloading}
                        isLoadingText="Descargando..."
                    >
                        Descargar Plantilla (usuarios.xls)
                    </Button>
                </VStack>

                {/* Información adicional */}
                <Box mt={6} p={3} bg="gray.100" borderRadius="md">
                    <Text bold mb={1}>Instrucciones:</Text>
                    <Text>- Descarga la plantilla y completa los datos</Text>
                    <Text>- Mantén el formato original del archivo</Text>
                    <Text>- No modifiques los nombres de las columnas</Text>
                    <Text>- Sube el archivo completado</Text>
                </Box>
            </VStack>
        </Box>
    );
};

export default UploadExcelUsersScreen;