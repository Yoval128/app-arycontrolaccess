import React, { useEffect, useState } from "react";
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    FormControl,
    Button,
    ScrollView,
    Spinner,
    useToast
} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { Dropdown } from 'react-native-element-dropdown';

const EditAdministratorScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { admin_id } = route.params;

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    // Opciones para el nivel de permiso
    const permisos = [
        { label: 'Básico', value: 'Básico' },
        { label: 'Medio', value: 'Medio' },
        { label: 'Avanzado', value: 'Avanzado' }
    ];

    const fetchAdmin = async () => {
        try {
            const response = await fetch(`${API_URL}/api/administrators/administrator/${admin_id}`);
            const data = await response.json();
            setAdmin(data);
        } catch (error) {
            console.error("Error al obtener el administrador:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!admin.Nivel_Permiso) {
            toast.show({ description: "El nivel de permiso es obligatorio", status: "error" });
            return;
        }

        setSaving(true);
        try {
            await fetch(`${API_URL}/api/administrators/update-administrator`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Admin: admin.ID_Admin,
                    Nivel_Permiso: admin.Nivel_Permiso,
                }),
            });

            toast.show({ description: "Administrador actualizado con éxito", status: "success" });
            navigation.navigate("ListAdministrator", { refresh: true });
        } catch (error) {
            console.error("Error al actualizar el administrador:", error);
            toast.show({ description: "Error al actualizar", status: "error" });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchAdmin();
    }, []);

    if (loading) return <Spinner size="lg" color="primary.500" />;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <Heading size="lg" color="primary.500" mb={5}>
                        <Ionicons name="pencil-outline" size={24} /> Editar Administrador
                    </Heading>

                    <VStack space={4}>
                        <FormControl>
                            <FormControl.Label>Nivel de Permiso</FormControl.Label>
                            <Dropdown
                                data={permisos}
                                labelField="label"
                                valueField="value"
                                value={admin?.Nivel_Permiso || ''}
                                onChange={(item) => setAdmin({ ...admin, Nivel_Permiso: item.value })}
                                placeholder="Seleccione un nivel"
                                style={{
                                    backgroundColor: 'white',
                                    padding: 10,
                                    borderRadius: 8,
                                    borderColor: '#ccc',
                                    borderWidth: 1
                                }}
                            />
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
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default EditAdministratorScreen;
