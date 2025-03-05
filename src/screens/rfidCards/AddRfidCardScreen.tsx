import React, { useState } from "react";
import {
    View,
    Text,
    Input,
    Button,
    Select,
    VStack,
    useToast,
    ScrollView,
    NativeBaseProvider
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "@env";
import customTheme from "../../themes/index";
import { useNavigation } from "@react-navigation/native";

const AddRfidCardsScreen = () => {
    const [codigoRFID, setCodigoRFID] = useState("");
    const [estado, setEstado] = useState("Activo");
    const toast = useToast();
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!codigoRFID.trim()) {
            toast.show({ description: "El código RFID es obligatorio." });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/rfidCards/register-rfid`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Codigo_RFID: codigoRFID, Estado: estado }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.show({ description: "Tarjeta RFID registrada con éxito." });
                setCodigoRFID("");
                setEstado("Activo");
                navigation.navigate('ListRfidCards');
            } else {
                toast.show({ description: data.error || "Error al registrar." });
            }
        } catch (error) {
            toast.show({ description: "Error de conexión." });
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                <VStack flex={1} p={5}>
                    <Text fontSize="xl" fontFamily="Poppins-Bold" mb={4}>Registrar Tarjeta RFID</Text>
                    <Input
                        placeholder="Código RFID"
                        value={codigoRFID}
                        onChangeText={setCodigoRFID}
                        InputLeftElement={<FontAwesome name="id-card" size={20} color={customTheme.colors.primary[500]} style={{ marginLeft: 10 }} />}
                        mb={4}
                    />
                    <Select selectedValue={estado} onValueChange={setEstado} mb={4}>
                        <Select.Item label="Activo" value="Activo" />
                        <Select.Item label="Inactivo" value="Inactivo" />
                    </Select>
                    <Button onPress={handleRegister}>Registrar</Button>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AddRfidCardsScreen;