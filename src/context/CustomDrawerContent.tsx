import React, {useState} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {VStack, Text, Pressable, Icon, Divider, Box, Button, HStack} from 'native-base';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import AdminDashboardScreen from "../screens/dashboards/AdminDashboardScreen";
import ListUsersScreen from "../screens/users/ListUsersScreen";


const Stack = createStackNavigator();

const CustomDrawerContent = (props) => {
    const {user} = props;
    const navigation = useNavigation();
    const [expandedMenu, setExpandedMenu] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    console.log(navigation);

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('usuario');
            setIsLoggedIn(false);
            navigation.navigate("Login")// Actualiza el estado de la sesión
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };



    const toggleSubMenu = (menu) => {
        setExpandedMenu(expandedMenu === menu ? null : menu);
    };

    return (
        <DrawerContentScrollView {...props} >
            <VStack space={4} px={5} py={8} bg="primary.500">
                <Text fontSize="xl" color="white" bold>
                    Menu
                </Text>
            </VStack>

            <VStack space={4} mt={5} px={4}>
                <Pressable onPress={() => navigation.navigate('AdminDashboard')}>
                    <HStack alignItems="center" space={3}>
                        <Icon as={Ionicons} name="home" size={6} color="primary.500"/>
                        <Text fontSize="md">Home</Text>
                    </HStack>
                </Pressable>

                {user?.rol === 'administrador' && (
                    <>
                        {/* Gestión de Usuarios */}
                        <Pressable onPress={() => toggleSubMenu('usuarios')}>
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="people" size={6} color="primary.500"/>
                                <Text fontSize="md">Gestión de Usuarios</Text>
                            </HStack>
                        </Pressable>
                        {expandedMenu === 'usuarios' && (
                            <VStack pl={8} space={2}>
                                <Pressable onPress={() => navigation.navigate('ListUsers')}>
                                    <Text fontSize="sm">🔹 Listar Usuarios</Text>
                                </Pressable>
                                <Pressable onPress={() => navigation.navigate('AddUser')}>
                                    <Text fontSize="sm">🔹 Crear Usuario</Text>
                                </Pressable>
                            </VStack>
                        )}
                        {/* Gestión de Documentos */}
                        <Pressable onPress={() => toggleSubMenu('documentos')}>
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="document-text" size={6} color="primary.500"/>
                                <Text fontSize="md">Gestión de Documentos</Text>
                            </HStack>
                        </Pressable>
                        {expandedMenu === 'documentos' && (
                            <VStack pl={8} space={2}>
                                <Pressable onPress={() => navigation.navigate('ListDocuments')}>
                                    <Text fontSize="sm">🔹 Listar Documentos</Text>
                                </Pressable>
                                <Pressable onPress={() => navigation.navigate('AddDocument')}>
                                    <Text fontSize="sm">🔹 Agregar Documento</Text>
                                </Pressable>
                            </VStack>
                        )}
                        {/* Gestión de RfidTags */}
                        <Pressable onPress={() => toggleSubMenu('rfidTags')}>
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="pricetag-outline" size={6} color="primary.500"/>
                                <Text fontSize="md">Gestión de Etiquetas Rfid</Text>
                            </HStack>
                        </Pressable>
                        {expandedMenu === 'rfidTags' && (
                            <VStack pl={8} space={2}>
                                <Pressable onPress={() => navigation.navigate('ListRfidTags')}>
                                    <Text fontSize="sm">🔹 Listar Etiqueta Rfid</Text>
                                </Pressable>
                                <Pressable onPress={() => navigation.navigate('AddRfidTags')}>
                                    <Text fontSize="sm">🔹 Agregar Etiqueta Rfid</Text>
                                </Pressable>
                            </VStack>
                        )}

                        {/* Gestión de Tarjetas RFID */}
                        <Pressable onPress={() => toggleSubMenu('rfidCards')}>
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="Cards" size={6} color="primary.500"/>
                                <Text fontSize="md">Gestión de Tarjetas Rfid</Text>
                            </HStack>
                        </Pressable>
                        {expandedMenu === 'rfidCards' && (
                            <VStack pl={8} space={2}>
                                <Pressable onPress={() => navigation.navigate('ListRfidCards')}>
                                    <Text fontSize="sm">🔹 Listar Tarjetas RFID</Text>
                                </Pressable>
                                <Pressable onPress={() => navigation.navigate('AddRfidCards')}>
                                    <Text fontSize="sm">🔹 Agregar Tarjetas RFID</Text>
                                </Pressable>
                            </VStack>
                        )}

                        {/* Gestión de Accesos */}
                        <Pressable onPress={() => toggleSubMenu('accessHistory')}>
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="time-outline" size={6} color="primary.500"/>
                                <Text fontSize="md">Acceso</Text>
                            </HStack>
                        </Pressable>
                        {expandedMenu === 'accessHistory' && (
                            <VStack pl={8} space={2}>
                                <Pressable onPress={() => navigation.navigate('ListAccessHistory')}>
                                    <Text fontSize="sm">🔹 Listar Acceso</Text>
                                </Pressable>
                            </VStack>
                        )}

                        {/* Gestión de Adminitradores */}
                        <Pressable onPress={() => toggleSubMenu('administrator')}>
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="administrator" size={6} color="primary.500"/>
                                <Text fontSize="md">Gestión de Administrador</Text>
                            </HStack>
                        </Pressable>
                        {expandedMenu === 'administrator' && (
                            <VStack pl={8} space={2}>
                                <Pressable onPress={() => navigation.navigate('ListAdministrator')}>
                                    <Text fontSize="sm">🔹 Listar Administradores</Text>
                                </Pressable>
                                <Pressable onPress={() => navigation.navigate('AddAdministrator')}>
                                    <Text fontSize="sm">🔹 Agregar Administrador</Text>
                                </Pressable>
                            </VStack>
                        )}

                        {/* Gestión de DocumentMovements */}
                        <Pressable onPress={() => toggleSubMenu('documentMovements')}>
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="documentMovements" size={6} color="primary.500"/>
                                <Text fontSize="md">Gestión Movimientos</Text>
                            </HStack>
                        </Pressable>
                        {expandedMenu === 'documentMovements' && (
                            <VStack pl={8} space={2}>
                                <Pressable onPress={() => navigation.navigate('ListDocumentMovements')}>
                                    <Text fontSize="sm">🔹 Movimientos de Documentos</Text>
                                </Pressable>
                                <Pressable onPress={() => navigation.navigate('AddDocumentMovement')}>
                                    <Text fontSize="sm">🔹 Agregar Movimiento </Text>
                                </Pressable>
                            </VStack>
                        )}

                    </>
                )}

                <Divider my={2}/>

                <Button colorScheme="red" mt={4} onPress={logout}
                        leftIcon={<Icon as={Ionicons} name="log-out" size={5} color="white"/>}>
                    Cerrar Sesión
                </Button>
            </VStack>
        </DrawerContentScrollView>
    );
};

export default CustomDrawerContent;