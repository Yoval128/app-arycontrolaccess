import React, {useEffect, useState} from "react";
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    FormControl,
    Button,
    ScrollView,
    Spinner,
    useToast, useColorModeValue
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {Dropdown} from 'react-native-element-dropdown';
import {useTranslation} from "react-i18next";
import Header from "../../components/Header";

const EditAdministratorScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {admin_id} = route.params;

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    // Opciones para el nivel de permiso
    const permisos = [
        {label: 'Básico', value: 'Básico'},
        {label: 'Medio', value: 'Medio'},
        {label: 'Avanzado', value: 'Avanzado'}
    ];

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
    const headerBg = useColorModeValue("primary.500", "primary.700");
    const iconColor = useColorModeValue("gray.600", "gray.300");
    const fabBg = useColorModeValue("primary.500", "primary.600");
    const buttonBg = useColorModeValue("white", "red");


    const fetchAdmin = async () => {
        try {
            const response = await fetch(`${API_URL}/api/administrators/administrator/${admin_id}`);
            const data = await response.json();
            setAdmin(data);
        } catch (error) {
            console.error("Error al obtener el administrador:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!admin.Nivel_Permiso) {
            toast.show({description: "El nivel de permiso es obligatorio", status: "error"});
            return;
        }

        setSaving(true);
        try {
            await fetch(`${API_URL}/api/administrators/update-administrator`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ID_Admin: admin.ID_Admin,
                    Nivel_Permiso: admin.Nivel_Permiso,
                }),
            });

            toast.show({description: "Administrador actualizado con éxito", status: "success"});
            navigation.navigate("ListAdministrator", {refresh: true});
        } catch (error) {
            console.error("Error al actualizar el administrador:", error);
            toast.show({description: "Error al actualizar", status: "error"});
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchAdmin();
    }, []);

    if (loading) return <Spinner size="lg" color="primary.500"/>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea flex={1} p={4}>
                {/* Header */}
                <Header title={t('administratorEdit.title')} iconName="pencil-outline"/>

                <VStack space={4}>
                    <FormControl>
                        <FormControl.Label>{t('administratorEdit.permissionLevel')}</FormControl.Label>
                        <Dropdown
                            data={permisos}
                            labelField="label"
                            valueField="value"
                            value={admin?.Nivel_Permiso || ''}
                            onChange={(item) => setAdmin({...admin, Nivel_Permiso: item.value})}
                            placeholder={t('administratorEdit.permissionLevelPlaceholder')}
                            style={{
                                backgroundColor: 'white',
                                padding: 10,
                                borderRadius: 8,
                                borderColor: '#ccc',
                                borderWidth: 1
                            }}
                        />
                    </FormControl>

                    <Button
                        colorScheme="secondary"
                        mt={5}
                        isLoading={saving}
                        onPress={handleSave}
                        leftIcon={<Ionicons name="save-outline" size={20} color="white"/>}
                    >
                        {t('administratorEdit.saveChanges')}
                    </Button>
                    <Button
                        mt={2}
                        onPress={() => navigation.goBack()}
                        variant="outline"
                        colorScheme="danger"
                        leftIcon={<Ionicons name="close" size={20} color="red"/>}
                    >
                        {t('administratorEdit.cancel')}
                    </Button>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default EditAdministratorScreen;
