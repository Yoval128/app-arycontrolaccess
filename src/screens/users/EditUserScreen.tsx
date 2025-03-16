import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Box, Heading, VStack, FormControl, Input, Button, ScrollView, Spinner, useToast } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { Dropdown } from "react-native-element-dropdown";

const EditUserScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { usuario_id } = route.params; // Obtener el ID del usuario para editar

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [password, setPassword] = useState("");
    const [tarjetas, setTarjetas] = useState([]);
    const toast = useToast();

    const cargos = [
        { label: 'Administrador', value: 'administrador' },
        { label: 'Empleado', value: 'empleado' },
        { label: 'Invitado', value: 'invitado' },
    ];

    useEffect(() => {
        fetchUser();
        fetchTarjetas();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/user/${usuario_id}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTarjetas = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidCards/rfid-list-disponible`);
            const data = await response.json();
            setTarjetas(data.map(item => ({ label: item.Codigo_RFID, value: item.ID_Tarjeta_RFID })));
        } catch (error) {
            console.error("Error al obtener las tarjetas RFID:", error);
        }
    };

    const handleSave = async () => {
        if (!user.Nombre || !user.Apellido || !user.Correo || !user.Cargo || !user.Telefono) {
            toast.show({ description: "Todos los campos son obligatorios", status: "error" });
            return;
        }

        setSaving(true);
        try {
            await fetch(`${API_URL}/api/users/update-user/${usuario_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...user, Contraseña: password || undefined }),
            });

            toast.show({ description: "Usuario actualizado con éxito", status: "success" });
            navigation.navigate("ListUsers", { refresh: true });  // Pasa un parámetro de recarga
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            toast.show({ description: "Error al actualizar", status: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <Heading size="lg" color="primary.500" mb={5}>
                        <Ionicons name="pencil-outline" size={24} /> Editar Usuario
                    </Heading>

                    {loading ? (
                        <Spinner size="lg" color="primary.500" />
                    ) : (
                        <VStack space={4}>
                            <FormControl><FormControl.Label>Nombre</FormControl.Label>
                                <Input value={user.Nombre} onChangeText={(text) => setUser({ ...user, Nombre: text })} />
                            </FormControl>
                            <FormControl><FormControl.Label>Apellido</FormControl.Label>
                                <Input value={user.Apellido} onChangeText={(text) => setUser({ ...user, Apellido: text })} />
                            </FormControl>
                            <FormControl><FormControl.Label>Correo</FormControl.Label>
                                <Input value={user.Correo} onChangeText={(text) => setUser({ ...user, Correo: text })} />
                            </FormControl>
                            <FormControl><FormControl.Label>Teléfono</FormControl.Label>
                                <Input value={user.Telefono} keyboardType="phone-pad" onChangeText={(text) => setUser({ ...user, Telefono: text })} />
                            </FormControl>
                            <FormControl><FormControl.Label>Contraseña (dejar en blanco si no se cambia)</FormControl.Label>
                                <Input value={password} secureTextEntry onChangeText={setPassword} />
                            </FormControl>
                            <FormControl><FormControl.Label>Cargo</FormControl.Label>
                                <Dropdown data={cargos} labelField="label" valueField="value" value={user.Cargo} onChange={(item) => setUser({ ...user, Cargo: item.value })} />
                            </FormControl>
                            <FormControl><FormControl.Label>ID Tarjeta RFID</FormControl.Label>
                                <Dropdown data={tarjetas} labelField="label" valueField="value" value={user.ID_Tarjeta_RFID} onChange={(item) => setUser({ ...user, ID_Tarjeta_RFID: item.value })} />
                            </FormControl>
                            <Button colorScheme="secondary" mt={5} isLoading={saving} onPress={handleSave} leftIcon={<Ionicons name="save-outline" size={20} color="white" />}>Guardar Cambios</Button>
                            <Button mt={2} onPress={() => navigation.goBack()} variant="outline" colorScheme="danger" leftIcon={<Ionicons name="close" size={20} color="red" />}>Cancelar</Button>
                        </VStack>
                    )}
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default EditUserScreen;
