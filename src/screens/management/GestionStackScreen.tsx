import React from 'react';
import {
    NativeBaseProvider,
    ScrollView,
    Box,
    Button,
    Text,
    Icon,
    HStack,
    VStack,
    Heading,
    Badge,
    Divider,
    SimpleGrid,
    useColorModeValue
} from 'native-base';
import customTheme from "../../themes";
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';

const GestionStackScreen = () => {
    const navigation = useNavigation();
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");

    // Configuración de las opciones del panel
    const managementOptions = [
        { title: "Usuarios", icon: "people", color: "teal", screen: "ListUsers", description: "Gestión de usuarios" },
        { title: "Accesos", icon: "lock-closed", color: "blue", screen: "AccessHistory", description: "Historial de accesos" },
        { title: "Administradores", icon: "person-add", color: "indigo", screen: "ListAdministrator", description: "Gestión de administradores" },
        { title: "Documentos", icon: "document-text", color: "purple", screen: "ListDocuments", description: "Gestión de documentos" },
        { title: "Etiquetas RFID", icon: "barcode", color: "amber", screen: "ListRfidTags", description: "Gestión de etiquetas RFID" },
        { title: "Movimientos", icon: "swap-vertical", color: "orange", screen: "ListDocumentMovements", description: "Movimientos de documentos" },
        { title: "Tarjetas RFID", icon: "card", color: "red", screen: "ListRfidCard", description: "Gestión de tarjetas RFID" },
        { title: "Estadísticas", icon: "stats-chart", color: "green", screen: "Graficas", description: "Estadísticas del sistema" }
    ];

    return (
        <NativeBaseProvider theme={customTheme}>
             <Box safeArea p={4} flex={1}>
                    {/* Header */}
                    <VStack space={2} mb={6}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Heading size="xl" color={textColor}>Panel de Gestión</Heading>
                            <Badge colorScheme="primary" borderRadius="full" px={3} py={1}>
                                <Text color="white" fontSize="xs">Admin</Text>
                            </Badge>
                        </HStack>
                        <Text color="gray.500">Gestión completa del sistema</Text>
                        <Divider my={2} />
                    </VStack>

                    {/* Cuadrícula de opciones */}
                    <Box flex={1} width={370}  alignItems={"center"}>
                        <SimpleGrid columns={2} space={4} mb={5}>
                            {managementOptions.map((option, index) => (
                                <Button
                                    key={index}
                                    onPress={() => navigation.navigate(option.screen)}
                                    bg={cardBg}
                                    borderRadius="xl"
                                    shadow={2}
                                    _pressed={{ bg: "gray.100" }}
                                    height={140}
                                    width={180}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Icon as={Ionicons}  minWidth={110} name={option.icon} size={8} textAlign="center" color={`${option.color}.500`} mb={2} />
                                    <Text bold color={textColor} fontSize="md" textAlign="center" numberOfLines={1}>
                                        {option.title}
                                    </Text>
                                    <Text color="gray.500" fontSize="xs" textAlign="center" mt={1} numberOfLines={2}>
                                        {option.description}
                                    </Text>
                                </Button>
                            ))}
                        </SimpleGrid>
                    </Box>
                </Box>
        </NativeBaseProvider>
    );
};

export default GestionStackScreen;
