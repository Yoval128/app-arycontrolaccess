import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, HStack, Heading, Spinner, ScrollView } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

const AdminDashboardScreen = () => {
    const [user, setUser] = useState(null);
    const [userCargos, setUserCargos] = useState({
        Admin: 0,
        Invitado: 0,
        Empleado: 0,
    });
    const [activeUsers, setActiveUsers] = useState(null);
    const [inactiveUsers, setInactiveUsers] = useState(null);
    const [activeRfidCards, setActiveRfidCards] = useState(null);
    const [inactiveRfidCards, setInactiveRfidCards] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    // Datos para el gráfico de pastel de los cargos
    const userCargosPieData = [
        {
            name: 'Administrador',
            population: userCargos.Admin,
            color: '#34c1c3',
            legendFontColor: '#000',
            legendFontSize: 15
        },
        {
            name: 'Invitado',
            population: userCargos.Invitado,
            color: '#cc0000',
            legendFontColor: '#000',
            legendFontSize: 15
        },
        {
            name: 'Empleado',
            population: userCargos.Empleado,
            color: '#d9534f',
            legendFontColor: '#000',
            legendFontSize: 15
        },
    ];

    const getUserData = async () => {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('usuario');

        if (token && userData) {
            setUser(JSON.parse(userData));
        } else {
            navigation.replace('Login');
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const fetchUserCargos = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`${API_URL}/api/users/cargos`);
                    const data = await response.json();
                    console.log("Datos recibidos de la API:", data); // Depuración
                    // Establecer los valores de los cargos
                    const cargos = { Admin: 0, Invitado: 0, Empleado: 0 };
                    data.forEach(item => {
                        if (item.Cargo.toLowerCase() === 'administrador') cargos.Admin = item.cantidad;
                        if (item.Cargo.toLowerCase() === 'invitado') cargos.Invitado = item.cantidad;
                        if (item.Cargo.toLowerCase() === 'empleado') cargos.Empleado = item.cantidad;
                    });
                    setUserCargos(cargos);
                } catch (error) {
                    setError('Error fetching user cargos');
                    console.error('Error fetching user cargos:', error);
                } finally {
                    setLoading(false);
                }
            };

            const fetchRfidCardsData = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`${API_URL}/api/rfidCards/active-rfidCards`);
                    const data = await response.json();
                    console.log("Datos de tarjetas RFID recibidos:", data); // Depuración
                    setActiveRfidCards(data.activeRfidCards);
                    setInactiveRfidCards(data.inactiveRfidCards);
                } catch (error) {
                    setError('Error fetching RFID card data');
                    console.error('Error fetching RFID card data:', error);
                } finally {
                    setLoading(false);
                }
            };

            // Obtener los datos de cargos y tarjetas RFID
            fetchUserCargos();
            fetchRfidCardsData();
        }, [])
    );

    const activeRfidCardsBarData = {
        labels: ['Activas', 'Inactivas'],
        datasets: [
            {
                data: [activeRfidCards || 0, inactiveRfidCards || 0],
                colors: [
                    (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,  // Color azul para activas
                    (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,     // Color rojo para inactivas
                ],
                strokeWidth: 2,
            },
        ],
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    {/* Header */}
                    <HStack justifyContent="space-between" alignItems="center" mb={5} p={3} bg="secondary.500"
                            borderRadius="lg" shadow={2}>
                        <HStack alignItems="center">
                            <Ionicons name="person-circle" size={40} color="white" />
                            <VStack ml={3}>
                                {user ? (
                                    <Text fontSize="lg" bold color="white">{user.nombre}</Text>
                                ) : (
                                    <Spinner size="sm" />
                                )}
                                {user ? (
                                    <Text fontSize="md" color="white">{user.rol}</Text>
                                ) : (
                                    <Spinner size="sm" />
                                )}
                            </VStack>
                        </HStack>
                    </HStack>

                    <Heading size="md" mb={3} color="secondary.500">📊 Estadísticas en Tiempo Real</Heading>

                    <VStack space={4}>
                        {/* Gráfico de Usuarios Activos */}
                        <Box p={4} bg="white" borderRadius="lg" shadow={2}>
                            <Text bold textAlign="center">Distribución de Cargos</Text>
                            {loading ? (
                                <Spinner size="sm" />
                            ) : (
                                <PieChart
                                    data={userCargosPieData}
                                    width={320} // Ajusta el ancho
                                    height={220} // Ajusta el alto
                                    chartConfig={{
                                        backgroundColor: 'black',
                                        backgroundGradientFrom: 'black',
                                        backgroundGradientTo: 'black',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Azul
                                        barPercentage: 0.8, // Aumenta el porcentaje de las barras
                                        propsForLabels: {
                                            fontSize: 12,
                                        },
                                        style: {
                                            marginVertical: 8,
                                        },
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                    style={{ marginVertical: 8 }}
                                />
                            )}
                        </Box>

                        {/* Gráfico de Tarjetas RFID Activas vs Inactivas */}
                        <Box p={4} bg="white" borderRadius="lg" shadow={2}>
                            <Text bold textAlign="center">Tarjetas RFID Activas vs Inactivas</Text>
                            {loading ? (
                                <Spinner size="sm" />
                            ) : (
                                <BarChart
                                    data={activeRfidCardsBarData}
                                    width={320} // Ajusta el ancho
                                    height={220} // Ajusta el alto
                                    chartConfig={{
                                        backgroundColor: 'white',
                                        backgroundGradientFrom: 'white',
                                        backgroundGradientTo: 'white',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Azul
                                        style: {
                                            marginVertical: 8,
                                        },
                                    }}
                                    style={{ marginVertical: 8 }}
                                />
                            )}
                        </Box>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AdminDashboardScreen;