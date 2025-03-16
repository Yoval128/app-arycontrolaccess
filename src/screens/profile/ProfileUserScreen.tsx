import {
    View,
    Text,
    HStack,
    VStack,
    Spinner,
    ScrollView,
    NativeBaseProvider,
    Box,
    Button,
    Avatar,
    Icon,
    useToast
} from "native-base";
import customTheme from "../../themes";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthProvider";

const ProfileUserScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();
    const { logout } = useAuth(); // Utiliza la función logout del contexto


    const getUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('usuario');

            if (token && userData) {
                setUser(JSON.parse(userData));
            } else {
                navigation.replace('Login');  // Usamos navigation con props
            }
        } catch (err) {
            setError('Error al cargar los datos del usuario');
            toast.show({
                title: "Error",
                description: "Hubo un problema al cargar los datos. Intenta nuevamente.",
                status: "error",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigation.replace('Login');
            toast.show({
                title: "Sesión cerrada",
                description: "Has cerrado sesión correctamente.",
                status: "success",
                duration: 3000,
            });
        } catch (err) {
            toast.show({
                title: "Error",
                description: "Hubo un problema al cerrar sesión. Intenta nuevamente.",
                status: "error",
                duration: 3000,
            });
        }
    };


    if (loading) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <Box safeArea p={5} bg="background.light" flex={1} alignItems="center" justifyContent="center">
                        <Spinner color="primary.500"/>
                        <Text>Cargando datos del usuario...</Text>
                    </Box>
                </ScrollView>
            </NativeBaseProvider>
        );
    }

    if (error) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <Box safeArea p={5} bg="background.light" flex={1} alignItems="center" justifyContent="center">
                        <Text color="danger.500">{error}</Text>
                        <Button onPress={() => getUserData()} colorScheme="secondary">Reintentar</Button>
                    </Box>
                </ScrollView>
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    {/* Header */}
                    <HStack justifyContent="space-between" alignItems="center" mb={5} p={3} bg="secondary.500"
                            borderRadius="lg" shadow={2}>
                        <HStack alignItems="center">
                            <Ionicons name="person-circle" size={40} color="white"/>
                            <Text color="white" ml={3}>Perfil de usuario</Text>
                        </HStack>
                    </HStack>

                    {/* User Info */}
                    <VStack space={4} alignItems="center">
                        {/* Avatar or Image */}
                        <Avatar size="xl" bg="teal.500" source={{uri: user?.photoUrl || ''}} />
                        <Text fontSize="2xl" fontWeight="bold">{user?.nombre} {user?.apellido}</Text>
                        <Text fontSize="md" color="gray.500">{user?.email}</Text>
                        <HStack alignItems="center" space={2}>
                            <Icon as={Ionicons} name="briefcase" size="sm" color="gray.500" />
                            <Text fontSize="lg" fontWeight="bold">{user?.rol}</Text>
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Icon as={Ionicons} name="call" size="sm" color="gray.500" />
                            <Text fontSize="lg" fontWeight="bold">{user?.telefono}</Text>
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Icon as={Ionicons} name="card" size="sm" color="gray.500" />
                            <Text fontSize="lg" fontWeight="bold">{user?.id_tarjeta_rfid}</Text>
                        </HStack>
                    </VStack>


                    {/* Log Out Button */}
                    <Button mt={5} onPress={handleLogout} colorScheme="danger">
                        Cerrar sesión
                    </Button>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default ProfileUserScreen;
