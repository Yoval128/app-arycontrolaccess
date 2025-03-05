import React, {useEffect, useState} from "react";
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
    useToast
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {Dropdown} from 'react-native-element-dropdown';  // Corregido

const EditDocumentsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {documento_id} = route.params;  // Corregido para utilizar document_id

    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [rfidTags, setRfidTags] = useState([]);
    const toast = useToast();

    // Estados posibles del documento
    const estados = [
        {label: 'Disponible', value: 'Disponible'},
        {label: 'Prestado', value: 'Prestado'}
    ];

    // Obtener los detalles del documento por su ID
    const fetchDocument = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documents/document/${documento_id}`);
            const data = await response.json();
            setDocument(data);
        } catch (error) {
            console.error("Error al obtener el documento:", error);
        } finally {
            setLoading(false);
        }
    };

    // Obtener las etiquetas RFID disponibles
    const fetchRfidTags = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidTags/tags-list-disponible`);
            const data = await response.json();
            setRfidTags(data.map(item => ({label: item.Codigo_RFID, value: item.ID_Tarjeta_RFID})));
        } catch (error) {
            console.error("Error al obtener las etiquetas RFID:", error);
        }
    };

    // Manejar la actualización del documento
    const handleSave = async () => {
        if (!document.Nombre_Documento || !document.Tipo_Documento || !document.Ubicacion || !document.Estado) {
            toast.show({description: "Todos los campos son obligatorios", status: "error"});
            return;
        }

        setSaving(true);
        try {
            await fetch(`${API_URL}/api/documents/update-document/${documento_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    Nombre_Documento: document.Nombre_Documento,
                    Tipo_Documento: document.Tipo_Documento,
                    Ubicacion: document.Ubicacion,
                    Estado: document.Estado,
                    ID_Etiqueta_RFID: document.ID_Etiqueta_RFID
                }),
            });

            toast.show({description: "Documento actualizado con éxito", status: "success"});
            navigation.navigate("ListDocuments", {refresh: true});  // Navegar a la lista de documentos
        } catch (error) {
            console.error("Error al actualizar el documento:", error);
            toast.show({description: "Error al actualizar", status: "error"});
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchDocument();
        fetchRfidTags();
    }, []);

    if (loading) return <Spinner size="lg" color="primary.500"/>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <Heading size="lg" color="primary.500" mb={5}>
                        <Ionicons name="pencil-outline" size={24}/> Editar Documento
                    </Heading>

                    <VStack space={4}>
                        <FormControl>
                            <FormControl.Label>Nombre del Documento</FormControl.Label>
                            <Input
                                value={document?.Nombre_Documento || ''}
                                onChangeText={(text) => setDocument({...document, Nombre_Documento: text})}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Tipo de Documento</FormControl.Label>
                            <Input
                                value={document?.Tipo_Documento || ''}
                                onChangeText={(text) => setDocument({...document, Tipo_Documento: text})}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Ubicación</FormControl.Label>
                            <Input
                                value={document?.Ubicacion || ''}
                                onChangeText={(text) => setDocument({...document, Ubicacion: text})}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Estado</FormControl.Label>
                            <Dropdown
                                data={estados}
                                labelField="label"
                                valueField="value"
                                value={document?.Estado || ''}
                                onChange={(item) => setDocument({...document, Estado: item.value})}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>ID Etiqueta RFID</FormControl.Label>
                            <Dropdown
                                data={rfidTags}
                                labelField="label"
                                valueField="value"
                                value={document?.ID_Etiqueta_RFID || ''}
                                onChange={(item) => setDocument({...document, ID_Etiqueta_RFID: item.value})}
                            />
                        </FormControl>
                        <Button
                            colorScheme="secondary"
                            mt={5}
                            isLoading={saving}
                            onPress={handleSave}
                            leftIcon={<Ionicons name="save-outline" size={20} color="white"/>}
                        >
                            Guardar Cambios
                        </Button>
                        <Button
                            mt={2}
                            onPress={() => navigation.goBack()}
                            variant="outline"
                            colorScheme="danger"
                            leftIcon={<Ionicons name="close" size={20} color="red"/>}
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
