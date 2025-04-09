import React, {useState, useEffect} from "react";
import {
    NativeBaseProvider,
    ScrollView,
    Box,
    Input,
    FormControl,
    Button,
    Icon,
    VStack,
    HStack,
    Text,
    Heading,
    Select,
    CheckIcon,
    Divider,
    useToast,
    Alert,
    Spinner,
    IconButton,
    useColorModeValue
} from "native-base";
import {useNavigation} from '@react-navigation/native';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import customTheme from "../../themes/index";
import {API_URL} from '@env';
import {useTranslation} from "react-i18next";
import Header from "../../components/Header";

const AddUserScreen = () => {
    const navigation = useNavigation();
    const toast = useToast();

    // Estado del formulario
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellido: '',
        Cargo: '',
        Correo: '',
        Contraseña: '',
        Telefono: '',
        ID_Tarjeta_RFID: '',
        Estado: 'activo'
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [tarjetas, setTarjetas] = useState([]);
    const [fetchingTarjetas, setFetchingTarjetas] = useState(true);

    // Opciones para los selects
    const cargos = [
        {label: 'Administrador', value: 'administrador'},
        {label: 'Empleado', value: 'empleado'},
        {label: 'Invitado', value: 'invitado'},
    ];

    const estados = [
        {label: 'Activo', value: 'activo'},
        {label: 'Inactivo', value: 'inactivo'},
    ];

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
    const dividerColor = useColorModeValue("gray.200", "gray.700");
    const headingColor = useColorModeValue("primary.600", "primary.300");
    const iconColor = useColorModeValue("gray.400", "gray.300");
    const placeholderColor = useColorModeValue("gray.400", "gray.500");
    const inputBg = useColorModeValue("white", "gray.700");
    const selectBg = useColorModeValue("gray.100", "gray.700"); // Fondo gris oscuro para selects
    const selectTextColor = useColorModeValue("gray.800", "white");
    const selectPlaceholderColor = useColorModeValue("gray.500", "gray.400");
    const selectIconColor = useColorModeValue("gray.500", "gray.300");

    // Obtener tarjetas RFID disponibles
    useEffect(() => {
        const fetchTarjetas = async () => {
            try {
                setFetchingTarjetas(true);
                const response = await fetch(`${API_URL}/api/rfidCards/rfid-list-disponible`);
                const data = await response.json();

                const tarjetasDisponibles = data
                    .filter(item => !item.ID_Usuario)
                    .map(item => ({
                        label: item.Codigo_RFID,
                        value: item.ID_Tarjeta_RFID
                    }));

                setTarjetas(tarjetasDisponibles);
            } catch (error) {
                console.error("Error fetching tarjetas RFID:", error);
                toast.show({
                    title: "Error",
                    description: "No se pudieron cargar las tarjetas RFID",
                    status: "error",
                    placement: "top"
                });
            } finally {
                setFetchingTarjetas(false);
            }
        };

        fetchTarjetas();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    // Validar el formulario
    const validateForm = () => {
        const requiredFields = ['Nombre', 'Apellido', 'Cargo', 'Correo', 'Contraseña', 'Telefono', 'Estado'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            toast.show({
                title: "Campos requeridos",
                description: `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`,
                status: "error",
                placement: "top"
            });
            return false;
        }

        if (formData.Contraseña !== confirmPassword) {
            toast.show({
                title: "Error",
                description: "Las contraseñas no coinciden",
                status: "error",
                placement: "top"
            });
            return false;
        }

        if (formData.Contraseña.length < 6) {
            toast.show({
                title: "Error",
                description: "La contraseña debe tener al menos 6 caracteres",
                status: "error",
                placement: "top"
            });
            return false;
        }

        return true;
    };

    // Enviar el formulario
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/users/register-user`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al registrar el usuario");
            }

            toast.show({
                title: "Éxito",
                description: "Usuario registrado correctamente",
                status: "success",
                placement: "top"
            });

            // Limpiar formulario
            setFormData({
                Nombre: '',
                Apellido: '',
                Cargo: '',
                Correo: '',
                Contraseña: '',
                Telefono: '',
                ID_Tarjeta_RFID: '',
                Estado: 'activo'
            });
            setConfirmPassword("");

            // Redirigir después de 1.5 segundos
            setTimeout(() => navigation.goBack(), 1500);
        } catch (error) {
            console.error("Registration error:", error);
            toast.show({
                title: "Error",
                description: error.message,
                status: "error",
                placement: "top"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}} bg={bgColor}>
                <Box safeArea flex={1} p={5}>
                    {/* Header */}
                    <Header title={t('addUser.title')} iconName={"person-add"}/>

                    {/* Form Section */}
                    <Box mt={4} p={5} borderRadius="xl" shadow={2} bg={cardBg}>
                        <VStack space={4}>
                            {/* Personal Info */}
                            <Heading size="md" color={headingColor}>{t('addUser.personalInformation')}</Heading>
                            <Divider mb={2} bg={dividerColor}/>

                            <FormControl isRequired>
                                <FormControl.Label
                                    _text={{color: textColor}}>{t('addUser.firstName')}</FormControl.Label>
                                <Input
                                    value={formData.Nombre}
                                    onChangeText={(text) => handleChange('Nombre', text)}
                                    placeholder={t('addUser.namePlaceholder')}
                                    placeholderTextColor={placeholderColor}
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={dividerColor}
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="person" size={5} ml={2} color={iconColor}/>
                                    }
                                    _focus={{
                                        borderColor: headingColor,
                                        bg: inputBg
                                    }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label
                                    _text={{color: textColor}}>{t('addUser.lastName')}</FormControl.Label>
                                <Input
                                    value={formData.Apellido}
                                    onChangeText={(text) => handleChange('Apellido', text)}
                                    placeholder={t('addUser.lastNamePlaceholder')}
                                    placeholderTextColor={placeholderColor}
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={dividerColor}
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="people" size={5} ml={2} color={iconColor}/>
                                    }
                                    _focus={{
                                        borderColor: headingColor,
                                        bg: inputBg
                                    }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label _text={{color: textColor}}>{t('addUser.email')}</FormControl.Label>
                                <Input
                                    value={formData.Correo}
                                    onChangeText={(text) => handleChange('Correo', text)}
                                    placeholder={t('addUser.emailPlaceholder')}
                                    placeholderTextColor={placeholderColor}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={dividerColor}
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="mail" size={5} ml={2} color={iconColor}/>
                                    }
                                    _focus={{
                                        borderColor: headingColor,
                                        bg: inputBg
                                    }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label _text={{color: textColor}}>{t('addUser.phone')}</FormControl.Label>
                                <Input
                                    value={formData.Telefono}
                                    onChangeText={(text) => handleChange('Telefono', text)}
                                    placeholder={t('addUser.phonePlaceholder')}
                                    placeholderTextColor={placeholderColor}
                                    keyboardType="phone-pad"
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={dividerColor}
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="call" size={5} ml={2} color={iconColor}/>
                                    }
                                    _focus={{
                                        borderColor: headingColor,
                                        bg: inputBg
                                    }}
                                />
                            </FormControl>

                            {/* Security Info */}
                            <Heading size="md" color={headingColor} mt={4}>{t('addUser.security')}</Heading>
                            <Divider mb={2} bg={dividerColor}/>

                            <FormControl isRequired>
                                <FormControl.Label
                                    _text={{color: textColor}}>{t('addUser.password')}</FormControl.Label>
                                <Input
                                    value={formData.Contraseña}
                                    onChangeText={(text) => handleChange('Contraseña', text)}
                                    placeholder={t('addUser.passwordPlaceholder')}
                                    placeholderTextColor={placeholderColor}
                                    secureTextEntry
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={dividerColor}
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="lock-closed" size={5} ml={2} color={iconColor}/>
                                    }
                                    _focus={{
                                        borderColor: headingColor,
                                        bg: inputBg
                                    }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label
                                    _text={{color: textColor}}>{t('addUser.confirmPassword')}</FormControl.Label>
                                <Input
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder={t('addUser.confirmPasswordPlaceholder')}
                                    placeholderTextColor={placeholderColor}
                                    secureTextEntry
                                    bg={inputBg}
                                    color={textColor}
                                    borderColor={dividerColor}
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="lock-closed" size={5} ml={2} color={iconColor}/>
                                    }
                                    _focus={{
                                        borderColor: headingColor,
                                        bg: inputBg
                                    }}
                                />
                            </FormControl>

                            {/* Configuration */}
                            <Heading size="md" color={headingColor} mt={4}>{t('addUser.configuration')}</Heading>
                            <Divider mb={2} bg={dividerColor}/>

                            <FormControl isRequired>
                                <FormControl.Label
                                    _text={{color: textColor}}>{t('addUser.position')}</FormControl.Label>
                                <Select
                                    selectedValue={formData.Cargo}
                                    minWidth="200"
                                    accessibilityLabel={t('addUser.positionPlaceholder')}
                                    placeholder={t('addUser.positionPlaceholder')}
                                    placeholderTextColor={selectPlaceholderColor}
                                    bg={selectBg}
                                    color={selectTextColor}
                                    dropdownIcon={
                                        <Icon as={Ionicons} name="chevron-down" size={4} mr={2}
                                              color={selectIconColor}/>
                                    }
                                    _selectedItem={{
                                        bg: "primary.500",
                                        endIcon: <CheckIcon size="4" color="white"/>,
                                        _text: {color: "white"}
                                    }}
                                    onValueChange={(value) => handleChange('Cargo', value)}
                                >
                                    {cargos.map((cargo, index) => (
                                        <Select.Item
                                            key={index}
                                            label={cargo.label}
                                            value={cargo.value}
                                        />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label _text={{color: textColor}}>{t('addUser.status')}</FormControl.Label>
                                <Select
                                    selectedValue={formData.Estado}
                                    minWidth="200"
                                    accessibilityLabel={t('addUser.statusPlaceholder')}
                                    placeholder={t('addUser.statusPlaceholder')}
                                    placeholderTextColor={selectPlaceholderColor}
                                    bg={selectBg}
                                    color={selectTextColor}
                                    dropdownIcon={
                                        <Icon as={Ionicons} name="chevron-down" size={4} mr={2}
                                              color={selectIconColor}/>
                                    }
                                    _selectedItem={{
                                        bg: "primary.500",
                                        endIcon: <CheckIcon size="4" color="white"/>,
                                        _text: {color: "white"}
                                    }}
                                    onValueChange={(value) => handleChange('Estado', value)}
                                >
                                    {estados.map((estado, index) => (
                                        <Select.Item
                                            key={index}
                                            label={estado.label}
                                            value={estado.value}
                                        />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormControl.Label
                                    _text={{color: textColor}}>{t('addUser.rfidCard')}</FormControl.Label>
                                {fetchingTarjetas ? (
                                    <HStack space={2} alignItems="center">
                                        <Spinner size="sm" color={iconColor}/>
                                        <Text color={textColor}>{t('addUser.loadingCards')}</Text>
                                    </HStack>
                                ) : (
                                    <Select
                                        selectedValue={formData.ID_Tarjeta_RFID}
                                        minWidth="200"
                                        accessibilityLabel={t('addUser.rfidCardPlaceholder')}
                                        placeholder={tarjetas.length ? t('addUser.rfidCardPlaceholder') : "No hay tarjetas disponibles"}
                                        placeholderTextColor={selectPlaceholderColor}
                                        bg={selectBg}
                                        color={selectTextColor}
                                        dropdownIcon={
                                            <Icon as={Ionicons} name="chevron-down" size={4} mr={2}
                                                  color={selectIconColor}/>
                                        }
                                        _selectedItem={{
                                            bg: "primary.500",
                                            endIcon: <CheckIcon size="4" color="white"/>,
                                            _text: {color: "white"}
                                        }}
                                        onValueChange={(value) => handleChange('ID_Tarjeta_RFID', value)}
                                        isDisabled={tarjetas.length === 0}
                                    >
                                        {tarjetas.map((tarjeta, index) => (
                                            <Select.Item
                                                key={index}
                                                label={tarjeta.label}
                                                value={tarjeta.value}
                                            />
                                        ))}
                                    </Select>
                                )}
                                {tarjetas.length === 0 && !fetchingTarjetas && (
                                    <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                                        {t('addUser.noCardsAvailable')}
                                    </Text>
                                )}
                            </FormControl>

                            {/* Action Buttons */}
                            <Button.Group space={2} mt={6}>
                                <Button
                                    flex={1}
                                    variant="outline"
                                    colorScheme="danger"
                                    onPress={() => navigation.goBack()}
                                    leftIcon={<Icon as={Ionicons} name="close" size={5}/>}
                                    isDisabled={loading}
                                    _text={{color: textColor}}>
                                    {t('addUser.cancel')}
                                </Button>
                                <Button
                                    flex={1}
                                    colorScheme="primary"
                                    onPress={handleSubmit}
                                    leftIcon={<Icon as={Ionicons} name="save" size={5}/>}
                                    isLoading={loading}
                                    isLoadingText="Registrando...">
                                    {t('addUser.register')}
                                </Button>
                            </Button.Group>
                        </VStack>
                    </Box>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AddUserScreen;