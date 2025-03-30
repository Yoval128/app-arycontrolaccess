import {
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
    useToast,
    Divider,
    Badge,
    Pressable,
    Alert,
    Heading
} from "native-base";
import customTheme from "../../themes";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthProvider";
import { API_URL } from '@env';

const ProfileUserScreen = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const toast = useToast();
    const navigation = useNavigation();
    const { logout } = useAuth();

    const getUserData = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('usuario');

            if (token && userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                // Opcional: Hacer una llamada a la API para obtener datos actualizados
                // await fetchUpdatedUserData(parsedUser.id);
            } else {
                navigation.replace('Login');
            }
        } catch (err) {
            console.error("Error loading user data:", err);
            setError('Error al cargar los datos del usuario');
            showToast("Error", "Hubo un problema al cargar los datos", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (title, description, status) => {
        toast.show({
            title,
            description,
            status,
            placement: "top",
            duration: 3000,
        });
    };

    const handleLogout = async () => {
        try {
            await logout();
            showToast("Sesión cerrada", "Has cerrado sesión correctamente", "success");
            navigation.replace('Login');
        } catch (err) {
            console.error("Logout error:", err);
            showToast("Error", "Hubo un problema al cerrar sesión", "error");
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUserData();
        });

        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50">
                    <VStack space={4} alignItems="center">
                        <Spinner size="lg" color="primary.500" />
                        <Text color="gray.600">Cargando tu perfil...</Text>
                    </VStack>
                </Box>
            </NativeBaseProvider>
        );
    }

    if (error) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50" p={5}>
                    <Alert w="100%" status="error" mb={4}>
                        <VStack space={2} flexShrink={1} w="100%">
                            <HStack flexShrink={1} space={2} justifyContent="space-between">
                                <HStack space={2} flexShrink={1}>
                                    <Alert.Icon mt="1" />
                                    <Text fontSize="md" color="coolGray.800">
                                        {error}
                                    </Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </Alert>
                    <Button onPress={getUserData} colorScheme="primary" leftIcon={<Icon as={Ionicons} name="refresh" />}>
                        Reintentar
                    </Button>
                </Box>
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} bg="gray.50">
                <Box safeArea p={4} flex={1}>
                    {/* Header */}
                    <VStack space={3} mb={6}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Heading size="xl" color="primary.600">Mi Perfil</Heading>
                            <Badge colorScheme="primary" borderRadius="full" px={3} py={1}>
                                <Text color="white" fontSize="xs">{user?.rol || 'Usuario'}</Text>
                            </Badge>
                        </HStack>
                        <Divider />
                    </VStack>

                    {/* User Info Section */}
                    <VStack space={4} mb={6} alignItems="center">
                        <Avatar
                            size="2xl"
                            bg="primary.500"
                            source={{ uri: user?.photoUrl }}
                            borderWidth={3}
                            borderColor="primary.200"
                        >
                            {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                        </Avatar>

                        <Heading size="lg" color="gray.800">
                            {user?.nombre} {user?.apellido}
                        </Heading>

                        <Badge colorScheme="blue" borderRadius="full" px={3}>
                            <Text>{user?.email}</Text>
                        </Badge>
                    </VStack>

                    {/* Details Section */}
                    <VStack space={4} mb={6} bg="white" p={4} borderRadius="lg" shadow={1}>
                        <Heading size="md" color="gray.700" mb={2}>Información Personal</Heading>

                        <HStack space={3} alignItems="center">
                            <Icon as={Ionicons} name="person" size={5} color="primary.500" />
                            <Text flex={1} color="gray.600">Nombre completo:</Text>
                            <Text bold>{user?.nombre} {user?.apellido}</Text>
                        </HStack>

                        <HStack space={3} alignItems="center">
                            <Icon as={Ionicons} name="mail" size={5} color="primary.500" />
                            <Text flex={1} color="gray.600">Correo electrónico:</Text>
                            <Text bold>{user?.email}</Text>
                        </HStack>

                        <HStack space={3} alignItems="center">
                            <Icon as={Ionicons} name="call" size={5} color="primary.500" />
                            <Text flex={1} color="gray.600">Teléfono:</Text>
                            <Text bold>{user?.telefono || 'No especificado'}</Text>
                        </HStack>

                        <HStack space={3} alignItems="center">
                            <Icon as={FontAwesome5} name="id-card" size={5} color="primary.500" />
                            <Text flex={1} color="gray.600">Tarjeta RFID:</Text>
                            <Text bold>{user?.id_tarjeta_rfid || 'No asignada'}</Text>
                        </HStack>
                    </VStack>

                    {/* Action Buttons */}
                    <VStack space={3}>
                        <Button
                            leftIcon={<Icon as={Ionicons} name="log-out" size={5} />}
                            colorScheme="danger"
                            onPress={handleLogout}
                            borderRadius="lg"
                            mt={8}>
                            Cerrar Sesión
                        </Button>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default ProfileUserScreen;