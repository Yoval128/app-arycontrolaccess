import React, { useState, useEffect } from "react";
import {
    Box, Button, Input, VStack, Heading, useTheme, useToast, NativeBaseProvider, ScrollView, Text, HStack
} from "native-base";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import { API_URL } from '@env';

import customTheme from "../../themes/index";
import { useNavigation } from "@react-navigation/native";

const estados = [{ label: "Disponible", value: "Disponible" }];

const AddDocumentScreen = () => {
    const theme = useTheme();
    const toast = useToast();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [etiquetasRFID, setEtiquetasRFID] = useState([]);
    const [loadingEtiquetas, setLoadingEtiquetas] = useState(true);

    const [form, setForm] = useState({
        nombre: "",
        tipo: "",
        ubicacion: "",
        estado: "",
        etiquetaRFID: ""
    });

    useEffect(() => {
        const fetchEtiquetasRFID = async () => {
            try {
                const response = await fetch(`${API_URL}/api/rfidTags/tags-list-disponible`);
                const data = await response.json();
                const formattedData = data.map(item => ({
                    label: item.Codigo_RFID,
                    value: item.ID_Etiqueta_RFID
                }));
                setEtiquetasRFID([{ label: "Sin etiqueta", value: "" }, ...formattedData]);
            } catch (error) {
                toast.show({
                    title: "Error",
                    description: "No se pudieron obtener las etiquetas RFID.",
                    status: "error"
                });
            } finally {
                setLoadingEtiquetas(false);
            }
        };

        fetchEtiquetasRFID();
    }, []);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });

            if (result.assets && result.assets.length > 0) {
                setFile(result.assets[0]);
            }
        } catch (error) {
            toast.show({
                title: "Error",
                description: "Error al seleccionar el documento",
                status: "error"
            });
        }
    };

    const uploadDocument = async () => {
        if (!file) {
            toast.show({
                title: "Error",
                description: "Por favor selecciona un archivo",
                status: "error"
            });
            return null;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/pdf'
            });

            const response = await fetch(`${API_URL}/api/documents/upload`, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = await response.json();

            if (response.ok) {
                return data.filePath;
            } else {
                throw new Error(data.error || "Error al subir el archivo");
            }
        } catch (error) {
            toast.show({
                title: "Error",
                description: error.message,
                status: "error"
            });
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.nombre || !form.tipo || !form.ubicacion || !form.estado) {
            toast.show({
                title: "Error",
                description: "Todos los campos son obligatorios",
                status: "error"
            });
            return;
        }

        if (!file) {
            toast.show({
                title: "Error",
                description: "Por favor selecciona un archivo",
                status: "error"
            });
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/pdf'
            });
            formData.append('Nombre_Documento', form.nombre);
            formData.append('Tipo_Documento', form.tipo);
            formData.append('Ubicacion', form.ubicacion);
            formData.append('Estado', form.estado);
            if (form.etiquetaRFID) {
                formData.append('ID_Etiqueta_RFID', form.etiquetaRFID);
            }

            const response = await fetch(`${API_URL}/api/documents/register-document`, {
                method: "POST",
                body: formData,
                // NO establezcas el header Content-Type manualmente cuando usas FormData
                // El navegador lo establecerá automáticamente con el boundary correcto
            });

            // Verifica si la respuesta es JSON válido antes de intentar parsearlo
            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                data = {};
            }

            if (response.ok) {
                toast.show({
                    title: "Éxito",
                    description: "Documento registrado correctamente",
                    status: "success"
                });
                setForm({ nombre: "", tipo: "", ubicacion: "", estado: "", etiquetaRFID: "" });
                setFile(null);
                navigation.navigate('ListDocuments');
            } else {
                toast.show({
                    title: "Error",
                    description: data.error || "No se pudo registrar el documento",
                    status: "error"
                });
            }
        } catch (error) {
            toast.show({
                title: "Error",
                description: "Error de conexión con el servidor: " + error.message,
                status: "error"
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <NativeBaseProvider theme={customTheme}>
             <Box flex={1} p={5} bg={theme.colors.primary[50]}>
                    <Heading size="lg" color={theme.colors.primary[500]}>Registro de Documento</Heading>
                    <VStack space={4} mt={5}>
                        <Input placeholder="Nombre del Documento" value={form.nombre} onChangeText={(value) => handleChange("nombre", value)} />
                        <Input placeholder="Tipo de Documento" value={form.tipo} onChangeText={(value) => handleChange("tipo", value)} />
                        <Input placeholder="Ubicación" value={form.ubicacion} onChangeText={(value) => handleChange("ubicacion", value)} />

                        <Dropdown
                            style={{ borderWidth: 1, borderColor: theme.colors.primary[400], padding: 10, borderRadius: 8 }}
                            data={estados}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecciona el estado"
                            value={form.estado}
                            onChange={(item) => handleChange("estado", item.value)}
                        />
                        <Dropdown
                            style={{ borderWidth: 1, borderColor: theme.colors.primary[500], padding: 10, borderRadius: 8 }}
                            data={etiquetasRFID}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecciona una etiqueta RFID"
                            value={form.etiquetaRFID}
                            onChange={(item) => handleChange("etiquetaRFID", item.value)}
                        />

                        <Box mt={3}>
                            <Button onPress={pickDocument} mb={2}>
                                Seleccionar Documento
                            </Button>
                            {file && (
                                <HStack alignItems="center" space={2}>
                                    <MaterialIcons name="insert-drive-file" size={20} color={theme.colors.primary[500]} />
                                    <Text>{file.name}</Text>
                                </HStack>
                            )}
                        </Box>

                        <Button isLoading={loading || uploading} onPress={handleSubmit} isDisabled={uploading || !form.nombre || !form.tipo || !form.ubicacion || !form.estado}>
                            Registrar Documento
                        </Button>
                    </VStack>
                </Box>
        </NativeBaseProvider>
    );
};

export default AddDocumentScreen;
