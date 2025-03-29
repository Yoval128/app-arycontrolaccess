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
    Button, Icon
} from "native-base";
import { API_URL } from "@env";
import customTheme from "../../themes/index";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import {useAuth} from "../../context/AuthProvider";

const ListRfidTagsScreen = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 8;
    const toast = useToast();
    const navigation = useNavigation();
    const route = useRoute();
    const {user} = useAuth();

    const fetchTags = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/rfidTags/tags-list`);
            const data = await response.json();
            setTags(data);
            setTotalPages(Math.ceil(data.length / pageSize));
        } catch (error) {
            console.error("Error al obtener etiquetas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
        if (route.params?.shouldReload) {
            fetchTags();
        }
    }, [route.params?.shouldReload]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidTags/delete-tag/${selectedTag.ID_Etiqueta_RFID}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.show({ description: "Etiqueta eliminada con éxito." });
                fetchTags();
            } else {
                toast.show({ description: "Error al eliminar la etiqueta." });
            }
        } catch (error) {
            toast.show({ description: "Error al eliminar." });
        } finally {
            setIsOpen(false);
        }
    };

    if (loading) {
        return <Spinner color={customTheme.colors.primary[500]} size="lg" />;
    }

    const paginatedData = tags.slice((page - 1) * pageSize, page * pageSize);

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
                <VStack flex={1} p={5}>
                    <HStack alignItems="center" mb={6} bg="primary.500" p={4} borderRadius="md" shadow={3} justifyContent="center">
                        <Ionicons name="barcode-outline" size={25} color="white"/>
                        <Text fontSize="2xl" fontWeight="bold" ml={3} color="white">
                            Lista de Etiquetas RFID
                        </Text>
                    </HStack>

                    <FlatList
                        data={paginatedData}
                        keyExtractor={(item) => item.ID_Etiqueta_RFID.toString()}
                        renderItem={({ item }) => (
                            <HStack justifyContent="space-between" alignItems="center" p={3} mb={2} bg="white"
                                    borderRadius="md" shadow={2}>
                                <VStack>
                                    <HStack alignItems="center">
                                        <Icon as={Ionicons} name="pricetag-outline" size={5} color="gray.500" mr={2} />
                                        <Text fontSize="md" fontFamily="Poppins-Bold">{item.Codigo_RFID}</Text>
                                    </HStack>
                                    <Badge colorScheme={item.Estado === "Activo" ? "success" : "danger"}>{item.Estado}</Badge>
                                </VStack>
                                <HStack space={2}>
                                    <IconButton
                                        icon={<Ionicons name="eye-outline" size={20} color="blue" />}
                                        onPress={() => navigation.navigate("DetailRfidTags", { tag_id: item.ID_Etiqueta_RFID })}
                                    />
                                    <IconButton
                                        icon={<Ionicons name="pencil-outline" size={20} color="green" />}
                                        onPress={() => navigation.navigate("EditRfidTags", { tag_id: item.ID_Etiqueta_RFID })}
                                    />
                                    <IconButton
                                        icon={<Ionicons name="trash-outline" size={20} color="red" />}
                                        onPress={() => {
                                            setSelectedTag(item);
                                            setIsOpen(true);
                                        }}
                                    />
                                </HStack>
                            </HStack>

                        )}
                    />
                    <HStack justifyContent="center" space={3} mt={4}>
                        <Button isDisabled={page === 1} onPress={() => setPage(page - 1)}>Anterior</Button>
                        <Text fontSize="md">{page} de {totalPages}</Text>
                        <Button isDisabled={page === totalPages} onPress={() => setPage(page + 1)}>Siguiente</Button>
                    </HStack>
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

            {/* Agregar un registrp */}
            {user.role === 'administrador' && (
                <IconButton
                    icon={<Ionicons name="add" size={40} color="white"/>}
                    bg="primary.500"
                    borderRadius="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                    onPress={() => navigation.navigate("AddAdministrator")}
                />)}
        </NativeBaseProvider>
    );
};

export default ListRfidTagsScreen;
