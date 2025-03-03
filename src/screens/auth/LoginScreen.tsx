import React, { useState } from 'react';
import { NativeBaseProvider, Box, Text, Input, FormControl, Button, Spinner } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import customTheme from '../../themes/index'; // Asegúrate de que la ruta sea correcta

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: correo,
                    contraseña: contraseña,
                }),
            });

            const data = await response.json();

            if (response.status === 200 && data.token) {
                // Si las credenciales son correctas
                console.log('¡Login exitoso!');
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));

                // Redirigir dependiendo del rol
                if (data.usuario.rol === 'administrador') {
                    navigation.replace('AdminDashboard');
                } else if (data.usuario.rol === 'empleado') {
                    navigation.replace('EmployeeDashboard');
                } else {
                    navigation.replace('GuestDashboard');
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
                <Text color="white" fontSize="2xl" mb={6}>
                    Iniciar sesión
                </Text>

                {error ? (
                    <Text color="red.500" mb={4}>
                        {error}
                    </Text>
                ) : null}

                <FormControl mb={4}>
                    <FormControl.Label _text={{ color: 'white' }}>Correo</FormControl.Label>
                    <Input
                        value={correo}
                        onChangeText={setCorreo}
                        placeholder="Ingresa tu correo"
                        bg="white"
                        borderRadius="md"
                        _focus={{ borderColor: 'blue.500' }}
                    />
                </FormControl>

                <FormControl mb={6}>
                    <FormControl.Label _text={{ color: 'white' }}>Contraseña</FormControl.Label>
                    <Input
                        value={contraseña}
                        onChangeText={setContraseña}
                        placeholder="Ingresa tu contraseña"
                        type="password"
                        bg="white"
                        borderRadius="md"
                        _focus={{ borderColor: 'blue.500' }}
                    />
                </FormControl>

                <Button
                    onPress={handleLogin}
                    bg="blue.500"
                    _text={{ color: 'white' }}
                    borderRadius="md"
                    isLoading={loading}
                    isLoadingText="Iniciando..."
                >
                    Iniciar sesión
                </Button>
            </Box>
        </NativeBaseProvider>
    );
};

export default LoginScreen;
