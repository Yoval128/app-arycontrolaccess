import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    NativeBaseProvider,
    Box,
    VStack,
    HStack,
    Spinner,
    Divider,
    IconButton,
    ScrollView,
    Badge,
    useColorModeValue,
    Icon,
    Button
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {useRoute, useNavigation} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import Header from "../../components/Header";
import {useTranslation} from "react-i18next";

const DetailAdministratorScreen = () => {
    const [administrator, setAdministrator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const {admin_id} = route.params;

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
    const dividerColor = useColorModeValue("gray.200", "gray.700");
    const iconColor = useColorModeValue("primary.500", "primary.300");
    const badgeTextColor = useColorModeValue("white", "gray.900");

    useEffect(() => {
        fetchAdministratorDetails();
    }, []);

    const fetchAdministratorDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/administrators/administrator/${admin_id}`);
            if (!response.ok) {
                throw new Error('Error al obtener los detalles del administrador');
            }
            const data = await response.json();
            setAdministrator(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} justifyContent="center" alignItems="center" bg={bgColor}>
                <VStack space={2} alignItems="center">
                    <Spinner size="lg" color={iconColor}/>
                    <Text color={secondaryTextColor}>{t('common.loading')}</Text>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );

    if (error) return (
        <NativeBaseProvider theme={customTheme}>
            <Box flex={1} justifyContent="center" alignItems="center" p={5} bg={bgColor}>
                <Text color="red.500" fontSize="lg">{t('common.error')}: {error}</Text>
                <Button
                    mt={4}
                    colorScheme="primary"
                    onPress={fetchAdministratorDetails}
                    leftIcon={<Icon as={Ionicons} name="refresh" />}
                >
                    {t('common.retry')}
                </Button>
            </Box>
        </NativeBaseProvider>
    );

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea flex={1} bg={bgColor} p={4}>
                {/* Header */}
                <Header title={t('AdministratorDetails.title')} iconName="person"/>

                <Box bg={cardBg} p={5} borderRadius="lg" shadow={2}>
                    <VStack space={4}>
                        {/* Sección de información principal */}
                        <HStack space={4} alignItems="center">
                            <Icon
                                as={Ionicons}
                                name="person-circle-outline"
                                size={10}
                                color={iconColor}
                            />
                            <VStack>
                                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                    {administrator?.Usuario?.Nombre} {administrator?.Usuario?.Apellido}
                                </Text>
                                <Badge
                                    colorScheme={administrator?.Usuario?.Estado === 'activo' ? 'green' : 'red'}
                                    alignSelf="flex-start"
                                    mt={1}
                                    _text={{color: badgeTextColor}}
                                >
                                    {administrator?.Usuario?.Estado === 'activo'
                                        ? t('AdministratorDetails.active')
                                        : t('AdministratorDetails.inactive')}
                                </Badge>
                            </VStack>
                        </HStack>

                        <Divider my={3} bg={dividerColor}/>

                        {/* Sección de detalles */}
                        <VStack space={4}>
                            <HStack justifyContent="space-between">
                                <HStack space={2} alignItems="center">
                                    <Icon as={Ionicons} name="id-card-outline" size={5} color={iconColor}/>
                                    <Text color={secondaryTextColor}>{t('AdministratorDetails.administratorID')}:</Text>
                                </HStack>
                                <Text fontWeight="medium" color={textColor}>{administrator?.ID_Admin}</Text>
                            </HStack>

                            <HStack justifyContent="space-between">
                                <HStack space={2} alignItems="center">
                                    <Icon as={Ionicons} name="briefcase-outline" size={5} color={iconColor}/>
                                    <Text color={secondaryTextColor}>{t('AdministratorDetails.position')}:</Text>
                                </HStack>
                                <Text fontWeight="medium" color={textColor}>
                                    {administrator?.Usuario?.Cargo || t('common.notSpecified')}
                                </Text>
                            </HStack>

                            <HStack justifyContent="space-between">
                                <HStack space={2} alignItems="center">
                                    <Icon as={Ionicons} name="shield-checkmark-outline" size={5} color={iconColor}/>
                                    <Text color={secondaryTextColor}>{t('AdministratorDetails.permissionLevel')}:</Text>
                                </HStack>
                                <Badge
                                    colorScheme={
                                        administrator?.Nivel_Permiso === 'Avanzado' ? 'red' :
                                            administrator?.Nivel_Permiso === 'Medio' ? 'orange' : 'green'
                                    }
                                    _text={{color: badgeTextColor}}
                                >
                                    {administrator?.Nivel_Permiso}
                                </Badge>

                            </HStack>
                        </VStack>
                    </VStack>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default DetailAdministratorScreen;