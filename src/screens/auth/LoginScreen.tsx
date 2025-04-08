import React, {useState, useEffect} from 'react';
import {NativeBaseProvider, Box, Text, Input, FormControl, Button, Spinner, VStack, Icon} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {Ionicons} from "@expo/vector-icons";
import customTheme from '../../themes/index';
import {useAuth} from '../../context/AuthProvider';
import {useTranslation} from "react-i18next";

const LoginScreen = () => {

    console.log(API_URL);

    const navigation = useNavigation();
    const {login} = useAuth(); // Usar el contexto de autenticación
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isApiConnected, setIsApiConnected] = useState(false);
    const [isCheckingApi, setIsCheckingApi] = useState(true);

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    useEffect(() => {
        // Verificar conexión a la API cuando el componente se monte
        const checkApiConnection = async () => {
            try {
                const response = await fetch(`${API_URL}/api/auth/`);
                if (response.ok) {
                    setIsApiConnected(true);
                } else {
                    setIsApiConnected(false);
                }
            } catch (error) {
                console.log("Error al verificar la conexión con la API", error);
                setIsApiConnected(false);
            } finally {
                setIsCheckingApi(false);
            }
        };
        checkApiConnection();
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            // Llamar a la API de autenticación para validar credenciales
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({correo, contrasena}),
            });

            // Parsear el cuerpo de la respuesta solo una vez
            const data = await response.json();

            if (response.ok) {
                // Aquí ya tenemos los datos correctamente parseados
                login(data.usuario.rol, data.token); // Asegúrate de que la propiedad 'usuario.rol' y 'data.token' existan
                AsyncStorage.setItem('token', data.token);
                AsyncStorage.setItem('role', data.usuario.rol);
                console.log("Rol", data.usuario.rol);
                AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
                navigation.replace('RoleNavigator');
            } else {
                setError(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.log("Error de autenticación", error);
            setError('Hubo un error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} justifyContent="center" alignItems="center" bg="primary.500" p={4}>
                <VStack space={6} width="90%" maxW="400px">
                    {/* Logo/Header */}
                    <Box alignItems="center">
                        <Icon
                            as={Ionicons}
                            name="lock-closed"
                            color="white"
                            size={12}
                            mb={2}
                        />
                        <Text color="white" fontSize="2xl" fontWeight="bold" textAlign="center">
                            {t('login.welcome')}
                        </Text>
                        <Text color="white" opacity={0.8} textAlign="center">
                            {t('login.enterCredentials')}
                        </Text>
                    </Box>

                    {/* Status API (discreto) */}
                    {isCheckingApi ? (
                        <Spinner size="sm" color="white" />
                    ) : (
                        <Box alignItems="flex-end" pr={1}>
                            <Box
                                flexDirection="row"
                                alignItems="center"
                                bg={isApiConnected ? "green.100" : "red.100"}
                                px={2}
                                py={1}
                                borderRadius="full"
                            >
                                <Box
                                    w={2}
                                    h={2}
                                    borderRadius="full"
                                    bg={isApiConnected ? "green.500" : "red.500"}
                                    mr={1}
                                />
                                <Text fontSize="xs" color={isApiConnected ? "green.800" : "red.800"}>
                                    {isApiConnected ? t('login.apiStatusConnected') : t('login.apiStatusDisconnected')}
                                </Text>
                            </Box>
                        </Box>
                    )}

                    {/* Formulario */}
                    <VStack space={4}>
                        {error && (
                            <Box bg="red.100" p={2} borderRadius="md">
                                <Text color="red.600" textAlign="center">{error}</Text>
                            </Box>
                        )}

                        <FormControl>
                            <Input
                                value={correo}
                                onChangeText={setCorreo}
                                placeholder={t('login.emailPlaceholder')}
                                placeholderTextColor="gray.400"
                                bg="white"
                                borderRadius="lg"
                                color="black"
                                borderWidth={0}
                                height={12}
                                InputLeftElement={
                                    <Icon
                                        as={<Ionicons name="mail-outline"/>}
                                        size={5}
                                        ml={3}
                                        color="primary.500"
                                    />
                                }
                                _focus={{
                                    bg: "white",
                                    borderWidth: 1,
                                    borderColor: "primary.300",
                                }}
                            />
                        </FormControl>

                        <FormControl>
                            <Input
                                value={contrasena}
                                onChangeText={setContrasena}
                                placeholder={t('login.passwordPlaceholder')}
                                placeholderTextColor="gray.400"
                                type="password"
                                bg="white"
                                borderRadius="lg"
                                color="black"
                                borderWidth={0}
                                height={12}
                                InputLeftElement={
                                    <Icon
                                        as={<Ionicons name="lock-closed-outline"/>}
                                        size={5}
                                        ml={3}
                                        color="primary.500"
                                    />
                                }
                                _focus={{
                                    bg: "white",
                                    borderWidth: 1,
                                    borderColor: "primary.300",
                                }}
                            />
                        </FormControl>

                        <Button
                            onPress={handleLogin}
                            bg="white"
                            borderRadius="lg"
                            height={12}
                            isLoading={loading}
                            isDisabled={!isApiConnected}
                            _text={{
                                color: "primary.500",
                                fontWeight: "bold",
                                fontSize: "md"
                            }}
                            _pressed={{
                                bg: "gray.100"
                            }}
                        >
                            {t('login.loginButton')}
                        </Button>
                    </VStack>

                    {/* Enlace opcional */}
                    <Text
                        color="white"
                        textAlign="center"
                        mt={2}
                        underline
                        onPress={() => navigation.navigate('RecoveryPassword')}
                    >
                    </Text>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default LoginScreen;
