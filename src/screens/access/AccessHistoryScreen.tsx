import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Spinner,
    HStack,
    VStack,
    NativeBaseProvider,
    Box,
    Heading,
    Center,
    useToast,
    Button,
    Icon,
    useColorModeValue
} from "native-base";
import { API_URL } from "@env";
import customTheme from "../../themes/index";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { DatePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";

const AccessHistoryScreen = () => {
    const [accessHistory, setAccessHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const toast = useToast();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
    const headingBg = useColorModeValue("primary.500", "primary.700");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const buttonBg = useColorModeValue("primary.500", "primary.600");

    // Función para cargar el historial
    const fetchAccessHistory = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`${API_URL}/api/access/list-access-detailed`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAccessHistory(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching access history:", error);
            setError("Error al cargar el historial");

            toast.show({
                title: "Error",
                description: "No se pudo cargar el historial de accesos",
                status: "error",
                placement: "top"
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [toast]);

    // Cargar datos cuando el componente recibe foco
    useFocusEffect(
        useCallback(() => {
            fetchAccessHistory();
        }, [fetchAccessHistory])
    );

    // Establecer intervalo para refrescar cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            fetchAccessHistory();
        }, 5000); // Refrescar cada 5 segundos

        return () => clearInterval(interval);
    }, [fetchAccessHistory]);

    // Función para formatear la fecha
    const formatDateTime = (dateTimeString) => {
        return format(new Date(dateTimeString), "dd/MM/yyyy HH:mm");
    };

    // Filtrar accesos por la fecha seleccionada
    useEffect(() => {
        if (selectedDate) {
            const filteredData = accessHistory.filter((item) => {
                const itemDate = format(new Date(item.Fecha_Hora), "yyyy-MM-dd");
                return itemDate === format(new Date(selectedDate), "yyyy-MM-dd");
            });
            setFilteredHistory(filteredData);
        } else {
            setFilteredHistory(accessHistory);
        }
    }, [selectedDate, accessHistory]);

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} bg={bgColor} safeArea>
                <VStack px={4} pt={4} space={4}>
                    <Heading
                        size="lg"
                        color="white"
                        padding="2"
                        bg={headingBg}
                        p={4}
                        borderRadius="md"
                        shadow={3}
                        justifyContent="center"
                        textAlign="center"
                    >
                        Historial de Accesos
                    </Heading>
                    <Text color={secondaryTextColor}>Registros de accesos detectados mediante tarjetas RFID</Text>

                    {/* Botón para seleccionar la fecha */}
                    <Button
                        onPress={() => setDatePickerVisible(true)}
                        leftIcon={<Icon as={Ionicons} name="calendar-outline" />}
                        bg={buttonBg}
                    >
                        {selectedDate ? format(new Date(selectedDate), "dd/MM/yyyy") : "Seleccionar fecha"}
                    </Button>

                    {/* Modal para seleccionar la fecha */}
                    <DatePickerModal
                        locale="es"
                        mode="single"
                        visible={datePickerVisible}
                        onDismiss={() => setDatePickerVisible(false)}
                        date={selectedDate ? new Date(selectedDate) : undefined}
                        onConfirm={(params) => {
                            setDatePickerVisible(false);
                            setSelectedDate(params.date);
                        }}
                    />
                </VStack>

                {/* Lista filtrada */}
                <FlatList
                    data={filteredHistory}
                    keyExtractor={(item) => item.ID_Acceso.toString()}
                    contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 4 }}
                    refreshing={refreshing}
                    onRefresh={fetchAccessHistory}
                    renderItem={({ item }) => (
                        <Box
                            bg={cardBg}
                            p={4}
                            mb={3}
                            borderRadius="md"
                            shadow={1}
                            borderLeftWidth={4}
                            borderLeftColor={item.Tipo_Acceso === 'Ingreso' ? 'green.500' : 'red.500'}
                        >
                            <VStack space={2}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                                        {item.Nombre} {item.Apellido}
                                    </Text>
                                    <Text fontSize="xs" color={secondaryTextColor}>
                                        {formatDateTime(item.Fecha_Hora)}
                                    </Text>
                                </HStack>

                                <Text fontSize="sm" color={secondaryTextColor}>
                                    <Text fontWeight="semibold" color={textColor}>Cargo:</Text> {item.Cargo}
                                </Text>

                                <Text fontSize="sm" color={secondaryTextColor}>
                                    <Text fontWeight="semibold" color={textColor}>Tarjeta RFID:</Text> {item.Codigo_RFID}
                                </Text>

                                <HStack justifyContent="space-between" mt={2}>
                                    <Box
                                        px={2}
                                        py={1}
                                        bg={item.Tipo_Acceso === 'Ingreso' ? 'green.100' : 'red.100'}
                                        borderRadius="full"
                                    >
                                        <Text
                                            color={item.Tipo_Acceso === 'Ingreso' ? 'green.800' : 'red.800'}
                                            fontSize="xs"
                                            fontWeight="bold"
                                        >
                                            {item.Tipo_Acceso.toUpperCase()}
                                        </Text>
                                    </Box>
                                    <Text fontSize="sm" color={secondaryTextColor}>
                                        <Text fontWeight="semibold" color={textColor}>Ubicación:</Text> {item.Ubicacion}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    )}
                />
            </Box>
        </NativeBaseProvider>
    );
};

export default AccessHistoryScreen;