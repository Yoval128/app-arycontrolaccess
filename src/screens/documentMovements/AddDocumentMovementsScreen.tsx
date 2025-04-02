import React, { useState, useEffect } from "react";
import { View, Text, Input, Button, Select, VStack, useToast, ScrollView, NativeBaseProvider } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "@env";
import customTheme from "../../themes/index";
import { useNavigation } from "@react-navigation/native";

const AddDocumentMovementsScreen = () => {
    const [idDocumento, setIdDocumento] = useState("");
    const [idUsuario, setIdUsuario] = useState("");
    const [estado, setEstado] = useState("En préstamo");
    const [usuarios, setUsuarios] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const toast = useToast();
    const navigation = useNavigation();

    // Obtener la lista de usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users/list-users`);
                const data = await response.json();
                if (response.ok) {
                    setUsuarios(data);
                } else {
                    toast.show({ description: "Error al cargar la lista de usuarios." });
                }
            } catch (error) {
                toast.show({ description: "Error de conexión." });
            }
        };

        // Obtener la lista de documentos
        const fetchDocumentos = async () => {
            try {
                const response = await fetch(`${API_URL}/api/documents/list-documents`);
                const data = await response.json();
                if (response.ok) {
                    setDocumentos(data);
                } else {
                    toast.show({ description: "Error al cargar la lista de documentos." });
                }
            } catch (error) {
                toast.show({ description: "Error de conexión." });
            }
        };

        fetchUsuarios();
        fetchDocumentos();
    }, []);

    const handleRegister = async () => {
        if (!idDocumento.trim() || !idUsuario.trim()) {
            toast.show({ description: "El ID del documento y el ID del usuario son obligatorios." });
            return;
        }

        // Obtener la fecha y hora actual
        const fechaHoraEntrada = new Date().toISOString(); // La fecha y hora actual en formato ISO
        const fechaHoraSalida = fechaHoraEntrada; // Esto depende de cómo quieras manejar la salida, tal vez la pongas después de la devolución

        try {
            const response = await fetch(`${API_URL}/api/documentMovements/register-movement`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ID_Documento: idDocumento,
                    ID_Usuario: idUsuario,
                    Estado: estado,
                    Fecha_Hora_Entrada: fechaHoraEntrada,
                    Fecha_Hora_Salida: fechaHoraSalida, // Asegúrate de enviar estos campos
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.show({ description: "Movimiento registrado con éxito." });
                setIdDocumento("");
                setIdUsuario("");
                setEstado("En préstamo");
                // Redirige a la pantalla de lista de movimientos después de un registro exitoso
                navigation.navigate("ListDocumentMovements");
            } else {
                toast.show({ description: data.error || "Error al registrar el movimiento." });
            }
        } catch (error) {
            toast.show({ description: "Error de conexión." });
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                <VStack flex={1} p={5}>
                    <Text fontSize="xl" fontFamily="Poppins-Bold" mb={4}>Registrar Movimiento de Documento</Text>

                    <Select
                        selectedValue={idDocumento}
                        onValueChange={setIdDocumento}
                        placeholder="Seleccionar Documento"
                        mb={4}
                    >
                        {documentos.map((documento) => (
                            <Select.Item key={documento.ID_Documento} label={documento.Nombre_Documento} value={documento.ID_Documento.toString()} />
                        ))}
                    </Select>

                    <Select
                        selectedValue={idUsuario}
                        onValueChange={setIdUsuario}
                        placeholder="Seleccionar Usuario"
                        mb={4}
                    >
                        {usuarios.map((usuario) => (
                            <Select.Item key={usuario.ID_Usuario} label={usuario.Nombre} value={usuario.ID_Usuario.toString()} />
                        ))}
                    </Select>

                    <Select selectedValue={estado} onValueChange={setEstado} mb={4}>
                        <Select.Item label="En préstamo" value="En préstamo" />
                        <Select.Item label="Devuelto" value="Devuelto" />
                    </Select>

                    <Button onPress={handleRegister}>Registrar Movimiento</Button>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AddDocumentMovementsScreen;
