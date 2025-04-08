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
    useColorModeValue,
} from "native-base";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {useNavigation, useRoute} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {useAuth} from "../../context/AuthProvider";
import Header from "../../components/Header";

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

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
    const dividerColor = useColorModeValue("gray.200", "gray.700");
    const iconColor = useColorModeValue("primary.500", "primary.300");

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
                <Box flex={1} justifyContent="center" alignItems="center" bg={bgColor}>
                    <VStack space={4} alignItems="center">
                        <Spinner size="lg" color={iconColor} />
                        <Text color={secondaryTextColor}>Cargando detalles del usuario...</Text>
                    </VStack>
                </Box>
            </NativeBaseProvider>
        );
    }

    if (error) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center" p={5} bg={bgColor}>
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
            <Box safeArea flex={1} bg={bgColor} p={4}>
                {/* Header */}
                <Header title="Detalles" iconName="person" />

                {/* User Profile Section */}
                <Box marginTop={4}>
                    <Box bg={cardBg} p={5} borderRadius="xl" shadow={2}>
                        <HStack space={4} alignItems="center">
                            <Avatar
                                bg="primary.400"
                                size="xl"
                                source={user?.photoUrl ? { uri: user.photoUrl } : null}
                            >
                                {user?.Nombre?.[0]}{user?.Apellido?.[0]}
                            </Avatar>
                            <VStack flex={1}>
                                <Heading size="md" color={textColor}>
                                    {user?.Nombre} {user?.Apellido}
                                </Heading>
                                <Text fontSize="md" color={secondaryTextColor}>{user?.Cargo}</Text>
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

                        <Divider my={4} bg={dividerColor} />

                        {/* User Details */}
                        <VStack space={4}>
                            <DetailItem
                                icon={<Icon as={Ionicons} name="mail" size={5} color={iconColor} />}
                                label="Correo electrónico"
                                value={user?.Correo}
                                textColor={textColor}
                                secondaryTextColor={secondaryTextColor}
                            />

                            <DetailItem
                                icon={<Icon as={Ionicons} name="call" size={5} color={iconColor} />}
                                label="Teléfono"
                                value={user?.Telefono || "No disponible"}
                                textColor={textColor}
                                secondaryTextColor={secondaryTextColor}
                            />

                            <DetailItem
                                icon={<Icon as={MaterialCommunityIcons} name="card-account-details" size={5} color={iconColor} />}
                                label="Tarjeta RFID"
                                value={user?.Codigo_RFID || "No asignada"}
                                textColor={textColor}
                                secondaryTextColor={secondaryTextColor}
                            />

                            {user?.Ultimo_Acceso && (
                                <DetailItem
                                    icon={<Icon as={MaterialIcons} name="history" size={5} color={iconColor} />}
                                    label="Último acceso"
                                    value={new Date(user?.Ultimo_Acceso).toLocaleString()}
                                    textColor={textColor}
                                    secondaryTextColor={secondaryTextColor}
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
        </NativeBaseProvider>
    );
};

// Reusable component for detail items
const DetailItem = ({icon, label, value, textColor, secondaryTextColor}) => (
    <HStack space={3} alignItems="flex-start">
        <Box mt={0.5}>{icon}</Box>
        <VStack flex={1}>
            <Text fontSize="sm" color={secondaryTextColor}>{label}</Text>
            <Text fontSize="md" fontWeight="medium" color={textColor}>{value}</Text>
        </VStack>
    </HStack>
);

export default DetailUserScreen;