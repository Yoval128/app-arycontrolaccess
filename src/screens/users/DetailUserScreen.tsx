import React, {useEffect, useState} from "react";
import {
    Text,
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Avatar,
    Spinner,
    IconButton,
    Divider,
    Badge,
    Heading,
    Icon,
    useToast,
    Button,
    Alert,
    ScrollView
} from "native-base";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {useNavigation, useRoute} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {useAuth} from "../../context/AuthProvider";

const DetailUserScreen = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const toast = useToast();
    const {user: currentUser} = useAuth();
    const {usuario_id} = route.params;

    const fetchUserDetails = async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`${API_URL}/api/users/user/${usuario_id}`);
            if (!response.ok) throw new Error('Error al obtener los detalles del usuario');
            const data = await response.json();
            setUser(data);
        } catch (error) {
            setError(error.message);
            toast.show({
                title: "Error",
                description: error.message,
                status: "error",
                placement: "top"
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [usuario_id]);

    const handleEdit = () => {
        navigation.navigate("EditUser", {usuario_id});
    };

    if (loading) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center">
                    <VStack space={4} alignItems="center">
                        <Spinner size="lg" color="primary.500" />
                        <Text color="gray.600">Cargando detalles del usuario...</Text>
                    </VStack>
                </Box>
            </NativeBaseProvider>
        );
    }

    if (error) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center" p={5}>
                    <Alert status="error" mb={4} w="100%">
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
                    <Button
                        onPress={fetchUserDetails}
                        colorScheme="primary"
                        leftIcon={<Icon as={Ionicons} name="refresh" />}
                    >
                        Reintentar
                    </Button>
                </Box>
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}} bg="gray.50">
                <Box safeArea flex={1}>
                    {/* Header */}
                    <Box bg="primary.600" p={4} borderBottomRadius="xl" shadow={4}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="person" size={6} color="white" />
                                <Heading color="white" size="lg">Detalles del Usuario</Heading>
                            </HStack>
                            <IconButton
                                icon={<Icon as={Ionicons} name="arrow-back" size={6} color="white" />}
                                onPress={() => navigation.goBack()}
                            />
                        </HStack>
                    </Box>

                    {/* User Profile Section */}
                    <Box p={4}>
                        <Box bg="white" p={5} borderRadius="xl" shadow={2}>
                            <HStack space={4} alignItems="center">
                                <Avatar
                                    bg="primary.400"
                                    size="xl"
                                    source={user?.photoUrl ? { uri: user.photoUrl } : null}
                                >
                                    {user?.Nombre?.[0]}{user?.Apellido?.[0]}
                                </Avatar>
                                <VStack flex={1}>
                                    <Heading size="md">{user?.Nombre} {user?.Apellido}</Heading>
                                    <Text fontSize="md" color="gray.500">{user?.Cargo}</Text>
                                    <Badge
                                        colorScheme={user?.Estado === 'activo' ? 'success' : 'danger'}
                                        alignSelf="flex-start"
                                        borderRadius="full"
                                        variant="subtle"
                                        mt={1}
                                    >
                                        {user?.Estado === 'activo' ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </VStack>
                            </HStack>

                            <Divider my={4} />

                            {/* User Details */}
                            <VStack space={4}>
                                <DetailItem
                                    icon={<Icon as={Ionicons} name="mail" size={5} color="primary.500" />}
                                    label="Correo electrónico"
                                    value={user?.Correo}
                                />

                                <DetailItem
                                    icon={<Icon as={Ionicons} name="call" size={5} color="primary.500" />}
                                    label="Teléfono"
                                    value={user?.Telefono || "No disponible"}
                                />

                                <DetailItem
                                    icon={<Icon as={MaterialCommunityIcons} name="card-account-details" size={5} color="primary.500" />}
                                    label="Tarjeta RFID"
                                    value={user?.Codigo_RFID || "No asignada"}
                                />


                                {user?.Ultimo_Acceso && (
                                    <DetailItem
                                        icon={<Icon as={MaterialIcons} name="history" size={5} color="primary.500" />}
                                        label="Último acceso"
                                        value={new Date(user?.Ultimo_Acceso).toLocaleString()}
                                    />
                                )}
                            </VStack>
                        </Box>

                        {/* Action Buttons */}
                        {currentUser?.role === 'administrador' && (
                            <Button
                                mt={6}
                                colorScheme="primary"
                                leftIcon={<Icon as={Ionicons} name="create" size={5} />}
                                onPress={handleEdit}
                                borderRadius="lg"
                            >
                                Editar Usuario
                            </Button>
                        )}
                    </Box>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

// Reusable component for detail items
const DetailItem = ({icon, label, value}) => (
    <HStack space={3} alignItems="flex-start">
        <Box mt={0.5}>{icon}</Box>
        <VStack flex={1}>
            <Text fontSize="sm" color="gray.500">{label}</Text>
            <Text fontSize="md" fontWeight="medium">{value}</Text>
        </VStack>
    </HStack>
);

export default DetailUserScreen;