import React from 'react';
import {
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
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import ThemeToggle from '../../components/ThemeToggle';

const GestionStackScreen = () => {
    const navigation = useNavigation();

    // Colores adaptables al tema
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const headingColor = useColorModeValue("primary.600", "primary.300");
    const dividerColor = useColorModeValue("gray.200", "gray.600");
    const pressedBg = useColorModeValue("gray.100", "gray.700");
    const descriptionColor = useColorModeValue("gray.500", "gray.400");

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
        <Box safeArea p={4} flex={1} bg={useColorModeValue("gray.50", "gray.900")}>
            {/* Header */}
            <VStack space={2} mb={6}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Heading size="xl" color={headingColor}>Panel de Gestión</Heading>
                    <HStack space={2}>
                        <ThemeToggle />
                        <Badge colorScheme="primary" borderRadius="full" px={3} py={1}>
                            <Text color="white" fontSize="xs">Admin</Text>
                        </Badge>
                    </HStack>
                </HStack>
                <Text color={descriptionColor}>Gestión completa del sistema</Text>
                <Divider my={2} bg={dividerColor} />
            </VStack>

            {/* Cuadrícula de opciones */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <SimpleGrid columns={2} space={4} mb={5} alignItems="center" justifyContent="center">
                    {managementOptions.map((option, index) => (
                        <Button
                            key={index}
                            onPress={() => navigation.navigate(option.screen)}
                            bg={cardBg}
                            borderRadius="xl"
                            shadow={2}
                            _pressed={{ bg: pressedBg }}
                            height={140}
                            minWidth={160}
                            maxWidth={180}
                            justifyContent="center"
                            alignItems="center"
                            mx="auto"
                        >
                            <VStack space={1} alignItems="center">
                                <Icon
                                    as={Ionicons}
                                    name={option.icon}
                                    size={8}
                                    color={`${option.color}.500`}
                                    mb={1}
                                />
                                <Text
                                    bold
                                    color={textColor}
                                    fontSize="md"
                                    textAlign="center"
                                    numberOfLines={1}
                                >
                                    {option.title}
                                </Text>
                                <Text
                                    color={descriptionColor}
                                    fontSize="xs"
                                    textAlign="center"
                                    mt={1}
                                    numberOfLines={2}
                                >
                                    {option.description}
                                </Text>
                            </VStack>
                        </Button>
                    ))}
                </SimpleGrid>
            </ScrollView>
        </Box>
    );
};

export default GestionStackScreen;