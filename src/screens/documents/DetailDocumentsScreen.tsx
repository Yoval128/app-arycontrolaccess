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
    AlertDialog,
    Radio,
    Stack,
    Icon,
    Center,
    Badge,
    useColorModeValue
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {useRoute, useNavigation} from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NfcManager, {NfcTech} from "react-native-nfc-manager";
import {Alert} from "react-native";
import Header from "../../components/Header";
import {useTranslation} from "react-i18next";

const DetailDocumentsScreen = () => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [password, setPassword] = useState("");
    const route = useRoute();
    const navigation = useNavigation();
    const {documento_id} = route.params;
    const [user, setUser] = useState(null);
    const [rfidCode, setRfidCode] = useState("");
    const [validationMethod, setValidationMethod] = useState("password");
    const [isReadingNFC, setIsReadingNFC] = useState(false);
    const [rfidStatus, setRfidStatus] = useState("no_leido");

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
    const dividerColor = useColorModeValue("gray.200", "gray.700");
    const iconColor = useColorModeValue("primary.500", "primary.300");
    const badgeTextColor = useColorModeValue("white", "gray.900");
    const radioTextColor = useColorModeValue("gray.800", "gray.100");
    const statusBoxBg = useColorModeValue("gray.100", "gray.700");
    const alertDialogBg = useColorModeValue("white", "gray.800");

    const getUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('usuario');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            }
        } catch (err) {
            setError('Error al cargar los datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
        NfcManager.start();

        return () => {
            if (isReadingNFC) {
                NfcManager.cancelTechnologyRequest().catch(() => 0);
            }
        };
    }, []);

    useEffect(() => {
        fetchDocumentDetails();
    }, []);

    const fetchDocumentDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documents/document/${documento_id}`);
            if (!response.ok) throw new Error('Error al obtener los detalles del documento');
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
            const userData = await AsyncStorage.getItem('usuario');
            if (!userData) {
                alert("No se encontró información del usuario.");
                return;
            }

            const {email} = JSON.parse(userData);

            if (!password.trim()) {
                alert("Por favor, ingresa una contraseña.");
                return;
            }

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
                handleDownloadAndOpen();
            } else {
                alert("Contraseña incorrecta.");
                setPassword("");
            }
        } catch (error) {
            console.error("Error al verificar la contraseña:", error);
            alert("Error al verificar la contraseña. Inténtalo nuevamente.");
        }
    };

    const readRFID = async () => {
        setRfidStatus("leyendo");
        setIsReadingNFC(true);
        try {
            await NfcManager.requestTechnology(NfcTech.NfcA);
            const tag = await NfcManager.getTag();
            if (tag) {
                setRfidCode(tag.id);
                setRfidStatus("leido");
                verifyRFID(tag.id);
            }
        } catch (error) {
            setRfidStatus("error");
            Alert.alert("Error", "No se pudo leer la tarjeta NFC");
        } finally {
            NfcManager.cancelTechnologyRequest();
            setIsReadingNFC(false);
        }
    };

    const verifyRFID = async (rfid) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/verify-nfc-admin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({codigo_rfid: rfid}),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error("Respuesta no JSON:", text);
                throw new Error("La respuesta no es JSON");
            }

            const data = await response.json();

            if (data.isValid && data.isAdmin) {
                handleDownloadAndOpen();
            } else {
                Alert.alert("Acceso denegado", "La tarjeta no pertenece a un administrador");
            }
        } catch (error) {
            console.error("Error al verificar RFID:", error);
            Alert.alert("Error", "No se pudo verificar la tarjeta. Inténtalo nuevamente.");
        }
    };

    const handleDownloadRequest = () => {
        if (validationMethod === "password") {
            setIsPasswordDialogOpen(true);
        } else {
            readRFID();
        }
    };

    if (loading) return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} justifyContent="center" alignItems="center" bg={bgColor}>
                <Spinner size="lg" color={iconColor}/>
            </Box>
        </NativeBaseProvider>
    );

    if (error) return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} justifyContent="center" alignItems="center" bg={bgColor}>
                <Text color="red.500">Error: {error}</Text>
            </Box>
        </NativeBaseProvider>
    );

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea flex={1} bg={bgColor} p={4}>
                <Header title={t('documents.detailsDocument.title')} iconName="document-text-outline"/>

                <Box bg={cardBg} p={5} borderRadius="lg" shadow={2} marginTop={5}>
                    <VStack space={4}>
                        <HStack space={4} alignItems="center">
                            <Icon as={Ionicons} name="file-tray" size={6} color={iconColor}/>
                            <VStack>
                                <Text fontSize="lg" fontWeight="bold" color={textColor}>{document?.Nombre_Documento}</Text>
                                <Text fontSize="md" color={secondaryTextColor}>{document?.Ubicacion}</Text>
                                <Text fontSize="sm" color={secondaryTextColor}>
                                    {document?.Tipo_Documento || "No disponible"}
                                </Text>
                            </VStack>
                        </HStack>
                        <Divider my={3} bg={dividerColor}/>
                        <VStack space={3}>
                            <HStack space={2} alignItems="center">
                                <Icon as={Ionicons} name="card-outline" size={5} color={iconColor}/>
                                <Text fontSize="md" color={textColor}>ID Documento: {document?.ID_Documento}</Text>
                            </HStack>
                            <HStack space={2} alignItems="center">
                                <Icon as={Ionicons} name="cloud-upload-outline" size={5} color={iconColor}/>
                                <Text fontSize="md" color={textColor}>{document?.Estado || "Estado no disponible"}</Text>
                            </HStack>
                        </VStack>

                        {document?.filePath && (
                            <>
                                <Divider my={3} bg={dividerColor}/>
                                <VStack space={3}>
                                    <Text fontSize="md" fontWeight="bold" color={textColor}>Método de autenticación:</Text>

                                    <Center>
                                        <Radio.Group
                                            name="validationMethod"
                                            value={validationMethod}
                                            onChange={(value) => {
                                                setValidationMethod(value);
                                                setRfidCode("");
                                                setRfidStatus("no_leido");
                                            }}
                                        >
                                            <Stack direction="row" space={4}>
                                                <Radio value="password" colorScheme="primary">
                                                    <Text color={radioTextColor}>Contraseña</Text>
                                                </Radio>
                                                <Radio value="rfid" colorScheme="primary">
                                                    <Text color={radioTextColor}>Tarjeta RFID</Text>
                                                </Radio>
                                            </Stack>
                                        </Radio.Group>
                                    </Center>

                                    {validationMethod === "rfid" && (
                                        <VStack space={2} mt={3}>
                                            <Text fontSize="md" fontWeight="bold" color={textColor}>Estado de lectura RFID:</Text>
                                            <Box p={3} bg={statusBoxBg} borderRadius="md">
                                                {rfidStatus === "no_leido" && (
                                                    <Text color={secondaryTextColor}>Presiona el botón "Leer RFID" para comenzar</Text>
                                                )}
                                                {rfidStatus === "leyendo" && (
                                                    <HStack space={2} alignItems="center">
                                                        <Spinner size="sm" color={iconColor}/>
                                                        <Text color={iconColor}>Leyendo tarjeta... Acércala al dispositivo</Text>
                                                    </HStack>
                                                )}
                                                {rfidStatus === "leido" && (
                                                    <VStack space={1}>
                                                        <Text color="green.500">Tarjeta leída correctamente</Text>
                                                        <Badge colorScheme="success" alignSelf="flex-start" variant="outline">
                                                            <Text fontWeight="bold" color={badgeTextColor}>Código: {rfidCode}</Text>
                                                        </Badge>
                                                    </VStack>
                                                )}
                                                {rfidStatus === "error" && (
                                                    <Text color="red.500">Error al leer la tarjeta. Intenta nuevamente.</Text>
                                                )}
                                            </Box>

                                            <Button
                                                onPress={readRFID}
                                                isLoading={isReadingNFC}
                                                leftIcon={<Icon as={Ionicons} name="card-outline" size={5}/>}
                                                colorScheme="secondary"
                                                mt={2}
                                                isDisabled={rfidStatus === "leyendo"}
                                            >
                                                {rfidStatus === "leido" ? "Leer otra tarjeta" : "Leer RFID"}
                                            </Button>

                                            <Text fontSize="xs" color={secondaryTextColor} textAlign="center">
                                                Acerca tu tarjeta RFID al dispositivo cuando presiones el botón de lectura
                                            </Text>
                                        </VStack>
                                    )}

                                    <Button
                                        onPress={handleDownloadRequest}
                                        isLoading={downloading}
                                        leftIcon={<Icon as={Ionicons} name="download-outline" size={5}/>}
                                        colorScheme="primary"
                                        mt={2}
                                        isDisabled={validationMethod === "rfid" && rfidStatus !== "leido"}
                                    >
                                        {validationMethod === "password"
                                            ? "Descargar con contraseña"
                                            : "Descargar archivo"}
                                    </Button>
                                </VStack>
                            </>
                        )}
                    </VStack>
                </Box>
            </Box>

            {/* Diálogo para contraseña */}
            <AlertDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)}>
                <AlertDialog.Content bg={alertDialogBg}>
                    <AlertDialog.Header _text={{color: textColor}}>Ingresar contraseña</AlertDialog.Header>
                    <AlertDialog.Body>
                        <Input
                            placeholder="Contraseña"
                            placeholderTextColor={secondaryTextColor}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            onSubmitEditing={handlePasswordSubmit}
                            bg={cardBg}
                            color={textColor}
                            borderColor={dividerColor}
                            _focus={{
                                borderColor: iconColor,
                                bg: cardBg
                            }}
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
}

export default DetailDocumentsScreen;