import {
    Text,
    HStack,
    VStack,
    Spinner,
    ScrollView,
    Box,
    Button,
    Avatar,
    Icon,
    useToast,
    Divider,
    Badge,
    Heading,
    useColorModeValue
} from "native-base";
import {Ionicons, FontAwesome5} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../../context/AuthProvider";
import ThemeToggle from "../../components/ThemeToggle";
import {useTranslation} from "react-i18next";

const ProfileUserScreen = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();
    const navigation = useNavigation();
    const {logout} = useAuth();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const headingColor = useColorModeValue("primary.600", "primary.300");
    const dividerColor = useColorModeValue("gray.200", "gray.600");

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    const getUserData = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('usuario');

            if (token && userData) {
                setUser(JSON.parse(userData));
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


// Función para cambiar el idioma y guardar la preferencia
    const changeAppLanguage = async (lng) => {
        try {
            await i18n.changeLanguage(lng);
            await AsyncStorage.setItem('userLanguage', lng);
        } catch (error) {
            console.error("Error changing language:", error);
        }
    };

    if (loading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg={bgColor}>
                <VStack space={4} alignItems="center">
                    <Spinner size="lg" color="primary.500"/>
                    <Text color={textColor}>Cargando tu perfil...</Text>
                </VStack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg={bgColor} p={5}>
                <Alert w="100%" status="error" mb={4}>
                    <VStack space={2} flexShrink={1} w="100%">
                        <HStack flexShrink={1} space={2} justifyContent="space-between">
                            <HStack space={2} flexShrink={1}>
                                <Alert.Icon mt="1"/>
                                <Text fontSize="md" color={textColor}>
                                    {error}
                                </Text>
                            </HStack>
                        </HStack>
                    </VStack>
                </Alert>
                <Button onPress={getUserData} colorScheme="primary"
                        leftIcon={<Icon as={Ionicons} name="refresh"/>}>
                    Reintentar
                </Button>
            </Box>
        );
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} bg={bgColor}>
            <Box safeArea p={4} flex={1}>
                {/* Header */}
                <VStack space={3} mb={6}>
                    <HStack justifyContent="space-between" alignItems="center">
                        <Heading size="xl" color={headingColor}>{t('profile.title')}</Heading>
                        <Badge colorScheme="primary" borderRadius="full" px={3} py={1}>
                            <Text color="white" fontSize="xs">{user?.rol || 'Usuario'}</Text>
                        </Badge>
                    </HStack>
                    <Divider bg={dividerColor}/>
                </VStack>

                {/* User Info Section */}
                <VStack space={4} mb={6} alignItems="center">
                    <Avatar
                        size="2xl"
                        bg="primary.500"
                        source={{uri: user?.photoUrl}}
                        borderWidth={3}
                        borderColor="primary.200"
                    >
                        {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                    </Avatar>

                    <Heading size="lg" color={textColor}>
                        {user?.nombre} {user?.apellido}
                    </Heading>

                    <Badge colorScheme="blue" borderRadius="full" px={3}>
                        <Text>{user?.email}</Text>
                    </Badge>
                </VStack>

                {/* Details Section */}
                <VStack space={4} mb={6} bg={cardBg} p={4} borderRadius="lg" shadow={1}>
                    <Heading size="md" color={textColor} mb={2}>{t('profile.personalInformation')}</Heading>

                    <HStack space={3} alignItems="center">
                        <Icon as={Ionicons} name="person" size={5} color="primary.500"/>
                        <Text flex={1} color={textColor}>{t('profile.fullName')}:</Text>
                        <Text bold color={textColor}>{user?.nombre} {user?.apellido}</Text>
                    </HStack>

                    <HStack space={3} alignItems="center">
                        <Icon as={Ionicons} name="mail" size={5} color="primary.500"/>
                        <Text flex={1} color={textColor}>{t('profile.email')}:</Text>
                        <Text bold color={textColor}>{user?.email}</Text>
                    </HStack>

                    <HStack space={3} alignItems="center">
                        <Icon as={Ionicons} name="call" size={5} color="primary.500"/>
                        <Text flex={1} color={textColor}>{t('profile.phone')}:</Text>
                        <Text bold color={textColor}>{user?.telefono || 'No especificado'}</Text>
                    </HStack>

                    <HStack space={3} alignItems="center">
                        <Icon as={FontAwesome5} name="id-card" size={5} color="primary.500"/>
                        <Text flex={1} color={textColor}>{t('profile.rfidCard')}:</Text>
                        <Text bold color={textColor}>{user?.id_tarjeta_rfid || 'No asignada'}</Text>
                    </HStack>
                </VStack>

                {/* Theme Toggle Section - Integrado mejor */}
                <VStack space={4} mb={6} bg={cardBg} p={4} borderRadius="lg" shadow={1}>
                    <Heading size="md" color={textColor} mb={2}>{t('profile.preferences')}</Heading>

                    {/* Sección de Tema */}
                    <HStack justifyContent="space-between" alignItems="center">
                        <HStack space={3} alignItems="center">
                            <Icon as={Ionicons} name="contrast" size={5} color="primary.500"/>
                            <Text color={textColor}>{t('theme')}</Text>
                        </HStack>
                        <ThemeToggle/>
                    </HStack>

                    {/* Sección de Idioma */}
                    <HStack space={2}>
                        <Button
                            size="sm"
                            variant={i18n.language === "es" ? "solid" : "outline"}
                            colorScheme={i18n.language === "es" ? "primary" : "gray"}
                            onPress={() => changeAppLanguage("es")}
                        >
                            Español
                        </Button>
                        <Button
                            size="sm"
                            variant={i18n.language === "en" ? "solid" : "outline"}
                            colorScheme={i18n.language === "en" ? "primary" : "gray"}
                            onPress={() => changeAppLanguage("en")}
                        >
                            English
                        </Button>
                    </HStack>
                </VStack>

                {/* Action Buttons */}
                <VStack space={3}>
                    <Button
                        leftIcon={<Icon as={Ionicons} name="log-out" size={5}/>}
                        colorScheme="danger"
                        onPress={handleLogout}
                        borderRadius="lg">
                        {t('profile.logout')}
                    </Button>
                </VStack>
            </Box>
        </ScrollView>
    );
};

export default ProfileUserScreen;