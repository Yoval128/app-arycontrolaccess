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
    Input,
    AlertDialog
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {useRoute, useNavigation} from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailDocumentsScreen = () => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [userPassword] = useState("1234"); // Aquí deberías obtener la contraseña real del usuario desde la API o contexto
    const route = useRoute();
    const navigation = useNavigation();
    const {documento_id} = route.params;
    const [user, setUser] = useState(null);

    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('usuario');

            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                console.log('Correo del usuario:', parsedUser.email);  // Aquí mostramos el correo
            }
        } catch (err) {
            setError('Error al cargar los datos del usuario');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getUserData();
    }, []);

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

    const handlePasswordSubmit = async () => {
        try {
            // Obtener el correo almacenado en AsyncStorage
            const userData = await AsyncStorage.getItem('usuario');
            if (!userData) {
                alert("No se encontró información del usuario.");
                return;
            }

            const {email} = JSON.parse(userData);

            // Verificar que la contraseña no esté vacía
            if (!password.trim()) {
                alert("Por favor, ingresa una contraseña.");
                return;
            }

            // Enviar solicitud a la API para validar la contraseña
            const response = await fetch(`${API_URL}/api/auth/verify-user-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (data.isValid) {
                setIsPasswordDialogOpen(false);
                setPassword("");
                handleDownloadAndOpen();  // Llamar a la función de descarga
            } else {
                alert("Contraseña incorrecta.");
                setPassword("");
            }
        } catch (error) {
            console.error("Error al verificar la contraseña:", error);
            alert("Error al verificar la contraseña. Inténtalo nuevamente.");
        }
    };


    if (loading) return <Spinner size="lg" color="primary.500"/>;
    if (error) return <Text color="red.500">Error: {error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}} keyboardShouldPersistTaps="handled">
                <Box flex={1} p={5} bg="background.light">
                    <HStack alignItems="center" mb={4} bg="primary.500" p={4} borderRadius="md" shadow={3}
                            justifyContent="center">
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
                                            onPress={() => setIsPasswordDialogOpen(true)}
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

            {/* Cuadro de diálogo para ingresar contraseña */}
            <AlertDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)}>
                <AlertDialog.Content>
                    <AlertDialog.Header>Ingresar contraseña</AlertDialog.Header>
                    <AlertDialog.Body>
                        <Input
                            placeholder="Contraseña"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button onPress={() => setIsPasswordDialogOpen(false)} colorScheme="coolGray" mr={2}>
                            Cancelar
                        </Button>
                        <Button colorScheme="primary" onPress={handlePasswordSubmit}>
                            Confirmar
                        </Button>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </NativeBaseProvider>
    );
};

export default DetailDocumentsScreen;
