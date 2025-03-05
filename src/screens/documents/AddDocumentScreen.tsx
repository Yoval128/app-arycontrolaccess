import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Heading, useTheme, useToast, NativeBaseProvider, ScrollView } from "native-base";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { API_URL } from '@env';

import customTheme from "../../themes/index";
import {useNavigation} from "@react-navigation/native";

const estados = [
    { label: "Disponible", value: "Disponible" },
    { label: "Prestado", value: "Prestado" }
];

const AddDocumentScreen = () => {
    const theme = useTheme();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nombre: "",
        tipo: "",
        ubicacion: "",
        estado: "",
        etiquetaRFID: ""
    });
    const [etiquetasRFID, setEtiquetasRFID] = useState([]);
    const [loadingEtiquetas, setLoadingEtiquetas] = useState(true); // Para controlar la carga de las etiquetas
    const navigation = useNavigation();

    // Función para obtener las etiquetas RFID disponibles
    const fetchEtiquetasRFID = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidTags/tags-list-disponible`);
            const data = await response.json();
            console.log("Datos obtenidos de las etiquetas RFID:", data);  // Verifica la estructura aquí
            const formattedData = data.map(item => ({
                label: item.Codigo_RFID,  // o cualquier propiedad que desees mostrar
                value: item.ID_Etiqueta_RFID  // Usamos el ID_Etiqueta_RFID como valor
            }));
            setEtiquetasRFID(formattedData);
        } catch (error) {
            toast.show({
                title: "Error",
                description: "Error al obtener las etiquetas RFID disponibles.",
                status: "error"
            });
        } finally {
            setLoadingEtiquetas(false);
        }
    };


    useEffect(() => {
        console.log("Etiquetas RFID cargadas:", etiquetasRFID);  // Verifica el contenido de las etiquetas
        fetchEtiquetasRFID();
    }, []);


    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        // Validaciones básicas
        if (!form.nombre || !form.tipo || !form.ubicacion || !form.estado) {
            toast.show({
                title: "Error",
                description: "Todos los campos son obligatorios",
                status: "error"
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/documents/register-document`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Nombre_Documento: form.nombre,
                    Tipo_Documento: form.tipo,
                    Ubicacion: form.ubicacion,
                    Estado: form.estado,
                    ID_Etiqueta_RFID: form.etiquetaRFID || null
                })
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                toast.show({
                    title: "Éxito",
                    description: "Documento registrado correctamente",
                    status: "success"
                });
                setForm({ nombre: "", tipo: "", ubicacion: "", estado: "", etiquetaRFID: "" });
                navigation.navigate('ListDocuments');
            } else {
                toast.show({
                    title: "Error",
                    description: data.error || "No se pudo registrar el documento",
                    status: "error"
                });
            }
        } catch (error) {
            setLoading(false);
            toast.show({
                title: "Error",
                description: "Error de conexión con el servidor",
                status: "error"
            });
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                <Box flex={1} p={5} bg={theme.colors.primary[50]}>
                    <Heading size="lg" color={theme.colors.primary[500]}>Registro de Documento</Heading>
                    <VStack space={4} mt={5}>
                        <Input
                            placeholder="Nombre del Documento"
                            value={form.nombre}
                            onChangeText={(value) => handleChange("nombre", value)}
                            InputLeftElement={<MaterialIcons name="description" size={20} color={theme.colors.primary[500]} style={{ marginLeft: 10 }} />}
                        />
                        <Input
                            placeholder="Tipo de Documento"
                            value={form.tipo}
                            onChangeText={(value) => handleChange("tipo", value)}
                            InputLeftElement={<MaterialIcons name="category" size={20} color={theme.colors.primary[500]} style={{ marginLeft: 10 }} />}
                        />
                        <Input
                            placeholder="Ubicación"
                            value={form.ubicacion}
                            onChangeText={(value) => handleChange("ubicacion", value)}
                            InputLeftElement={<MaterialIcons name="place" size={20} color={theme.colors.primary[500]} style={{ marginLeft: 10 }} />}
                        />
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


                        <Button isLoading={loading} onPress={handleSubmit} mt={3}>Registrar Documento</Button>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AddDocumentScreen;
