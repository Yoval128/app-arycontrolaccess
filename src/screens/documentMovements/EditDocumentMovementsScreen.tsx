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
    useToast
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { Dropdown } from "react-native-element-dropdown";

const EditDocumentMovementsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { movement_id } = route.params; // ID del movimiento de documento para editar

    const [movement, setMovement] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [estado, setEstado] = useState("Completado");
    const toast = useToast();

    const estados = [
        { label: "Completado", value: "Completado" },
        { label: "Pendiente", value: "Pendiente" },
    ];

    useEffect(() => {
        // Cargar datos de movimiento, usuarios y documentos
        fetchMovement();
        fetchUsuarios();
        fetchDocumentos();
    }, []);

    const fetchMovement = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documentMovements/movement/${movement_id}`);
            const data = await response.json();
            setMovement(data);
            setEstado(data.Estado || "Completado");
        } catch (error) {
            console.error("Error al obtener el movimiento de documento:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/list-users`);
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    const fetchDocumentos = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documents/list-documents`);
            const data = await response.json();
            setDocumentos(data);
        } catch (error) {
            console.error("Error al obtener documentos:", error);
        }
    };

    const handleSave = async () => {
        if (!movement.ID_Documento || !estado) {
            toast.show({ description: "Todos los campos son obligatorios", status: "error" });
            return;
        }

        setSaving(true);
        try {
            await fetch(`${API_URL}/api/documentMovements/update-movement/${movement_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Documento: movement.ID_Documento,
                    Estado: estado,
                    Realizado_Por: movement.Realizado_Por, // Puedes permitir que el usuario edite el nombre si es necesario
                    Fecha: movement.Fecha,
                    Hora: movement.Hora
                }),
            });

            toast.show({ description: "Movimiento de documento actualizado con éxito", status: "success" });
            navigation.navigate("ListDocumentMovements", { shouldReload: true });  // Pasar un flag que indique recargar
        } catch (error) {
            console.error("Error al actualizar el movimiento de documento:", error);
            toast.show({ description: "Error al actualizar", status: "error" });
        } finally {
            setSaving(false);
        }
    };

    // Función para obtener el nombre de un documento por su ID
    const getDocumentoNombre = (id) => {
        const documento = documentos.find((doc) => doc.ID_Documento === id);
        return documento ? documento.Nombre_Documento : "Documento no encontrado";
    };

    // Función para obtener el nombre de un usuario por su ID
    const getUsuarioNombre = (id) => {
        const usuario = usuarios.find((user) => user.ID_Usuario === id);
        return usuario ? usuario.Nombre : "Usuario no encontrado";
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <Heading size="lg" color="primary.500" mb={5}>
                        <Ionicons name="pencil-outline" size={24} /> Editar Movimiento de Documento
                    </Heading>

                    {loading ? (
                        <Spinner size="lg" color="primary.500" />
                    ) : (
                        <VStack space={4}>
                            <FormControl>
                                <FormControl.Label>Documento</FormControl.Label>
                                <Input value={getDocumentoNombre(movement.ID_Documento)} isDisabled />
                            </FormControl>

                            <FormControl>
                                <FormControl.Label>Realizado Por</FormControl.Label>
                                <Input value={getUsuarioNombre(movement.ID_Usuario)} isDisabled />
                            </FormControl>

                            <FormControl>
                                <FormControl.Label>Estado</FormControl.Label>
                                <Dropdown
                                    data={estados}
                                    labelField="label"
                                    valueField="value"
                                    value={estado}
                                    onChange={(item) => setEstado(item.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormControl.Label>Fecha</FormControl.Label>
                                <Input value={movement.Fecha_Hora_Salida} isDisabled />
                            </FormControl>

                            <FormControl>
                                <FormControl.Label>Hora</FormControl.Label>
                                <Input value={movement.Fecha_Hora_Entrada} isDisabled />
                            </FormControl>

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
                    )}
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default EditDocumentMovementsScreen;
