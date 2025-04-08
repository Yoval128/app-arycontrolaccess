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
    useColorModeValue, Menu
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ActivityIndicator} from "react-native";
import {useAuth} from "../../context/AuthProvider";
import {useTranslation} from "react-i18next";

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


    useEffect(() => {
        fetchAdministrators();
    }, []);

    useEffect(() => {
        if (route.params?.refresh) {
            fetchAdministrators();
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

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/list-users`);
            const data = await response.json();
            const usuariosList = data.map((usuario) => ({
                label: `${usuario.Nombre} ${usuario.Apellido}`,
                value: usuario.ID_Usuario
            }));
            setUsuarios(usuariosList);
        } catch (error) {
            console.error("No se pudo obtener la lista de usuarios:", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#007bff"/>;
    if (error) return <Text style={{color: 'red', padding: 10}}>Error: {error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea p={5} flex={1}>
                <HStack alignItems="center" mb={6} bg={headerBg} p={4} borderRadius="md" shadow={3}
                        justifyContent="center">
                    <Ionicons name="person-circle-outline" size={28} color="white"/>
                    <Text fontSize="xl" fontWeight="bold" ml={2} color="white">{t('listAdministrator.header.title')}
                    </Text>
                </HStack>

                {loading ? (
                    <Spinner size="lg" color="primary.500"/>
                ) : (
                    <FlatList
                        data={administrators}
                        keyExtractor={(item) => item.ID_Admin.toString()}
                        renderItem={({item}) => (
                            <Box bg={cardBg} p={4} mb={3} borderRadius="lg" shadow={2}>
                                <HStack space={3} alignItems="center">
                                    <Avatar bg="primary.400" size="md">
                                        {item.Nombre.charAt(0)}{item.Apellido.charAt(0)}
                                    </Avatar>
                                    <VStack flex={1}>
                                        <Text fontSize="md" fontWeight="bold" color={textColor}>
                                            {item.Nombre || "Nombre no disponible"} {item.Apellido || "Apellido no disponible"}
                                        </Text>
                                        <Text fontSize="sm" color={secondaryTextColor}>
                                            {item.Cargo ? item.Cargo : "Cargo no disponible"}
                                        </Text>
                                        <Text fontSize="xs" color={secondaryTextColor}>
                                            Permisos: {item.Nivel_Permiso}
                                        </Text>
                                    </VStack>
                                    <HStack space={2}>
                                        {user.role === 'administrador' && (
                                            <>
                                                <IconButton
                                                    icon={<Ionicons name="eye-outline" size={20}
                                                                    color="#3182CE"/>}  // Azul fijo
                                                    onPress={() => navigation.navigate("DetailAdministrator", {admin_id: item.ID_Admin})}
                                                />
                                                <IconButton
                                                    icon={<Ionicons name="pencil-outline" size={20}
                                                                    color="#38A169"/>}  // Verde fijo
                                                    onPress={() => navigation.navigate("EditAdministrator", {admin_id: item.ID_Admin})}
                                                />
                                                <IconButton
                                                    icon={<Ionicons name="trash-outline" size={20}
                                                                    color="#E53E3E"/>}  // Rojo fijo
                                                    onPress={() => {
                                                        setSelectedAdministrator(item.ID_Admin);
                                                        setIsOpen(true);
                                                    }}
                                                /> </>
                                        )}
                                        {user.role === 'empleado' && (
                                            <>
                                                <IconButton
                                                    icon={<Ionicons name="eye-outline" size={20}
                                                                    color="#3182CE"/>}  // Azul fijo
                                                    onPress={() => navigation.navigate("DetailAdministrator", {admin_id: item.ID_Admin})}
                                                />
                                                <IconButton
                                                    icon={<Ionicons name="pencil-outline" size={20}
                                                                    color="#38A169"/>}  // Verde fijo
                                                    onPress={() => navigation.navigate("EditAdministrator", {admin_id: item.ID_Admin})}
                                                />
                                            </>
                                        )}
                                        {user.role === 'invitado' && (
                                            <>
                                                <IconButton
                                                    icon={<Ionicons name="eye-outline" size={20}
                                                                    color="#3182CE"/>}  // Azul fijo
                                                    onPress={() => navigation.navigate("DetailAdministrator", {admin_id: item.ID_Admin})}
                                                />
                                            </>
                                        )}
                                    </HStack>
                                </HStack>
                            </Box>
                        )}
                    />
                )}
            </Box>


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

            {/* Botón para agregar nuevo administrador */}
            {user.role === 'administrador' && (
                <IconButton
                    icon={<Ionicons name="add" size={40} color="white"/>}
                    bg={fabBg}
                    borderRadius="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                    onPress={() => navigation.navigate("AddAdministrator")}
                />
            )}
        </NativeBaseProvider>
    );
};

export default ListAdministratorScreen;