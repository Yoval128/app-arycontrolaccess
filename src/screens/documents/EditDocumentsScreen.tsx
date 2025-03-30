import React, { useEffect, useState } from "react";
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Button,
    ScrollView,
    Spinner,
    Text,
    useToast,
    Link,
    Icon,
    HStack,
} from "native-base";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_URL } from "@env";
import * as DocumentPicker from 'expo-document-picker';
import customTheme from "../../themes"; // Importamos DocumentPicker

const EditDocumentsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { documento_id } = route.params;

    // Asegúrate de inicializar document como un objeto vacío.
    const [document, setDocument] = useState({
        Nombre_Documento: '',
        Tipo_Documento: '',
        Ubicacion: '',
        Estado: '',
        ID_Etiqueta_RFID: '',
        filePath: '',
        newFile: null, // Aquí guardaremos el archivo nuevo seleccionado
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [rfidTags, setRfidTags] = useState([]);
    const toast = useToast();

    const estados = [
        { label: 'Disponible', value: 'Disponible' },
        { label: 'Prestado', value: 'Prestado' }
    ];

    const fetchDocument = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documents/document/${documento_id}`);
            const data = await response.json();
            setDocument(prevState => ({
                ...prevState,
                ...data, // Rellenar los valores del documento recuperado
            }));
        } catch (error) {
            console.error("Error al obtener el documento:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRfidTags = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidTags/tags-list-disponible`);
            const data = await response.json();
            setRfidTags(data.map(item => ({ label: item.Codigo_RFID, value: item.ID_Tarjeta_RFID })));
        } catch (error) {
            console.error("Error al obtener las etiquetas RFID:", error);
        }
    };

    const handleSave = async () => {
        if (!document.Nombre_Documento || !document.Tipo_Documento || !document.Ubicacion || !document.Estado) {
            toast.show({ description: "Todos los campos son obligatorios", status: "error" });
            return;
        }

        setSaving(true);
        try {
            const body = {
                Nombre_Documento: document.Nombre_Documento,
                Tipo_Documento: document.Tipo_Documento,
                Ubicacion: document.Ubicacion,
                Estado: document.Estado,
                ID_Etiqueta_RFID: document.ID_Etiqueta_RFID,
                filePath: document.filePath, // Mantener el mismo archivo si no se selecciona uno nuevo
            };

            // Si se seleccionó un archivo nuevo, lo agregamos al cuerpo de la solicitud
            if (document.newFile) {
                const formData = new FormData();
                formData.append('file', {
                    uri: document.newFile.uri,
                    name: document.newFile.name,
                    type: document.newFile.type,
                });

                // Subir el nuevo archivo
                await fetch(`${API_URL}/api/documents/upload-file/${documento_id}`, {
                    method: 'POST',
                    body: formData,
                });

                // Actualizar el filePath después de la subida del nuevo archivo
                body.filePath = document.newFile.name;
            }

            await fetch(`${API_URL}/api/documents/update-document/${documento_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            toast.show({ description: "Documento actualizado con éxito", status: "success" });
            navigation.navigate("ListDocuments", { refresh: true });
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            toast.show({ description: "Error al actualizar", status: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handlePickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
        });

        if (result.type === 'success') {
            setDocument(prevState => ({
                ...prevState,
                newFile: result, // Guardamos el nuevo archivo seleccionado
            }));
        }
    };

    useEffect(() => {
        fetchDocument();
        fetchRfidTags();
    }, []);

    if (loading) return <Spinner size="lg" color="primary.500" />;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <Heading size="lg" color="primary.500" mb={5}>
                        <Ionicons name="pencil-outline" size={24} /> Editar Documento
                    </Heading>

                    <VStack space={4}>
                        <FormControl>
                            <FormControl.Label>Nombre del Documento</FormControl.Label>
                            <Input
                                value={document?.Nombre_Documento || ''}
                                onChangeText={(text) => setDocument({ ...document, Nombre_Documento: text })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Tipo de Documento</FormControl.Label>
                            <Input
                                value={document?.Tipo_Documento || ''}
                                onChangeText={(text) => setDocument({ ...document, Tipo_Documento: text })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Ubicación</FormControl.Label>
                            <Input
                                value={document?.Ubicacion || ''}
                                onChangeText={(text) => setDocument({ ...document, Ubicacion: text })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Estado</FormControl.Label>
                            <Dropdown
                                data={estados}
                                labelField="label"
                                valueField="value"
                                value={document?.Estado || ''}
                                onChange={(item) => setDocument({ ...document, Estado: item.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>ID Etiqueta RFID</FormControl.Label>
                            <Dropdown
                                data={rfidTags}
                                labelField="label"
                                valueField="value"
                                value={document?.ID_Etiqueta_RFID || ''}
                                onChange={(item) => setDocument({ ...document, ID_Etiqueta_RFID: item.value })}
                            />
                        </FormControl>

                        {/* Mostrar el nombre del archivo seleccionado */}
                        {document?.newFile && (
                            <FormControl>
                                <FormControl.Label>Archivo Seleccionado</FormControl.Label>
                                <Text color="gray.500">
                                    {document.newFile.name} {/* Muestra el nombre del archivo */}
                                </Text>
                            </FormControl>
                        )}

                        {/* Mostrar el documento guardado */}
                        {document?.filePath && (
                            <FormControl>
                                <FormControl.Label>Documento Guardado</FormControl.Label>
                                <HStack alignItems="center" backgroundColor="red.800" padding={2} textAlign="center">
                                    <Ionicons name="document-text-outline" size={25} color="white"/>
                                    <Link
                                        href={`${API_URL}/uploads/documents/${document.filePath}`}
                                        isExternal
                                        _text={{
                                            color: 'white', // Color rojo para el enlace
                                            fontWeight: 'bold', // Peso de la fuente en negrita
                                            textDecoration: 'underline', // Subrayado
                                            textAlign: 'center',
                                        }}
                                    >
                                        {document.filePath.split('/').pop()} {/* Extrae solo el nombre del archivo */}
                                    </Link>
                                </HStack>
                            </FormControl>
                        )}

                        {/* Botón para seleccionar un nuevo archivo PDF */}
                        <Button
                            mt={3}
                            onPress={handlePickDocument}
                            leftIcon={<Ionicons name="cloud-upload-outline" size={20} color="white" />}
                        >
                            Seleccionar Nuevo Documento
                        </Button>

                        <Button
                            colorScheme="secondary"
                            mt={5}
                            isLoading={saving}
                            onPress={handleSave}
                            leftIcon={<Ionicons name="save-outline" size={20} color="white" />}
                        >
                            Guardar Cambios
                        </Button>
                        <Button
                            mt={2}
                            onPress={() => navigation.goBack()}
                            variant="outline"
                            colorScheme="danger"
                            leftIcon={<Ionicons name="close" size={20} color="red" />}
                        >
                            Cancelar
                        </Button>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default EditDocumentsScreen;
