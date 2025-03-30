import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Input,
    Button,
    useToast,
    Select,
    NativeBaseProvider,
    VStack,
    HStack,
    Box,
    Heading
} from "native-base";
import { API_URL } from "@env";
import customTheme from "../../themes";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

const AddRfidCardsScreen = () => {
    const [codigoRFID, setCodigoRFID] = useState("");
    const [estado, setEstado] = useState("Activo");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigation = useNavigation();

    // Obtener el último RFID desde la API cada 3 segundos
    const fetchLastRfid = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidCards/read-rfid`);
            const data = await response.json();
            if (data.length > 0) {
                const last = data[data.length - 1].rfid;
                setCodigoRFID(last); // Actualiza el código RFID con la última lectura
            }
        } catch (error) {
            console.error("Error obteniendo RFID:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchLastRfid, 3000); // Consultar cada 3 segundos
        return () => clearInterval(interval);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setCodigoRFID("");
            return () => {};
        }, [])
    );

    const handleRegister = async () => {
        if (!codigoRFID.trim()) {
            toast.show({
                description: "El código RFID es obligatorio.",
                placement: "top",
            });
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/rfidCards/register-rfid`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Codigo_RFID: codigoRFID,
                    Estado: estado,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.show({
                    description: "Tarjeta RFID registrada con éxito.",
                    placement: "top",
                });
                setCodigoRFID("");
                setEstado("Activo");
                navigation.navigate("ListRfidCard");
            } else {
                toast.show({
                    description: data.error || "Error al registrar.",
                    placement: "top",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.show({
                description: "Error de conexión.",
                placement: "top",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea p={5} bg="background.light" flex={1}>
                <HStack justifyContent="space-between" alignItems="center" mb={5} p={3} bg="secondary.500"
                        borderRadius="lg" shadow={2}>
                    <HStack alignItems="center">
                        <VStack ml={3}>
                            <Heading size="md" mb={3} bold color="white" textAlign="center">Nueva Tarjeta RFID</Heading>
                        </VStack>
                    </HStack>
                </HStack>
                <VStack flex={1} p={5} space={4}>
                    <VStack>
                        <Text fontSize="md" mb={2}>Código RFID:</Text>
                        <Input
                            placeholder="Pase la tarjeta por el lector"
                            value={codigoRFID || "Esperando lectura..."}
                            isReadOnly
                            fontSize="md"
                        />
                    </VStack>

                    <VStack>
                        <Text fontSize="md" mb={2}>Estado:</Text>
                        <Select
                            selectedValue={estado}
                            onValueChange={setEstado}
                            fontSize="md"
                        >
                            <Select.Item label="Activo" value="Activo" />
                            <Select.Item label="Inactivo" value="Inactivo" />
                        </Select>
                    </VStack>

                    <Button
                        onPress={handleRegister}
                        isLoading={isLoading}
                        mt={4}
                        bg="secondary.500"
                        _pressed={{ bg: "secondary.600" }}
                    >
                        {isLoading ? "Registrando..." : "Registrar Tarjeta"}
                    </Button>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddRfidCardsScreen;
