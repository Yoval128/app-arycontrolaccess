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
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmpleadoStackScreen = () => {
    const navigation = useNavigation();

    // Colores adaptables al tema
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const headingColor = useColorModeValue("primary.600", "primary.300");
    const dividerColor = useColorModeValue("gray.200", "gray.600");
    const pressedBg = useColorModeValue("gray.100", "gray.700");
    const descriptionColor = useColorModeValue("gray.500", "gray.400");

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    // Configuración de las opciones del panel
    const managementOptions = [
        { title: t('management.users'), icon: "people", color: "teal", screen: "ListUsers", description: t('management.user_management') },
        { title: t('management.accesses'), icon: "lock-closed", color: "blue", screen: "AccessHistory", description: t('management.access_history')},
        { title: t('management.documents'), icon: "document-text", color: "purple", screen: "ListDocuments", description: t('management.document_management') },
        { title: t('management.rfid_labels'), icon: "barcode", color: "amber", screen: "ListRfidTags", description: t('management.rfid_labels_management') },
        { title: t('management.movements'), icon: "swap-vertical", color: "orange", screen: "ListDocumentMovements", description: t('management.document_movements') },
        { title: t('management.rfid_cards'), icon: "card", color: "red", screen: "ListRfidCard", description: t('management.rfid_cards_management') },
        { title: t('management.statistics'), icon: "stats-chart", color: "green", screen: "Graficas", description: t('management.system_statistics') }
    ];

    // Función para cambiar el idioma y guardar la preferencia
    const changeAppLanguage = async (lng) => {
        try {
            await i18n.changeLanguage(lng);
            await AsyncStorage.setItem('userLanguage', lng);
        } catch (error) {
            console.error("Error changing language:", error);
        }
    };

    return (
        <Box safeArea p={4} flex={1} bg={useColorModeValue("gray.50", "gray.900")}>
            {/* Header */}
            <VStack space={2} mb={6}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Heading size="xl" color={headingColor}>{t('management.management_panel')}</Heading>
                    <HStack space={2}>
                        <ThemeToggle />

                    </HStack>
                </HStack>
                <Text color={descriptionColor}>{t('management.full_management')}</Text>
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
export default EmpleadoStackScreen;
