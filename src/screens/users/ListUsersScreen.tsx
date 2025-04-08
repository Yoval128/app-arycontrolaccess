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
    Icon, Heading, Badge,
    useColorModeValue,
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {ActivityIndicator} from "react-native";
import {useAuth} from "../../context/AuthProvider";
import {useTranslation} from "react-i18next";
import Header from "../../components/Header";

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

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();
    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
    const headerBg = useColorModeValue("primary.500", "primary.700");
    const iconColor = useColorModeValue("gray.600", "gray.300");
    const fabBg = useColorModeValue("primary.500", "primary.600");
    const buttonBg = useColorModeValue("white", "red");

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    useFocusEffect(
        React.useCallback(() => {
            fetchUsers(); // Esta función se ejecutará cada vez que la pantalla reciba el foco
        }, [])
    );

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
            <ScrollView>
            <Box safeArea p={5} flex={1}>
                {/* Header */}
                <Header title="Usuarios" iconName="people" />
                {/* Filtro y opciones de búsqueda */}
                <HStack mb={2} space={4} alignItems="center" bg={cardBg} p={3} borderRadius="md">
                    {/* Campo de texto para ingresar el filtro */}
                    <FormControl flex={1}>
                        <Input
                            placeholder={t('listUsers.placeholders.searchInput')}
                            value={filter}
                            onChangeText={setFilter}
                            bg={useColorModeValue("gray.100", "gray.700")} // Fondo adaptable
                            color={useColorModeValue("gray.800", "white")} // Texto adaptable
                            placeholderTextColor={useColorModeValue("gray.500", "gray.300")} // Placeholder adaptable
                            borderColor={useColorModeValue("primary.500", "primary.300")}
                            _focus={{
                                borderColor: useColorModeValue("primary.600", "primary.400"),
                                bg: useColorModeValue("gray.200", "gray.600"),
                            }}
                        />
                    </FormControl>

                    {/* Botón de búsqueda */}
                    <Button
                        onPress={filterUsers}
                        leftIcon={<Icon as={Ionicons} name="search" size="sm" color="white"/>}
                        bg={useColorModeValue("primary.500", "primary.600")}
                        _pressed={{bg: useColorModeValue("primary.600", "primary.400")}}
                    />

                    {/* Botón de limpiar filtro */}
                    <Button
                        onPress={clearFilter}
                        leftIcon={<Icon as={Ionicons} name="close" size="sm" color="white"/>}
                        bg={useColorModeValue("secondary.500", "secondary.600")}
                        _pressed={{bg: useColorModeValue("secondary.600", "secondary.400")}}
                    />

                    {/* Menú desplegable */}
                    <Menu
                        trigger={triggerProps => (
                            <IconButton
                                {...triggerProps}
                                icon={<Icon as={Ionicons} name="ellipsis-vertical" size="sm" color={iconColor}/>}
                                variant="ghost"
                            />
                        )}
                    >
                        {user.role === 'administrador' && (
                            <>
                                <Menu.Item onPress={() => navigation.navigate("UploadExcelUsers")}>{t('listUsers.menu.uploadFile')}</Menu.Item>
                                <Menu.Item onPress={() => navigation.navigate("ExportPDFUser")}>{t('listUsers.menu.export')}</Menu.Item>
                            </>
                        )}
                        {user.role === 'empleado' && (
                            <>
                                <Menu.Item onPress={() => navigation.navigate("UploadExcelUsers")}>Subir
                                    archivo</Menu.Item>
                                <Menu.Item onPress={() => navigation.navigate("ExportPDFUser")}>Exportar</Menu.Item>
                            </>
                        )}
                        {user.role === 'invitado' && (
                            <>
                                <Menu.Item onPress={() => navigation.navigate("ExportPDFUser")}>Exportar</Menu.Item>
                            </>
                        )}
                    </Menu>
                </HStack>

                {loading ? (
                    <Spinner size="lg" color="primary.500"/>
                ) : (
                    <FlatList
                        data={paginatedData}
                        keyExtractor={(item) => item.ID_Usuario.toString()}
                        renderItem={({item}) => (
                            <Box bg={cardBg} p={4} mb={3} borderRadius="lg" shadow={2}>
                                <HStack space={3} alignItems="center">
                                    <Avatar bg="primary.400" size="md"
                                            borderColor={item?.Estado === 'activo' ? 'green.400' : 'red.400'}
                                            borderWidth={3}>
                                        {item.Nombre[0]}
                                    </Avatar>

                                    <VStack flex={1}>
                                        <Text fontSize="md" fontWeight="bold" color={textColor}>
                                            {item.Nombre} {item.Apellido}
                                        </Text>
                                        <Text fontSize="sm" color={secondaryTextColor}>
                                            {item.Cargo}
                                        </Text>
                                        <Text fontSize="xs" color={secondaryTextColor}>
                                            {item.Correo}
                                        </Text>
                                    </VStack>
                                    <HStack space={2}>
                                        {user.role === 'administrador' && (
                                            <>
                                                <IconButton
                                                    icon={<Ionicons name="eye-outline" size={20} color="#3182CE"/>}
                                                    onPress={() => navigation.navigate("DetailUser", {usuario_id: item.ID_Usuario})}
                                                />
                                                <IconButton
                                                    icon={<Ionicons name="pencil-outline" size={20} color="#38A169"/>}
                                                    onPress={() => navigation.navigate("EditUser", {usuario_id: item.ID_Usuario})}
                                                />
                                                <IconButton
                                                    icon={<Ionicons name="trash-outline" size={20} color="#E53E3E"/>}
                                                    onPress={() => {
                                                        setSelectedUser(item.ID_Usuario);
                                                        setIsOpen(true);
                                                    }}
                                                />
                                            </>
                                        )}
                                        {user.role === 'empleado' && (
                                            <>
                                                <IconButton
                                                    icon={<Ionicons name="eye-outline" size={20} color="#3182CE"/>}
                                                    onPress={() => navigation.navigate("DetailUser", {usuario_id: item.ID_Usuario})}
                                                />
                                                <IconButton
                                                    icon={<Ionicons name="pencil-outline" size={20} color="#38A169"/>}
                                                    onPress={() => navigation.navigate("EditUser", {usuario_id: item.ID_Usuario})}
                                                />
                                            </>
                                        )}
                                        {user.role === 'invitado' && (
                                            <>
                                                <IconButton
                                                    icon={<Ionicons name="eye-outline" size={20} color="#3182CE"/>}
                                                    onPress={() => navigation.navigate("DetailUser", {usuario_id: item.ID_Usuario})}
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
                            isDisabled={currentPage === 1}>{t('listUsers.buttons.previous')}</Button>
                    <Text>{currentPage} de {totalPages}</Text>
                    <Button onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            isDisabled={currentPage === totalPages}>{t('listUsers.buttons.next')}</Button>
                </HStack>
            </Box>

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
            {user.role === 'empleado' && (
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

            </ScrollView>
        </NativeBaseProvider>
    );
};

export default ListUsersScreen;