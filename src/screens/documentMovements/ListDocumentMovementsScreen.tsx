import React, {useState, useEffect} from "react";
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
    Button,
    useColorModeValue
} from "native-base";
import {API_URL} from "@env";
import customTheme from "../../themes/index";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuth} from "../../context/AuthProvider";

const ListDocumentMovementsScreen = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMovement, setSelectedMovement] = useState(null);
    const toast = useToast();
    const navigation = useNavigation();
    const route = useRoute();
    const {user} = useAuth();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
    const headerBg = useColorModeValue("primary.500", "primary.700");
    const fabBg = useColorModeValue("primary.500", "primary.600");

    // Colores fijos para iconos
    const viewIconColor = "#3182CE";       // Azul
    const editIconColor = "#38A169";       // Verde
    const deleteIconColor = "#E53E3E";     // Rojo
    const addIconColor = "white";          // Blanco

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

        if (route.params?.shouldReload) {
            fetchMovements();
        }
    }, [route.params?.shouldReload]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documentMovements/delete-movement/${selectedMovement.ID_Movimiento}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.show({description: "Movimiento eliminado con éxito."});
                fetchMovements();
            } else {
                toast.show({description: "Error al eliminar el movimiento."});
            }
        } catch (error) {
            toast.show({description: "Error al eliminar."});
        } finally {
            setIsOpen(false);
        }
    };

    if (loading) {
        return <Spinner color={customTheme.colors.primary[500]} size="lg"/>;
    }

    return (
        <NativeBaseProvider theme={customTheme}>
            <VStack flex={1} p={5} bg={bgColor}>
                <HStack alignItems="center" mb={6} bg={headerBg} p={4} borderRadius="md" shadow={3}
                        justifyContent="center">
                    <Text fontSize="xl" fontWeight="bold" ml={2} color="white">
                        Movimientos de Documentos
                    </Text>
                </HStack>

                <FlatList
                    data={movements}
                    keyExtractor={(item) => item.ID_Movimiento.toString()}
                    renderItem={({item}) => (
                        <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            p={3}
                            mb={2}
                            bg={cardBg}
                            borderRadius="md"
                            shadow={2}
                        >
                            <VStack>
                                <Text
                                    fontSize="md"
                                    margin="1"
                                    fontFamily="Poppins-Bold"
                                    color={textColor}
                                >
                                    {`Documento: ${item.Nombre_Documento}`}
                                </Text>
                                <Badge
                                    colorScheme={item.Estado === "En préstamo" ? "warning" : "success"}
                                >
                                    {item.Estado}
                                </Badge>
                            </VStack>

                            <HStack space={2}>
                                {user.role === 'administrador' && (
                                    <>
                                        <IconButton
                                            icon={<Ionicons name="eye-outline" size={20} color={viewIconColor}/>}
                                            onPress={() => navigation.navigate("DetailDocumentMovements", {movement_id: item.ID_Movimiento})}
                                        />
                                        <IconButton
                                            icon={<Ionicons name="pencil-outline" size={20} color={editIconColor}/>}
                                            onPress={() => navigation.navigate("EditDocumentMovements", {movement_id: item.ID_Movimiento})}
                                        />
                                        <IconButton
                                            icon={<Ionicons name="trash-outline" size={20} color={deleteIconColor}/>}
                                            onPress={() => {
                                                setSelectedMovement(item);
                                                setIsOpen(true);
                                            }}
                                        />
                                    </>
                                )}
                                {user.role === 'empleado' && (
                                    <>
                                        <IconButton
                                            icon={<Ionicons name="eye-outline" size={20} color={viewIconColor}/>}
                                            onPress={() => navigation.navigate("DetailDocumentMovements", {movement_id: item.ID_Movimiento})}
                                        />
                                        <IconButton
                                            icon={<Ionicons name="pencil-outline" size={20} color={editIconColor}/>}
                                            onPress={() => navigation.navigate("EditDocumentMovements", {movement_id: item.ID_Movimiento})}
                                        />
                                    </>
                                )}
                                {user.role === 'invitado' && (
                                    <>
                                        <IconButton
                                            icon={<Ionicons name="eye-outline" size={20} color={viewIconColor}/>}
                                            onPress={() => navigation.navigate("DetailDocumentMovements", {movement_id: item.ID_Movimiento})}
                                        />
                                    </>
                                )}
                            </HStack>
                        </HStack>
                    )}
                />
            </VStack>

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

            {/* Botón flotante para agregar */}
            {(user.role === 'administrador' || user.role === 'empleado') && (
                <IconButton
                    icon={<Ionicons name="add" size={40} color={addIconColor}/>}
                    bg={fabBg}
                    borderRadius="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                    onPress={() => navigation.navigate("AddDocumentMovements")}
                />
            )}
        </NativeBaseProvider>
    );
};

export default ListDocumentMovementsScreen;