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

const ListAdministratorScreen = () => {
    const [administrators, setAdministrators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAdministrator, setSelectedAdministrator] = useState(null);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();

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


    if (loading) return <ActivityIndicator size="large" color="#007bff"/>;
    if (error) return <Text style={{color: 'red', padding: 10}}>Error: {error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <HStack alignItems="center" mb={4}>
                        <Ionicons name="person-circle-outline" size={28} color="#003469"/>
                        <Text fontSize="xl" fontWeight="bold" ml={2} color="primary.500">
                            Lista de Administradores
                        </Text>
                    </HStack>

                    {loading ? (
                        <Spinner size="lg" color="primary.500"/>
                    ) : (
                        <FlatList
                            data={administrators}
                            keyExtractor={(item) => item.ID_Admin.toString()}
                            renderItem={({item}) => (
                                <Box bg="white" p={4} mb={3} borderRadius="lg" shadow={2}>
                                    <HStack space={3} alignItems="center">
                                        <Avatar bg="primary.400" size="md">
                                            {item.ID_Admin[0]}
                                        </Avatar>
                                        <VStack flex={1}>
                                            <Text fontSize="md" fontWeight="bold">
                                                {item.Nombre}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {item.ID_Usuario}
                                            </Text>
                                            <Text fontSize="xs" color="gray.400">
                                                {item.Nivel_Permiso}
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
        </NativeBaseProvider>
    );
};

export default ListAdministratorScreen;
