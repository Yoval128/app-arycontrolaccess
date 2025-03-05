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

const ListRfidTagsScreen = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // State for AlertDialog
    const [selectedTag, setSelectedTag] = useState(null); // Track the selected tag to delete
    const toast = useToast();
    const navigation = useNavigation();
    const route = useRoute();

    // Función para obtener las etiquetas RFID
    const fetchTags = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/rfidTags/tags-list`);
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Error al obtener etiquetas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();

        // Recargar las etiquetas si el parámetro shouldReload está presente
        if (route.params?.shouldReload) {
            fetchTags();  // Recargar la lista de etiquetas
        }
    }, [route.params?.shouldReload]);  // Dependemos de shouldReload

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidTags/delete-tag/${selectedTag.ID_Etiqueta_RFID}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.show({ description: "Etiqueta eliminada con éxito." });
                fetchTags(); // Vuelve a cargar las etiquetas después de eliminar
            } else {
                toast.show({ description: "Error al eliminar la etiqueta." });
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
                    <Text fontSize="xl" fontFamily="Poppins-Bold" mb={4}>Lista de Etiquetas RFID</Text>
                    <FlatList
                        data={tags}
                        keyExtractor={(item) => item.ID_Etiqueta_RFID.toString()}
                        renderItem={({ item }) => (
                            <HStack justifyContent="space-between" alignItems="center" p={3} mb={2} bg="white"
                                    borderRadius="md" shadow={2}>
                                <VStack>
                                    <Text fontSize="md" fontFamily="Poppins-Bold">{item.Codigo_RFID}</Text>
                                    <Badge
                                        colorScheme={item.Estado === "Activo" ? "success" : "danger"}>{item.Estado}</Badge>
                                </VStack>

                                <HStack space={2}>
                                    <IconButton
                                        icon={<Ionicons name="eye-outline" size={20} color="blue" />}
                                        onPress={() => navigation.navigate("DetailRfidTag", { tag_id: item.ID_Etiqueta_RFID })}
                                    />
                                    <IconButton
                                        icon={<Ionicons name="pencil-outline" size={20} color="green" />}
                                        onPress={() => navigation.navigate("EditRfidTag", { tag_id: item.ID_Etiqueta_RFID })}
                                    />
                                    <IconButton
                                        icon={<Ionicons name="trash-outline" size={20} color="red" />}
                                        onPress={() => {
                                            setSelectedTag(item);
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
                    <AlertDialog.Header>Eliminar Etiqueta</AlertDialog.Header>
                    <AlertDialog.Body>¿Estás seguro de que deseas eliminar esta etiqueta?</AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button variant="ghost" onPress={() => setIsOpen(false)}>Cancelar</Button>
                        <Button colorScheme="danger" onPress={handleDelete}>Eliminar</Button>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </NativeBaseProvider>
    );
};

export default ListRfidTagsScreen;
