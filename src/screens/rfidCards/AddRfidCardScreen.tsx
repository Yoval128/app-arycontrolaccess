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
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "@env";
import customTheme from "../../themes";
import { useNavigation } from "@react-navigation/native";

const AddRfidCardsScreen = () => {
    const [codigoRFID, setCodigoRFID] = useState("");
    const [estado, setEstado] = useState("Activo");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchLastRfid = async () => {
            try {
                const response = await fetch(`${API_URL}/api/rfidCards/last-rfid`);
                const data = await response.json();
                if (data.rfid && data.rfid !== codigoRFID) {
                    setCodigoRFID(data.rfid);
                }
            } catch (error) {
                console.error("Error fetching last RFID:", error);
            }
        };

        const interval = setInterval(fetchLastRfid, 1000);
        return () => clearInterval(interval);
    }, [codigoRFID]);

    const handleRegister = async () => {
        if (!codigoRFID.trim()) {
            toast.show({ description: "El código RFID es obligatorio." });
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
                body: JSON.stringify({ Codigo_RFID: codigoRFID, Estado: estado }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.show({ description: "Tarjeta RFID registrada con éxito." });
                setCodigoRFID("");
                setEstado("Activo");
                navigation.navigate('ListRfidCard'); // Navegar a la lista de tarjetas RFID
            } else {
                toast.show({ description: data.error || "Error al registrar." });
            }
        } catch (error) {
            toast.show({ description: "Error de conexión." });
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
                <VStack flex={1} p={5}>
                    <Input
                        placeholder="Código RFID"
                        value={codigoRFID}
                        isReadOnly
                        InputLeftElement={<FontAwesome name="id-card" size={20} />}
                    />
                    <Text></Text>
                    <Select selectedValue={estado} onValueChange={setEstado} mb={4}>
                        <Select.Item label="Activo" value="Activo" />
                        <Select.Item label="Inactivo" value="Inactivo" />
                    </Select>
                    <Button onPress={handleRegister} isLoading={isLoading}>
                        {isLoading ? "Registrando..." : "Registrar"}
                    </Button>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddRfidCardsScreen;