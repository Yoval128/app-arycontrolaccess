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
import {Ionicons} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {Dropdown} from "react-native-element-dropdown";

const EditRfidCardsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {tarjeta_id} = route.params; // ID de la tarjeta RFID para editar

    const [rfidCard, setRfidCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [estado, setEstado] = useState("Activo");
    const toast = useToast();

    const estados = [
        {label: "Activo", value: "Activo"},
        {label: "Inactivo", value: "Inactivo"},
    ];
    console.log(tarjeta_id);
    console.log(rfidCard);
    useEffect(() => {
        fetchRfidCard();
    }, []);

    const fetchRfidCard = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidCards/rfid/${tarjeta_id}`);
            const data = await response.json();
            setRfidCard(data);
            setEstado(data.Estado || "Activo");
        } catch (error) {
            console.error("Error al obtener la tarjeta RFID:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!rfidCard.Codigo_RFID || !estado) {
            toast.show({description: "Todos los campos son obligatorios", status: "error"});
            return;
        }

        setSaving(true);
        try {
            await fetch(`${API_URL}/api/rfidCards/update-rfid/${tarjeta_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    Codigo_RFID: rfidCard.Codigo_RFID,
                    Estado: estado,
                }),
            });

            toast.show({description: "Tarjeta RFID actualizada con éxito", status: "success"});
            navigation.navigate("ListRfidCards", {shouldReload: true});  // Pasar un flag que indique recargar
        } catch (error) {
            console.error("Error al actualizar la tarjeta RFID:", error);
            toast.show({description: "Error al actualizar", status: "error"});
        } finally {
            setSaving(false);
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <Heading size="lg" color="primary.500" mb={5}>
                        <Ionicons name="pencil-outline" size={24}/> Editar Tarjeta RFID
                    </Heading>

                    {loading ? (
                        <Spinner size="lg" color="primary.500"/>
                    ) : (
                        <VStack space={4}>
                            <FormControl>
                                <FormControl.Label>Código RFID</FormControl.Label>
                                <Input value={rfidCard.Codigo_RFID} isDisabled/>
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
                                onPress={() => navigation.navigate("ListRfidCards")}
                                variant="outline"
                                colorScheme="danger"
                                leftIcon={<Ionicons name="close" size={20} color="red"/>}
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

export default EditRfidCardsScreen;
