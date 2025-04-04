import React, {useEffect, useState} from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Spinner,
    ScrollView,
    Icon,
    Badge,
    Divider,
    useColorModeValue
} from 'native-base';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {BarChart, PieChart} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeToggle from '../../components/ThemeToggle';
import {API_URL} from '@env';
import {useTranslation} from "react-i18next";

const EmpleadoDashboardScreen = () => {
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

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const headingColor = useColorModeValue("primary.600", "primary.300");
    const dividerColor = useColorModeValue("gray.200", "gray.600");
    const chartBgColor = useColorModeValue("white", "transparent");
    const chartTextColor = useColorModeValue("#7F7F7F", "#E2E2E2");

    // Colores personalizados para gráficos que responden al tema
    const colors = {
        primary: useColorModeValue('#34c1c3', '#2dd4bf'),
        secondary: useColorModeValue('#2b6cb0', '#3b82f6'),
        danger: useColorModeValue('#d9534f', '#ef4444'),
        warning: useColorModeValue('#f0ad4e', '#f59e0b'),
        success: useColorModeValue('#5cb85c', '#10b981'),
        info: useColorModeValue('#5bc0de', '#06b6d4')
    };

// Función para cambiar el idioma y guardar la preferencia
    const changeAppLanguage = async (lng) => {
        try {
            await i18n.changeLanguage(lng);
            await AsyncStorage.setItem('userLanguage', lng);
        } catch (error) {
            console.error("Error changing language:", error);
        }
    };
    // Datos para el gráfico de pastel
    const userCargosPieData = [
        {
            name: t('admin_dashboard.administrators'),
            population: userCargos.Admin,
            color: colors.primary,
            legendFontColor: chartTextColor,
            legendFontSize: 12
        },
        {
            name: t('admin_dashboard.guests'),
            population: userCargos.Invitado,
            color: colors.danger,
            legendFontColor: chartTextColor,
            legendFontSize: 12
        },
        {
            name: t('admin_dashboard.employees'),
            population: userCargos.Empleado,
            color: colors.secondary,
            legendFontColor: chartTextColor,
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

            const cargos = {Admin: 0, Invitado: 0, Empleado: 0};
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
        labels: [t('chart_legends.active'), t('chart_legends.inactive')],
        datasets: [
            {
                data: [activeRfidCards || 0, inactiveRfidCards || 0],
                colors: [
                    (opacity = 1) => `rgba(${hexToRgb(colors.primary).join(', ')}, ${opacity})`,
                    (opacity = 1) => `rgba(${hexToRgb(colors.danger).join(', ')}, ${opacity})`,
                ],
            },
        ],
    };

    // Función para convertir hex a rgb
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    };

    // Card de estadísticas
    const StatCard = ({icon, title, value, color, iconName}) => (
        <Box
            flex={1}
            p={3}
            bg={cardBg}
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
                <Text fontSize="xs" color={textColor}>{title}</Text>
            </HStack>
            <Text fontSize="xl" bold mt={1} color={`${color}.600`}>
                {value || 0}
            </Text>
        </Box>
    );

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} bg={bgColor}>
            <Box safeArea p={4} flex={1}>
                {/* Header */}
                <HStack justifyContent="space-between" alignItems="center" mb={4}>
                    <VStack>
                        <Heading size="lg" color={headingColor}>{t('admin_dashboard.dashboard_panel')}</Heading>
                        <Text fontSize="xs" color={textColor}>
                            {t('admin_dashboard.last_updated')}: {lastUpdated || 'Cargando...'}
                        </Text>
                    </VStack>
                    <HStack alignItems="center" space={2}>
                        <ThemeToggle/>
                        <HStack alignItems="center">
                            <Icon
                                as={Ionicons}
                                name="person-circle"
                                size={10}
                                color="primary.500"
                                mr={2}
                            />
                            <VStack>
                                <Text fontSize="sm" bold color={textColor}>
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
                </HStack>

                {/* Tarjetas de resumen */}
                <HStack space={2} mb={4}>
                    <StatCard
                        icon={Ionicons}
                        iconName="people"
                        title={t('dashboard_stats.total_users')}
                        value={userCargos.Admin + userCargos.Empleado + userCargos.Invitado}
                        color="primary"
                    />
                    <StatCard
                        icon={MaterialCommunityIcons}
                        iconName="card-account-details"
                        title={t('dashboard_stats.active_cards')}
                        value={activeRfidCards}
                        color="success"
                    />
                    <StatCard
                        icon={MaterialCommunityIcons}
                        iconName="card-off"
                        title={t('dashboard_stats.inactive_cards')}
                        value={inactiveRfidCards}
                        color="danger"
                    />
                </HStack>

                {/* Sección de gráficos */}
                <Heading size="md" mb={3} color={headingColor}>📊 {t('admin_dashboard.visual_statistics')}</Heading>

                {error && (
                    <Box bg="red.100" p={3} borderRadius="md" mb={4}>
                        <HStack space={2} alignItems="center">
                            <Icon as={Ionicons} name="warning" color="red.500"/>
                            <Text color="red.600">{error}</Text>
                        </HStack>
                    </Box>
                )}

                <VStack space={4} mb={4}>
                    {/* Gráfico de distribución de cargos */}
                    <Box p={4} bg={cardBg} borderRadius="lg" shadow={2}>
                        <HStack justifyContent="space-between" alignItems="center" mb={2}>
                            <Text bold color={textColor}>{t('admin_dashboard.user_distribution')}</Text>
                            <Badge colorScheme="primary" borderRadius="full" px={2}>
                                <Text
                                    fontSize="xs">{t('admin_dashboard.total')}: {userCargos.Admin + userCargos.Empleado + userCargos.Invitado}</Text>
                            </Badge>
                        </HStack>
                        {loading ? (
                            <Box height={220} justifyContent="center" alignItems="center">
                                <Spinner size="lg" color="primary.500"/>
                            </Box>
                        ) : (
                            <PieChart
                                data={userCargosPieData}
                                width={350}
                                height={200}
                                chartConfig={{
                                    backgroundColor: chartBgColor,
                                    backgroundGradientFrom: chartBgColor,
                                    backgroundGradientTo: chartBgColor,
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(${hexToRgb(textColor).join(', ')}, ${opacity})`,
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
                    <Box p={4} bg={cardBg} borderRadius="lg" shadow={2}>
                        <HStack justifyContent="space-between" alignItems="center" mb={2}>
                            <Text bold color={textColor}>{t('admin_dashboard.rfid_card_status')}</Text>
                            <Badge colorScheme="info" borderRadius="full" px={2}>
                                <Text fontSize="xs">Total: {(activeRfidCards || 0) + (inactiveRfidCards || 0)}</Text>
                            </Badge>
                        </HStack>
                        {loading ? (
                            <Box height={220} justifyContent="center" alignItems="center">
                                <Spinner size="lg" color="primary.500"/>
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
    );
};


export default EmpleadoDashboardScreen;
