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
    Button
} from "native-base";
import {API_URL, SOCKET_IO} from "@env";
import customTheme from "../../themes/index";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuth} from "../../context/AuthProvider";
import io from 'socket.io-client';  // Asegúrate de tener Socket.IO instalado

const ListRfidCardScreen = () => {
    const [tarjetas, setTarjetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTarjeta, setSelectedTarjeta] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const toast = useToast();
    const navigation = useNavigation();
    const route = useRoute();
    const {user} = useAuth();

    // Crear la conexión al servidor ESP32 mediante Socket.IO
    const socket = io(SOCKET_IO);

    socket.on('connect', () => {
        console.log('Conectado al servidor de socket en:', SOCKET_IO);
    });

    // Obtener tarjetas RFID
    const fetchTarjetas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/rfidCards/rfid-list`);
            const data = await response.json();
            setTarjetas(data);
        } catch (error) {
            console.error("Error al obtener tarjetas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTarjetas();
        if (route.params?.shouldReload) {
            fetchTarjetas();
        }

        // Limpiar la conexión cuando el componente se desmonte
        return () => {
            socket.disconnect();
        };
    }, [route.params?.shouldReload]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rfidCards/delete-rfid/${selectedTarjeta.ID_Tarjeta_RFID}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.show({description: "Tarjeta eliminada con éxito."});
                fetchTarjetas();
            } else {
                toast.show({description: "Error al eliminar la tarjeta."});
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

    // Total de páginas
    const totalPages = Math.ceil(tarjetas.length / itemsPerPage);

    // Calcular los datos para la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = tarjetas.slice(startIndex, startIndex + itemsPerPage);

    // Función para cambiar el modo en el ESP32
    // Función para cambiar el modo en el ESP32 (usando HTTP)
    const handleSetMode = async (mode) => {
        try {
            const response = await fetch(`http://192.168.1.9/setMode?mode=${mode}`);
            const text = await response.text();
            toast.show({
                description: `Modo cambiado a: ${mode}`,
                status: "success",
            });
            console.log("Respuesta del ESP32:", text);
        } catch (error) {
            toast.show({
                description: "Error al cambiar el modo",
                status: "error",
            });
            console.error("Error:", error);
        }
    };
    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}} keyboardShouldPersistTaps="handled">
                <VStack flex={1} p={5}>
                    <HStack alignItems="center" mb={6} bg="primary.500" p={4} borderRadius="md" shadow={3}
                            justifyContent="center">
                        <Ionicons name="card-outline" size={25} color="white"/>
                        <Text fontSize="2xl" fontWeight="bold" ml={3} color="white">
                            Lista de Tarjetas RFID
                        </Text>
                    </HStack>

                    <FlatList
                        data={paginatedData}
                        keyExtractor={(item) => item.ID_Tarjeta_RFID.toString()}
                        renderItem={({item}) => (
                            <HStack justifyContent="space-between" alignItems="center" p={3} mb={2} bg="white"
                                    borderRadius="md" shadow={2}>
                                <VStack>
                                    <Text fontSize="md" fontFamily="Poppins-Bold">{item.Codigo_RFID}</Text>
                                    <Badge
                                        colorScheme={item.Estado === "Activo" ? "success" : "danger"}>{item.Estado}</Badge>
                                </VStack>
                                <HStack space={2}>
                                    {user.role === 'administrador' && (
                                        <>

                                            <IconButton
                                                icon={<Ionicons name="eye-outline" size={20} color="blue"/>}
                                                onPress={() => navigation.navigate("DetailRfidCards", {tarjeta_id: item.ID_Tarjeta_RFID})}
                                            />
                                            <IconButton
                                                icon={<Ionicons name="pencil-outline" size={20} color="green"/>}
                                                onPress={() => navigation.navigate("EditRfidCards", {tarjeta_id: item.ID_Tarjeta_RFID})}
                                            />
                                            <IconButton
                                                icon={<Ionicons name="trash-outline" size={20} color="red"/>}
                                                onPress={() => {
                                                    setSelectedTarjeta(item);
                                                    setIsOpen(true);
                                                }}
                                            />
                                        </>
                                    )}
                                    {user.role === 'empleado' && (
                                        <>

                                            <IconButton
                                                icon={<Ionicons name="eye-outline" size={20} color="blue"/>}
                                                onPress={() => navigation.navigate("DetailRfidCards", {tarjeta_id: item.ID_Tarjeta_RFID})}
                                            />
                                            <IconButton
                                                icon={<Ionicons name="pencil-outline" size={20} color="green"/>}
                                                onPress={() => navigation.navigate("EditRfidCards", {tarjeta_id: item.ID_Tarjeta_RFID})}
                                            />
                                        </>
                                    )}
                                    {user.role === 'invitado' && (
                                        <>

                                            <IconButton
                                                icon={<Ionicons name="eye-outline" size={20} color="blue"/>}
                                                onPress={() => navigation.navigate("DetailRfidCards", {tarjeta_id: item.ID_Tarjeta_RFID})}
                                            />
                                        </>
                                    )}
                                </HStack>
                            </HStack>
                        )}
                    />

                    <HStack justifyContent="center" space={3} mt={4}>
                        <Button onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                isDisabled={currentPage === 1}>Anterior</Button>
                        <Text>{currentPage} de {totalPages}</Text>
                        <Button onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                isDisabled={currentPage === totalPages}>Siguiente</Button>
                    </HStack>
                </VStack>
            </ScrollView>

            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <AlertDialog.Content>
                    <AlertDialog.Header>Eliminar Tarjeta</AlertDialog.Header>
                    <AlertDialog.Body>¿Estás seguro de que deseas eliminar esta tarjeta?</AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button variant="ghost" onPress={() => setIsOpen(false)}>Cancelar</Button>
                        <Button colorScheme="danger" onPress={handleDelete}>Eliminar</Button>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>

            {/* Botón flotante */}
            {user.role === 'administrador' && (
                <IconButton
                    icon={<Ionicons name="add" size={40} color="white"/>}
                    bg="primary.500"
                    borderRadius="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                    onPress={async () => {
                        await handleSetMode("newCard"); // Cambia el modo antes de navegar
                        navigation.navigate("AddRfidCard");
                    }}
                />
            )}
            {user.role === 'empleado' && (
                <IconButton
                    icon={<Ionicons name="add" size={40} color="white"/>}
                    bg="primary.500"
                    borderRadius="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                    onPress={async () => {
                        await handleSetMode("newCard"); // Cambia el modo antes de navegar
                        navigation.navigate("AddRfidCard");
                    }}
                />
            )}
        </NativeBaseProvider>
    );
};

export default ListRfidCardScreen;
