import React, { useEffect, useState } from "react";
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
    Select,
    CheckIcon,
    FormControl
} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { StackActions } from '@react-navigation/native';

const ListUsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const [itemsPerPage, setItemsPerPage] = useState(8); // Definir cuántos items por página
    const [filter, setFilter] = useState(""); // Filtro para búsqueda (nombre, correo, estado)
    const [filterType, setFilterType] = useState("nombre"); // Tipo de filtro: nombre, correo, estado
    const { user } = useAuth();

    const navigation = useNavigation();
    const route = useRoute();
    navigation.dispatch(StackActions.replace('ListUser'));

    useEffect(() => {
        fetchUsers();
    }, [currentPage]); // Solo recargar cuando cambie la página

    useEffect(() => {
        if (route.params?.refresh) {
            fetchUsers(); // Recargar los usuarios cuando el parámetro `refresh` es true
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
            setFilteredUsers(data); // Inicialmente, mostrar todos los usuarios
        } catch (error) {
            setError(error.message); // Manejo de error
        } finally {
            setLoading(false);
        }
    };

    // Filtrar los usuarios según la entrada del usuario
    // Filtrar los usuarios según la entrada del usuario
    const filterUsers = () => {
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
        setFilter(""); // Restablecer el filtro
        setFilteredUsers(users); // Mostrar todos los usuarios
    };

    const deleteUser = async (id) => {
        setIsOpen(false);
        try {
            await fetch(`${API_URL}/api/users/delete-user/${id}`, { method: "DELETE" });
            setUsers(users.filter(user => user.ID_Usuario !== id));
            setFilteredUsers(filteredUsers.filter(user => user.ID_Usuario !== id)); // Actualizar la lista filtrada
        } catch (error) {
            setError("Error al eliminar usuario: " + error.message);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#007bff" />;
    if (error) return <Text style={{ color: 'red', padding: 10 }}>Error: {error}</Text>;

    // Calcular la paginación
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage); // Total de páginas
    const startIndex = (currentPage - 1) * itemsPerPage; // Índice de inicio para la página actual
    const paginatedData = filteredUsers.slice(startIndex, startIndex + itemsPerPage); // Obtener los usuarios para la página actual

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <HStack alignItems="center" mb={6} bg="primary.500" p={4} borderRadius="md" shadow={3} justifyContent="center">
                        <Ionicons name="person-outline" size={32} color="white" />
                        <Text fontSize="2xl" fontWeight="bold" ml={3} color="white">
                            Lista de Usuarios
                        </Text>
                    </HStack>

                    {/* Filtro y opciones de búsqueda */}
                    <HStack mb={4} space={3} alignItems="center">
                        <IconButton
                            icon={<Ionicons name="filter" size={24} color="black" />}
                            onPress={() => { /* Puedes añadir más lógica aquí si lo deseas */ }}
                        />
                        <Text>Filtrar por</Text>

                        {/* Menú para seleccionar el tipo de filtro */}
                        <Select
                            selectedValue={filterType}
                            minWidth={150}
                            onValueChange={value => setFilterType(value)}
                            _selectedItem={{ bg: "teal.600", color: "white" }}
                        >
                            <Select.Item label="Nombre" value="nombre" />
                            <Select.Item label="Correo" value="correo" />
                            <Select.Item label="Estado" value="estado" />
                        </Select>

                        {/* Campo de texto para ingresar el filtro */}
                        <FormControl flex={1}>
                            <Input
                                placeholder={`Ingrese ${filterType === "estado" ? "activo/inactivo" : filterType}`}
                                value={filter}
                                onChangeText={setFilter}
                            />
                        </FormControl>

                        {/* Botón de búsqueda */}
                        <Button
                            onPress={filterUsers} // Llama a la función de filtrado
                            leftIcon={<Ionicons name="search" size={20} color="white" />}
                            bg="primary.500"
                            _pressed={{ bg: "primary.600" }}
                        >
                            Buscar
                        </Button>

                        {/* Botón de limpiar filtro */}
                        <Button
                            onPress={clearFilter} // Llama a la función para limpiar el filtro
                            leftIcon={<Ionicons name="close" size={20} color="white" />}
                            bg="secondary.500"
                            _pressed={{ bg: "secondary.600" }}>
                            Limpiar
                        </Button>
                    </HStack>

                    {loading ? (
                        <Spinner size="lg" color="primary.500" />
                    ) : (
                        <FlatList
                            data={paginatedData} // Usar la data paginada
                            keyExtractor={(item) => item.ID_Usuario.toString()}
                            renderItem={({ item }) => (
                                <Box bg="white" p={4} mb={3} borderRadius="lg" shadow={2}>
                                    <HStack space={3} alignItems="center">
                                        <Avatar
                                            bg="primary.400"
                                            size="md"
                                            borderColor={item?.Estado === 'activo' ? 'green.400' : 'red.400'}
                                            borderWidth={3} // Puedes ajustar el grosor del borde según lo que prefieras
                                        >
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
                                                        icon={<Ionicons name="eye-outline" size={20} color="blue" />}
                                                        onPress={() => navigation.navigate("DetailUser", { usuario_id: item.ID_Usuario })}
                                                    />
                                                    <IconButton
                                                        icon={<Ionicons name="pencil-outline" size={20} color="green" />}
                                                        onPress={() => navigation.navigate("EditUser", { usuario_id: item.ID_Usuario })}
                                                    />
                                                    <IconButton
                                                        icon={<Ionicons name="trash-outline" size={20} color="red" />}
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
                    icon={<Ionicons name="add" size={40} color="white" />}
                    bg="primary.500"
                    borderRadius="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                    onPress={() => navigation.navigate("AddUser")} // Asegúrate de tener esta ruta para agregar usuarios
                />
            )}
        </NativeBaseProvider>
    );
};

export default ListUsersScreen;