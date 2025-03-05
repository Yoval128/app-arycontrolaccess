import React, { useState } from 'react';
import {NativeBaseProvider, Box, Text, Input, FormControl, Button, Spinner, VStack, Icon} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { CommonActions } from '@react-navigation/native';
import customTheme from '../../themes/index';
import {Ionicons} from "@expo/vector-icons";

const LoginScreen = () => {
    const navigation = useNavigation();
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!correo || !contraseña) {
            setError('Por favor ingresa tu correo y contraseña');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contraseña }),
            });

            const data = await response.json();

            if (response.status === 200 && data.token) {
                console.log('¡Login exitoso!');
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
                await AsyncStorage.setItem('userRole', data.usuario.rol);

                console.log(data.usuario);  // Ver la estructura del objeto usuario
                console.log(data.usuario.rol);
                // Verificar rol del usuario y redirigir
                if (data.usuario && data.usuario.rol === 'administrador') {
                    console.log("Entrando a la navegación...");
                    navigation.replace('Main');
                    console.log("Sale de la navegación...");
                } else if (data.usuario && data.usuario.rol === 'empleado') {
                    // Si es empleado, redirigir al dashboard de empleado
                    navigation.replace('Main');
                } else if (data.usuario && data.usuario.rol === 'invitado') {
                    // Si es invitado, redirigir al dashboard de invitado
                    navigation.replace('Main');
                } else {
                    // En caso de un rol no esperado, mostrar un error
                    console.log('Error al entrar');
                    console.log(data.usuario.rol);
                    Alert.alert('Error', 'Rol de usuario desconocido');
                }
            } else {
                setError(data.error || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.log(error);
            setError('Hubo un problema al intentar iniciar sesión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} justifyContent="center" alignItems="center" bg="primary.500" p={4}>
                <VStack space={4} width="90%" maxW="400px">
                    <Text color="white" fontSize="2xl" textAlign="center">Iniciar sesión</Text>

                    {error ? <Text color="red.500" textAlign="center">{error}</Text> : null}

                    <FormControl>
                        <FormControl.Label _text={{ color: 'white' }}>Correo</FormControl.Label>
                        <Input
                            value={correo}
                            onChangeText={setCorreo}
                            placeholder="Ingresa tu correo"
                            bg="white"
                            borderRadius="md"
                            InputLeftElement={<Icon as={<Ionicons name="mail-outline" />} size={5} ml={2} color="gray.400" />}
                        />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label _text={{ color: 'white' }}>Contraseña</FormControl.Label>
                        <Input
                            value={contraseña}
                            onChangeText={setContraseña}
                            placeholder="Ingresa tu contraseña"
                            type="password"
                            bg="white"
                            borderRadius="md"
                            InputLeftElement={<Icon as={<Ionicons name="lock-closed-outline" />} size={5} ml={2} color="gray.400" />}
                        />
                    </FormControl>

                    <Button onPress={handleLogin} colorScheme="blue" borderRadius="md" isLoading={loading} _text={{ fontSize: 'md' }}>
                        Iniciar sesión
                    </Button>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default LoginScreen;
