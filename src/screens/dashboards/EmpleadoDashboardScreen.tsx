import {View, Text, NativeBaseProvider, ScrollView, Box, HStack, VStack, Spinner, Heading, Button} from 'native-base';
import customTheme from "../../themes";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native'; // Importamos el hook useFocusEffect

const EmpleadoDashboardScreen = () => {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    // Función para obtener los datos del usuario
    const getUserData = async () => {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('usuario');

        if (token && userData) {
            setUser(JSON.parse(userData));
        } else {
            navigation.replace('Login');
        }
    };

    // useEffect para cargar los datos al inicio
    useEffect(() => {
        getUserData();
    }, []);

    // useFocusEffect para recargar los datos cada vez que la pantalla se enfoque
    useFocusEffect(
        React.useCallback(() => {
            // Llamamos a la función para obtener los datos cada vez que la pantalla se enfoque
            getUserData();

            // Optional: Retorno de limpieza si se necesita
            return () => {
                setUser(null);  // Limpiar el estado si es necesario al dejar la pantalla
            };
        }, [])
    );

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    {/* Header */}
                    <HStack justifyContent="space-between" alignItems="center" mb={5} p={3} bg="primary.400"
                            borderRadius="lg" shadow={2}>
                        <HStack alignItems="center">
                            <Ionicons name="person-circle" size={40} color="white"/>
                            <VStack ml={3}>
                                {user ? (
                                    <Text fontSize="lg" bold color="white">{user.nombre}</Text>
                                ) : (
                                    <Spinner size="sm"/>
                                )}
                                {user ? (
                                    <Text fontSize="md" color="white">{user.rol}</Text>
                                ) : (
                                    <Spinner size="sm"/>
                                )}
                            </VStack>
                        </HStack>
                    </HStack>

                    <Heading size="md" mb={3} color="secondary.500">📊 Estadísticas en Tiempo Real</Heading>
                    <HStack space={3} mb={5}>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1}>
                            <Text bold textAlign="center">Estado Documentos</Text>
                            <Text fontSize="2xl" color="status.success" textAlign="center">0</Text>
                        </Box>
                    </HStack>
                    <HStack space={3} mb={5}>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1}>
                            <Text bold>Ubicacion accesos</Text>
                            <Text fontSize="2xl">35</Text>
                        </Box>
                    </HStack>

                    {/* Accesos Rápidos */}
                    <Heading size="md" mb={3} color="secondary.500">🛠 Accesos Rápidos</Heading>

                    <HStack space={3} mb={5}>
                        <Button
                            leftIcon={<Ionicons name="cloud-upload" size={20} color="white"/>}
                            onPress={() => navigation.navigate('ExcelUploadDasboard')}>
                            Subir Documento
                        </Button>
                    </HStack>

                    {/* Alertas y Notificaciones */}
                    <Heading size="md" mb={3} color="accent.500">⚠️ Alertas y Notificaciones</Heading>
                    <HStack space={3} mb={5}>
                        <Button leftIcon={<Ionicons name="clipboard" size={20} color="white"/>}>Documentos pendientes de
                            revisión</Button>
                    </HStack>
                    <HStack space={3} mb={5}>
                        <Button leftIcon={<Ionicons name="alert-circle" size={20} color="white"/>}>Intentos de acceso no
                            autorizado</Button>
                    </HStack>
                    <HStack space={3} mb={5}>
                        <Button leftIcon={<Ionicons name="card" size={20} color="white"/>}>Tarjetas expiradas o
                            desactivadas</Button>
                    </HStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    )
};

export default EmpleadoDashboardScreen;
