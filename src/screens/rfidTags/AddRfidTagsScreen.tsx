import React, {useState} from "react";
import {View, Text, Input, Button, Select, VStack, useToast, ScrollView, NativeBaseProvider} from "native-base";
import {FontAwesome} from "@expo/vector-icons";
import {API_URL} from "@env";
import customTheme from "../../themes/index";
import {useNavigation} from "@react-navigation/native";

const AddRfidTagsScreen = () => {
    const [codigoRFID, setCodigoRFID] = useState("");
    const [estado, setEstado] = useState("Activo");
    const toast = useToast();
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!codigoRFID.trim()) {
            toast.show({description: "El código RFID es obligatorio."});
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/rfidTags/register-tags`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({Codigo_RFID: codigoRFID, Estado: estado}),
            });

            const data = await response.json();
            if (response.ok) {
                toast.show({description: "Etiqueta registrada con éxito."});
                setCodigoRFID("");
                setEstado("Activo");
                // Redirige a la pantalla de lista después de un registro exitoso
                navigation.navigate('ListRfidTags');
            } else {
                toast.show({description: data.error || "Error al registrar."});
            }
        } catch (error) {
            toast.show({description: "Error de conexión."});
        }
    };
    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}} keyboardShouldPersistTaps="handled">
                <VStack flex={1} p={5}>
                    <Text fontSize="xl" fontFamily="Poppins-Bold" mb={4}>Registrar Etiqueta RFID</Text>
                    <Input
                        placeholder="Código RFID"
                        value={codigoRFID}
                        onChangeText={setCodigoRFID}
                        InputLeftElement={<FontAwesome name="tag" size={20} color={customTheme.colors.primary[500]}
                                                       style={{marginLeft: 10}}/>}
                        mb={4}
                    />
                    <Select selectedValue={estado} onValueChange={setEstado} mb={4}>
                        <Select.Item label="Activo" value="Activo"/>
                        <Select.Item label="Inactivo" value="Inactivo"/>
                    </Select>
                    <Button onPress={handleRegister}>Registrar</Button>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>

    );
};

export default AddRfidTagsScreen;
