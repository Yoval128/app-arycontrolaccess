import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Spinner,
    HStack,
    VStack,
    Badge,
    ScrollView,
    NativeBaseProvider,
    IconButton,
    useToast,
    AlertDialog,
    Button
} from "native-base";
import { API_URL } from "@env";
import customTheme from "../../themes/index";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';

const ListDocumentMovementsScreen = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // State for AlertDialog
    const [selectedMovement, setSelectedMovement] = useState(null); // Track the selected movement to delete
    const toast = useToast();
    const navigation = useNavigation();
    const route = useRoute();

    // Función para obtener los movimientos de documentos
    const fetchMovements = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/documentMovements/movements-list`);
            const data = await response.json();
            setMovements(data);
        } catch (error) {
            console.error("Error al obtener los movimientos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovements();

        // Recargar los movimientos si el parámetro shouldReload está presente
        if (route.params?.shouldReload) {
            fetchMovements();  // Recargar la lista de movimientos
        }
    }, [route.params?.shouldReload]);  // Dependemos de shouldReload

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documentMovements/delete-movement/${selectedMovement.ID_Movimiento}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.show({ description: "Movimiento eliminado con éxito." });
                fetchMovements(); // Vuelve a cargar los movimientos después de eliminar
            } else {
                toast.show({ description: "Error al eliminar el movimiento." });
            }
        } catch (error) {
            toast.show({ description: "Error al eliminar." });
        } finally {
            setIsOpen(false); // Cierra el dialogo
        }
    };

    if (loading) {
        return <Spinner color={customTheme.colors.primary[500]} size="lg" />;
    }

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                <VStack flex={1} p={5}>
                    <Text fontSize="xl" fontFamily="Poppins-Bold" mb={4}>Lista de Movimientos de Documentos</Text>
                    <FlatList
                        data={movements}
                        keyExtractor={(item) => item.ID_Movimiento.toString()}
                        renderItem={({ item }) => (
                            <HStack justifyContent="space-between" alignItems="center" p={3} mb={2} bg="white"
                                    borderRadius="md" shadow={2}>
                                <VStack>
                                    <Text fontSize="md" fontFamily="Poppins-Bold">{`Documento ID: ${item.ID_Documento}`}</Text>
                                    <Badge colorScheme={item.Estado === "En préstamo" ? "warning" : "success"}>{item.Estado}</Badge>
                                </VStack>

                                <HStack space={2}>
                                    <IconButton
                                        icon={<Ionicons name="eye-outline" size={20} color="blue" />}
                                        onPress={() => navigation.navigate("DetailDocumentMovements", { movement_id: item.ID_Movimiento })}
                                    />
                                    <IconButton
                                        icon={<Ionicons name="pencil-outline" size={20} color="green" />}
                                        onPress={() => navigation.navigate("EditDocumentMovements", { movement_id: item.ID_Movimiento })}
                                    />
                                    <IconButton
                                        icon={<Ionicons name="trash-outline" size={20} color="red" />}
                                        onPress={() => {
                                            setSelectedMovement(item);
                                            setIsOpen(true); // Open the confirmation dialog
                                        }}
                                    />
                                </HStack>
                            </HStack>
                        )}
                    />
                </VStack>
            </ScrollView>

            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <AlertDialog.Content>
                    <AlertDialog.Header>Eliminar Movimiento</AlertDialog.Header>
                    <AlertDialog.Body>¿Estás seguro de que deseas eliminar este movimiento?</AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button variant="ghost" onPress={() => setIsOpen(false)}>Cancelar</Button>
                        <Button colorScheme="danger" onPress={handleDelete}>Eliminar</Button>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </NativeBaseProvider>
    );
};

export default ListDocumentMovementsScreen;
