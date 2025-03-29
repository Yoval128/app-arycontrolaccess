import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    NativeBaseProvider,
    ScrollView,
    Box,
    FlatList,
    HStack,
    VStack,
    Avatar,
    Spinner,
    IconButton,
    AlertDialog,
    Button
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ActivityIndicator} from "react-native";
import {useAuth} from "../../context/AuthProvider";

const ListAdministratorScreen = () => {
    const [administrators, setAdministrators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAdministrator, setSelectedAdministrator] = useState(null);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const [usuarios, setUsuarios] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        fetchAdministrators();
    }, []);

    useEffect(() => {
        if (route.params?.refresh) {
            fetchAdministrators(); // Recargar los administradores si el parámetro `refresh` es true
        }
    }, [route.params?.refresh]);

    const fetchAdministrators = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/administrators/administrators-list`);
            if (!response.ok) {
                throw new Error('Error al obtener los administradores');
            }
            const data = await response.json();
            setAdministrators(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteAdministrator = async (id) => {
        if (!id) {
            console.error("ID de administrador no válido");
            return;
        }
        setIsOpen(false);
        try {
            const response = await fetch(`${API_URL}/api/administrators/delete-administrator/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setAdministrators(administrators.filter(admin => admin.ID_Admin !== id));
            } else {
                const errorData = await response.json();
                console.error(errorData.message);
                setError("Error al eliminar administrador: " + errorData.message);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            setError("Error de conexión: " + error.message);
        }
    };

    // Función para obtener los usuarios
    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/list-users`);
            const data = await response.json();
            // Formateamos los datos de usuarios
            const usuariosList = data.map((usuario) => ({
                label: `${usuario.Nombre} ${usuario.Apellido}`, // Mostrar el nombre completo
                value: usuario.ID_Usuario // El valor será el ID de usuario
            }));
            setUsuarios(usuariosList);
        } catch (error) {
            toast.show({
                title: "Error",
                description: "No se pudo obtener la lista de usuarios.",
                status: "error"
            });
        }
    };

    useEffect(() => {
        fetchUsuarios(); // Cargar los usuarios cuando la pantalla se monta
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#007bff"/>;
    if (error) return <Text style={{color: 'red', padding: 10}}>Error: {error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <HStack alignItems="center" mb={6} bg="primary.500" p={4} borderRadius="md" shadow={3}
                            justifyContent="center">
                        <Ionicons name="person-circle-outline" size={28} color="#003469"/>
                        <Text fontSize="xl" fontWeight="bold" ml={2} color="white">
                            Lista de Administradores
                        </Text>
                    </HStack>

                    {loading ? (
                        <Spinner size="lg" color="white"/>
                    ) : (
                        <FlatList
                            data={administrators}
                            keyExtractor={(item) => item.ID_Admin.toString()}
                            renderItem={({item}) => (
                                <Box bg="white" p={4} mb={3} borderRadius="lg" shadow={2}>
                                    <HStack space={3} alignItems="center">
                                        <Avatar bg="primary.400" size="md">
                                            {item.Nombre.charAt(0)}{item.Apellido.charAt(0)}
                                        </Avatar>
                                        <VStack flex={1}>
                                            <Text fontSize="md" fontWeight="bold">
                                                {item.Nombre} {item.Apellido}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {item.Cargo}
                                            </Text>
                                            <Text fontSize="xs" color="gray.400">
                                                Permisos: {item.Nivel_Permiso}
                                            </Text>
                                        </VStack>
                                        <HStack space={2}>
                                            <IconButton
                                                icon={<Ionicons name="eye-outline" size={20} color="blue"/>}
                                                onPress={() => navigation.navigate("DetailAdministrator", {admin_id: item.ID_Admin})}
                                            />
                                            <IconButton
                                                icon={<Ionicons name="pencil-outline" size={20} color="green"/>}
                                                onPress={() => navigation.navigate("EditAdministrator", {admin_id: item.ID_Admin})}
                                            />
                                            <IconButton
                                                icon={<Ionicons name="trash-outline" size={20} color="red"/>}
                                                onPress={() => {
                                                    setSelectedAdministrator(item.ID_Admin);
                                                    setIsOpen(true);
                                                }}
                                            />

                                        </HStack>
                                    </HStack>
                                </Box>
                            )}
                        />
                    )}
                </Box>
            </ScrollView>

            {/* Modal de Confirmación para Eliminar */}
            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <AlertDialog.Content>
                    <AlertDialog.Header>Eliminar Administrador</AlertDialog.Header>
                    <AlertDialog.Body>¿Estás seguro de que deseas eliminar este administrador?</AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button variant="ghost" onPress={() => setIsOpen(false)}>Cancelar</Button>
                        <Button colorScheme="danger"
                                onPress={() => deleteAdministrator(selectedAdministrator)}>Eliminar</Button>
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

export default ListAdministratorScreen;
