import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, HStack, Heading, Spinner, ScrollView, Icon, Badge, Divider , Button} from 'native-base';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [lastUpdated, setLastUpdated] = useState(null);
    const navigation = useNavigation();

    // Colores personalizados para el tema
    const colors = {
        primary: '#34c1c3',
        secondary: '#2b6cb0',
        danger: '#d9534f',
        warning: '#f0ad4e',
        success: '#5cb85c',
        info: '#5bc0de'
    };

    // Datos para el gráfico de pastel
    const userCargosPieData = [
        {
            name: 'Administradores',
            population: userCargos.Admin,
            color: colors.primary,
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
        },
        {
            name: 'Invitados',
            population: userCargos.Invitado,
            color: colors.danger,
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
        },
        {
            name: 'Empleados',
            population: userCargos.Empleado,
            color: colors.secondary,
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
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

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener datos de cargos
            const cargosResponse = await fetch(`${API_URL}/api/users/cargos`);
            const cargosData = await cargosResponse.json();

            const cargos = { Admin: 0, Invitado: 0, Empleado: 0 };
            cargosData.forEach(item => {
                if (item.Cargo.toLowerCase() === 'administrador') cargos.Admin = item.cantidad;
                if (item.Cargo.toLowerCase() === 'invitado') cargos.Invitado = item.cantidad;
                if (item.Cargo.toLowerCase() === 'empleado') cargos.Empleado = item.cantidad;
            });
            setUserCargos(cargos);

            // Obtener datos de tarjetas RFID
            const rfidResponse = await fetch(`${API_URL}/api/rfidCards/active-rfidCards`);
            const rfidData = await rfidResponse.json();
            setActiveRfidCards(rfidData.activeRfidCards);
            setInactiveRfidCards(rfidData.inactiveRfidCards);

            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            setError('Error al cargar los datos del dashboard');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDashboardData();

            // Actualizar datos cada 30 segundos
            const interval = setInterval(fetchDashboardData, 30000);
            return () => clearInterval(interval);
        }, [])
    );

    const activeRfidCardsBarData = {
        labels: ['Activas', 'Inactivas'],
        datasets: [
            {
                data: [activeRfidCards || 0, inactiveRfidCards || 0],
                colors: [
                    (opacity = 1) => `rgba(52, 193, 195, ${opacity})`,  // Color primario
                    (opacity = 1) => `rgba(217, 83, 79, ${opacity})`,   // Color danger
                ],
            },
        ],
    };

    // Card de estadísticas
    const StatCard = ({ icon, title, value, color, iconName }) => (
        <Box
            flex={1}
            p={3}
            bg="white"
            borderRadius="lg"
            shadow={2}
            mx={1}
        >
            <HStack alignItems="center" space={2}>
                <Icon
                    as={icon}
                    name={iconName}
                    size="sm"
                    color={`${color}.500`}
                />
                <Text fontSize="xs" color="gray.500">{title}</Text>
            </HStack>
            <Text fontSize="xl" bold mt={1} color={`${color}.600`}>
                {value || 0}
            </Text>
        </Box>
    );

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} bg="gray.50">
                <Box safeArea p={4} flex={1}>
                    {/* Header */}
                    <HStack justifyContent="space-between" alignItems="center" mb={4}>
                        <VStack>
                            <Heading size="lg" color="primary.600">Panel de Control</Heading>
                            <Text fontSize="xs" color="gray.500">
                                Última actualización: {lastUpdated || 'Cargando...'}
                            </Text>
                        </VStack>
                        <HStack alignItems="center">
                            <Icon
                                as={Ionicons}
                                name="person-circle"
                                size={10}
                                color="primary.500"
                                mr={2}
                            />
                            <VStack>
                                <Text fontSize="sm" bold color="gray.700">
                                    {user?.nombre || 'Usuario'}
                                </Text>
                                <Badge
                                    colorScheme="primary"
                                    alignSelf="flex-start"
                                    variant="subtle"
                                    borderRadius="full"
                                    px={2}
                                >
                                    {user?.rol || 'Rol'}
                                </Badge>
                            </VStack>
                        </HStack>
                    </HStack>

                    {/* Tarjetas de resumen */}
                    <HStack space={2} mb={4}>
                        <StatCard
                            icon={Ionicons}
                            iconName="people"
                            title="Usuarios"
                            value={userCargos.Admin + userCargos.Empleado + userCargos.Invitado}
                            color="primary"
                        />
                        <StatCard
                            icon={MaterialCommunityIcons}
                            iconName="card-account-details"
                            title="Tarjetas Activas"
                            value={activeRfidCards}
                            color="success"
                        />
                        <StatCard
                            icon={MaterialCommunityIcons}
                            iconName="card-off"
                            title="Tarjetas Inactivas"
                            value={inactiveRfidCards}
                            color="danger"
                        />
                    </HStack>

                    {/* Sección de gráficos */}
                    <Heading size="md" mb={3} color="primary.600">📊 Estadísticas Visuales</Heading>

                    {error && (
                        <Box bg="red.100" p={3} borderRadius="md" mb={4}>
                            <HStack space={2} alignItems="center">
                                <Icon as={Ionicons} name="warning" color="red.500" />
                                <Text color="red.600">{error}</Text>
                            </HStack>
                        </Box>
                    )}

                    <VStack space={4} mb={4}>
                        {/* Gráfico de distribución de cargos */}
                        <Box p={4} bg="white" borderRadius="lg" shadow={2}>
                            <HStack justifyContent="space-between" alignItems="center" mb={2}>
                                <Text bold>Distribución de Usuarios</Text>
                                <Badge colorScheme="primary" borderRadius="full" px={2}>
                                    <Text fontSize="xs">Total: {userCargos.Admin + userCargos.Empleado + userCargos.Invitado}</Text>
                                </Badge>
                            </HStack>
                            {loading ? (
                                <Box height={220} justifyContent="center" alignItems="center">
                                    <Spinner size="lg" color="primary.500" />
                                </Box>
                            ) : (
                                <PieChart
                                    data={userCargosPieData}
                                    width={350}
                                    height={200}
                                    chartConfig={{
                                        backgroundColor: 'white',
                                        backgroundGradientFrom: 'white',
                                        backgroundGradientTo: 'white',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        }
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                />
                            )}
                        </Box>

                        {/* Gráfico de tarjetas RFID */}
                        <Box p={4} bg="white" borderRadius="lg" shadow={2}>
                            <HStack justifyContent="space-between" alignItems="center" mb={2}>
                                <Text bold>Estado de Tarjetas RFID</Text>
                                <Badge colorScheme="info" borderRadius="full" px={2}>
                                    <Text fontSize="xs">Total: {(activeRfidCards || 0) + (inactiveRfidCards || 0)}</Text>
                                </Badge>
                            </HStack>
                            {loading ? (
                                <Box height={220} justifyContent="center" alignItems="center">
                                    <Spinner size="lg" color="primary.500" />
                                </Box>
                            ) : (
                                <BarChart
                                    data={activeRfidCardsBarData}
                                    width={350}
                                    height={220}
                                    yAxisLabel=""
                                    chartConfig={{
                                        backgroundColor: 'white',
                                        backgroundGradientFrom: 'white',
                                        backgroundGradientTo: 'white',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        barPercentage: 0.6,
                                        style: {
                                            borderRadius: 16
                                        }
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                    fromZero
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