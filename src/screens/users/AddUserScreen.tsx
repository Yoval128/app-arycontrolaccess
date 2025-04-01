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
    Spinner, IconButton
} from "native-base";
import {useNavigation} from '@react-navigation/native';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import customTheme from "../../themes/index";
import {API_URL} from '@env';

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
                    status: "error"
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
            <ScrollView contentContainerStyle={{flexGrow: 1}} bg="gray.50">
                <Box safeArea flex={1} p={4}>
                    {/* Header */}
                    <Box bg="primary.600" p={4} borderBottomRadius="xl" shadow={4}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="person-add" size={6} color="white" />
                                <Heading color="white" size="lg">Nuevo Usuario</Heading>
                            </HStack>
                            <IconButton
                                icon={<Icon as={Ionicons} name="arrow-back" size={6} color="white" />}
                                onPress={() => navigation.goBack()}
                            />
                        </HStack>
                    </Box>

                    {/* Form Section */}
                    <Box mt={4} bg="white" p={5} borderRadius="xl" shadow={2}>
                        <VStack space={4}>
                            {/* Personal Info */}
                            <Heading size="md" color="primary.600">Información Personal</Heading>
                            <Divider mb={2} />

                            <FormControl isRequired>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    value={formData.Nombre}
                                    onChangeText={(text) => handleChange('Nombre', text)}
                                    placeholder="Ingrese el nombre"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="person" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label>Apellido</FormControl.Label>
                                <Input
                                    value={formData.Apellido}
                                    onChangeText={(text) => handleChange('Apellido', text)}
                                    placeholder="Ingrese el apellido"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="people" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label>Correo Electrónico</FormControl.Label>
                                <Input
                                    value={formData.Correo}
                                    onChangeText={(text) => handleChange('Correo', text)}
                                    placeholder="Ingrese el correo"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="mail" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label>Teléfono</FormControl.Label>
                                <Input
                                    value={formData.Telefono}
                                    onChangeText={(text) => handleChange('Telefono', text)}
                                    placeholder="Ingrese el teléfono"
                                    keyboardType="phone-pad"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="call" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            {/* Security Info */}
                            <Heading size="md" color="primary.600" mt={4}>Seguridad</Heading>
                            <Divider mb={2} />

                            <FormControl isRequired>
                                <FormControl.Label>Contraseña</FormControl.Label>
                                <Input
                                    value={formData.Contraseña}
                                    onChangeText={(text) => handleChange('Contraseña', text)}
                                    placeholder="Ingrese la contraseña"
                                    secureTextEntry
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="lock-closed" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label>Confirmar Contraseña</FormControl.Label>
                                <Input
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirme la contraseña"
                                    secureTextEntry
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="lock-closed" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            {/* Configuration */}
                            <Heading size="md" color="primary.600" mt={4}>Configuración</Heading>
                            <Divider mb={2} />

                            <FormControl isRequired>
                                <FormControl.Label>Cargo</FormControl.Label>
                                <Select
                                    selectedValue={formData.Cargo}
                                    minWidth="200"
                                    accessibilityLabel="Seleccione un cargo"
                                    placeholder="Seleccione un cargo"
                                    _selectedItem={{
                                        bg: "primary.500",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                    onValueChange={(value) => handleChange('Cargo', value)}
                                    leftIcon={
                                        <Icon as={Ionicons} name="briefcase" size={5} ml={2} color="gray.400" />
                                    }
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
                                <FormControl.Label>Estado</FormControl.Label>
                                <Select
                                    selectedValue={formData.Estado}
                                    minWidth="200"
                                    accessibilityLabel="Seleccione un estado"
                                    placeholder="Seleccione un estado"
                                    _selectedItem={{
                                        bg: "primary.500",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                    onValueChange={(value) => handleChange('Estado', value)}
                                    leftIcon={
                                        <Icon as={MaterialCommunityIcons} name="account-check" size={5} ml={2} color="gray.400" />
                                    }
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
                                <FormControl.Label>Tarjeta RFID</FormControl.Label>
                                {fetchingTarjetas ? (
                                    <HStack space={2} alignItems="center">
                                        <Spinner size="sm" />
                                        <Text>Cargando tarjetas disponibles...</Text>
                                    </HStack>
                                ) : (
                                    <Select
                                        selectedValue={formData.ID_Tarjeta_RFID}
                                        minWidth="200"
                                        accessibilityLabel="Seleccione una tarjeta"
                                        placeholder={tarjetas.length ? "Seleccione una tarjeta" : "No hay tarjetas disponibles"}
                                        _selectedItem={{
                                            bg: "primary.500",
                                            endIcon: <CheckIcon size="5" />
                                        }}
                                        onValueChange={(value) => handleChange('ID_Tarjeta_RFID', value)}
                                        isDisabled={tarjetas.length === 0}
                                        leftIcon={
                                            <Icon as={MaterialCommunityIcons} name="card-account-details" size={5} ml={2} color="gray.400" />
                                        }
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
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        No hay tarjetas RFID disponibles
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
                                    leftIcon={<Icon as={Ionicons} name="close" size={5} />}
                                    isDisabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    flex={1}
                                    colorScheme="primary"
                                    onPress={handleSubmit}
                                    leftIcon={<Icon as={Ionicons} name="save" size={5} />}
                                    isLoading={loading}
                                    isLoadingText="Registrando..."
                                >
                                    Registrar
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