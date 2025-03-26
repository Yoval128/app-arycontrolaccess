import React, {useState, useEffect} from 'react';
import {NativeBaseProvider, Box, Text, Input, FormControl, Button, Spinner, VStack, Icon} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import {Ionicons} from "@expo/vector-icons";
import customTheme from '../../themes/index';
import {useAuth} from '../../context/AuthProvider';

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
                <VStack space={4} width="90%" maxW="400px">
                    {/* Mostrar mensaje de conexión a la API */}
                    {isCheckingApi ? (
                        <Spinner size="sm" color="white"/>
                    ) : (
                        <Text color={isApiConnected ? "green.500" : "red.500"} fontSize="md" textAlign="center">
                            {isApiConnected ? "-API está trabajando correctamente..." : "No se pudo conectar con la API..."}
                            {API_URL}
                        </Text>

                    )}

                    <Text color="white" fontSize="2xl" textAlign="center">
                        Iniciar sesión
                    </Text>

                    {error ? <Text color="red.500" textAlign="center">{error}</Text> : null}

                    <FormControl>
                        <FormControl.Label _text={{color: 'white'}}>Correo</FormControl.Label>
                        <Input
                            value={correo}
                            onChangeText={setCorreo}
                            placeholder="Ingresa tu correo"
                            bg="white"
                            borderRadius="md"
                            InputLeftElement={<Icon as={<Ionicons name="mail-outline"/>} size={5} ml={2}
                                                    color="gray.400"/>}
                        />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label _text={{color: 'white'}}>Contraseña</FormControl.Label>
                        <Input
                            value={contrasena}
                            onChangeText={setContrasena}
                            placeholder="Ingresa tu contraseña"
                            type="password"
                            bg="white"
                            borderRadius="md"
                            InputLeftElement={<Icon as={<Ionicons name="lock-closed-outline"/>} size={5} ml={2}
                                                    color="gray.400"/>}
                        />
                    </FormControl>

                    <Button
                        onPress={handleLogin}
                        colorScheme="blue"
                        borderRadius="md"
                        isLoading={loading}
                        isDisabled={!isApiConnected}
                        _text={{fontSize: 'md'}}
                    >
                        Iniciar sesión
                    </Button>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default LoginScreen;
