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
    Button,
    Menu,
    Input,
    FormControl,
    Icon
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ActivityIndicator} from "react-native";
import {useAuth} from "../../context/AuthProvider";
import {StackActions} from '@react-navigation/native';

const ListUsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [filter, setFilter] = useState("");
    const {user} = useAuth();

    const navigation = useNavigation();
    const route = useRoute();
    navigation.dispatch(StackActions.replace('ListUser'));

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    useEffect(() => {
        if (route.params?.refresh) {
            fetchUsers();
        }
    }, [route.params?.refresh]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/users/list-users`);
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para determinar el tipo de filtro automáticamente
    const determineFilterType = (input) => {
        if (input.includes("@")) {
            return "correo"; // Si contiene "@", es un correo
        } else if (input.toLowerCase() === "activo" || input.toLowerCase() === "inactivo") {
            return "estado"; // Si es "activo" o "inactivo", es un estado
        } else {
            return "nombre"; // En cualquier otro caso, es un nombre
        }
    };

    // Filtrar los usuarios según la entrada del usuario
    const filterUsers = () => {
        const filterType = determineFilterType(filter);
        let filteredData = [...users];

        if (filterType === "nombre") {
            filteredData = users.filter(user =>
                user.Nombre && user.Nombre.toLowerCase().includes(filter.toLowerCase())
            );
        } else if (filterType === "correo") {
            filteredData = users.filter(user =>
                user.Correo && user.Correo.toLowerCase().includes(filter.toLowerCase())
            );
        } else if (filterType === "estado") {
            filteredData = users.filter(user =>
                user.Estado && user.Estado.toLowerCase() === filter.toLowerCase()
            );
        }

        setFilteredUsers(filteredData);
    };

    // Limpiar el filtro y mostrar todos los usuarios
    const clearFilter = () => {
        setFilter("");
        setFilteredUsers(users);
    };

    const deleteUser = async (id) => {
        setIsOpen(false);
        try {
            await fetch(`${API_URL}/api/users/delete-user/${id}`, {method: "DELETE"});
            setUsers(users.filter(user => user.ID_Usuario !== id));
            setFilteredUsers(filteredUsers.filter(user => user.ID_Usuario !== id));
        } catch (error) {
            setError("Error al eliminar usuario: " + error.message);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#007bff"/>;
    if (error) return <Text style={{color: 'red', padding: 10}}>Error: {error}</Text>;

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <HStack alignItems="center" mb={6} bg="primary.500" p={4} borderRadius="md" shadow={3}
                            justifyContent="center">
                        <Ionicons name="person-outline" size={25} color="white"/>
                        <Text fontSize="2xl" fontWeight="bold" ml={3} color="white">
                            Lista de Usuarios
                        </Text>
                    </HStack>

                    {/* Filtro y opciones de búsqueda */}
                    <HStack mb={2} space={4} alignItems="center" backgroundColor={"white"}>
                        {/* Campo de texto para ingresar el filtro */}
                        <FormControl flex={1}>
                            <Input
                                placeholder="Buscar por nombre, correo o estado"
                                value={filter}
                                onChangeText={setFilter}
                            />
                        </FormControl>

                        {/* Botón de búsqueda */}
                        <Button
                            onPress={filterUsers}
                            leftIcon={<Ionicons name="search" size={12} color="white"/>}
                            bg="primary.500"
                            _pressed={{bg: "primary.600"}}
                        >
                        </Button>

                        {/* Botón de limpiar filtro */}
                        <Button
                            onPress={clearFilter}
                            leftIcon={<Ionicons name="close" size={12} color="white"/>}
                            bg="secondary.500"
                            _pressed={{bg: "secondary.600"}}
                        >
                        </Button>

                        {/* Menú desplegable para subir archivo y exportar */}
                        <Menu
                            trigger={triggerProps => (
                                <IconButton{...triggerProps}
                                           icon={<Ionicons name="ellipsis-vertical" size={22} color="primary.500"/>}
                                           variant="ghost"/>
                            )}>
                            <Menu.Item onPress={() => navigation.navigate("UploadExcelUsers")}>Subir archivo</Menu.Item>
                            <Menu.Item onPress={() => navigation.navigate("ExportPDFUser")}>Exportar</Menu.Item>
                        </Menu>
                    </HStack>

                    {loading ? (
                        <Spinner size="lg" color="primary.500"/>
                    ) : (
                        <FlatList
                            data={paginatedData}
                            keyExtractor={(item) => item.ID_Usuario.toString()}
                            renderItem={({item}) => (
                                <Box bg="white" p={4} mb={3} borderRadius="lg" shadow={2}>
                                    <HStack space={3} alignItems="center">
                                        <Avatar bg="primary.400" size="md"
                                                borderColor={item?.Estado === 'activo' ? 'green.400' : 'red.400'}
                                                borderWidth={3}>
                                            {item.Nombre[0]}
                                        </Avatar>

                                        <VStack flex={1}>
                                            <Text fontSize="md" fontWeight="bold">
                                                {item.Nombre} {item.Apellido}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {item.Cargo}
                                            </Text>
                                            <Text fontSize="xs" color="gray.400">
                                                {item.Correo}
                                            </Text>
                                        </VStack>
                                        <HStack space={2}>
                                            {user.role === 'administrador' && (
                                                <>
                                                    <IconButton
                                                        icon={<Ionicons name="eye-outline" size={20} color="blue"/>}
                                                        onPress={() => navigation.navigate("DetailUser", {usuario_id: item.ID_Usuario})}
                                                    />
                                                    <IconButton
                                                        icon={<Ionicons name="pencil-outline" size={20} color="green"/>}
                                                        onPress={() => navigation.navigate("EditUser", {usuario_id: item.ID_Usuario})}
                                                    />
                                                    <IconButton
                                                        icon={<Ionicons name="trash-outline" size={20} color="red"/>}
                                                        onPress={() => {
                                                            setSelectedUser(item.ID_Usuario);
                                                            setIsOpen(true);
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </HStack>
                                    </HStack>
                                </Box>
                            )}
                        />
                    )}

                    <HStack justifyContent="center" space={3} mt={4}>
                        <Button onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                isDisabled={currentPage === 1}>Anterior</Button>
                        <Text>{currentPage} de {totalPages}</Text>
                        <Button onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                isDisabled={currentPage === totalPages}>Siguiente</Button>
                    </HStack>
                </Box>
            </ScrollView>

            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <AlertDialog.Content>
                    <AlertDialog.Header>Eliminar Usuario</AlertDialog.Header>
                    <AlertDialog.Body>¿Estás seguro de que deseas eliminar este usuario?</AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button variant="ghost" onPress={() => setIsOpen(false)}>Cancelar</Button>
                        <Button colorScheme="danger" onPress={() => deleteUser(selectedUser)}>Eliminar</Button>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>

            {user.role === 'administrador' && (
                <IconButton
                    icon={<Ionicons name="add" size={40} color="white"/>}
                    bg="primary.500"
                    borderRadius="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                    onPress={() => navigation.navigate("AddUser")}
                />
            )}
        </NativeBaseProvider>
    );
};

export default ListUsersScreen;