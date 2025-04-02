import React, {useEffect, useState} from "react";
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Button,
    ScrollView,
    Spinner,
    useToast,
    HStack,
    Text,
    Icon,
    Select,
    Divider,
    Badge,
    Alert,
    CheckIcon, IconButton
} from "native-base";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";
import customTheme from "../../themes/index";
import {API_URL} from "@env";

const EditUserScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {usuario_id} = route.params;
    const [user, setUser] = useState({
        Nombre: '',
        Apellido: '',
        Correo: '',
        Telefono: '',
        Cargo: '',
        Estado: '',
        ID_Tarjeta_RFID: null
    });
    const [password, setPassword] = useState("");
    const [tarjetas, setTarjetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const toast = useToast();

    const cargos = [
        {label: 'Administrador', value: 'administrador'},
        {label: 'Empleado', value: 'empleado'},
        {label: 'Invitado', value: 'invitado'},
    ];

    const estados = [
        {label: 'Activo', value: 'activo'},
        {label: 'Inactivo', value: 'inactivo'},
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userRes, tarjetasRes] = await Promise.all([
                    fetch(`${API_URL}/api/users/user/${usuario_id}`),
                    fetch(`${API_URL}/api/rfidCards/rfid-list-disponible`)
                ]);

                if (!userRes.ok) throw new Error('Error al obtener el usuario');
                if (!tarjetasRes.ok) throw new Error('Error al obtener tarjetas RFID');

                const userData = await userRes.json();
                const tarjetasData = await tarjetasRes.json();

                setUser(userData);
                setTarjetas(tarjetasData.map(item => ({
                    label: item.Codigo_RFID,
                    value: item.ID_Tarjeta_RFID
                })));
            } catch (error) {
                console.error("Error fetching data:", error);
                setFetchError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [usuario_id]);

    const handleSave = async () => {
        // Validación de campos obligatorios
        const requiredFields = ['Nombre', 'Apellido', 'Correo', 'Cargo', 'Estado'];
        const missingFields = requiredFields.filter(field => !user[field]);

        if (missingFields.length > 0) {
            toast.show({
                title: "Campos requeridos",
                description: `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`,
                status: "error",
                placement: "top"
            });
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`${API_URL}/api/users/update-user/${usuario_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...user,
                    Contraseña: password || undefined
                }),
            });

            if (!response.ok) throw new Error('Error al actualizar usuario');

            toast.show({
                title: "Éxito",
                description: "Usuario actualizado correctamente",
                status: "success",
                placement: "top"
            });

            navigation.goBack();
        } catch (error) {
            console.error("Update error:", error);
            toast.show({
                title: "Error",
                description: error.message || "Error al actualizar usuario",
                status: "error",
                placement: "top"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center">
                    <VStack space={4} alignItems="center">
                        <Spinner size="lg" color="primary.500" />
                        <Text color="gray.600">Cargando datos del usuario...</Text>
                    </VStack>
                </Box>
            </NativeBaseProvider>
        );
    }

    if (fetchError) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Box flex={1} justifyContent="center" alignItems="center" p={5}>
                    <Alert status="error" mb={4} w="100%">
                        <VStack space={2} flexShrink={1} w="100%">
                            <HStack flexShrink={1} space={2} justifyContent="space-between">
                                <HStack space={2} flexShrink={1}>
                                    <Alert.Icon mt="1" />
                                    <Text fontSize="md" color="coolGray.800">
                                        {fetchError}
                                    </Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </Alert>
                    <Button
                        onPress={() => navigation.goBack()}
                        colorScheme="primary"
                        leftIcon={<Icon as={Ionicons} name="arrow-back" />}
                    >
                        Regresar
                    </Button>
                </Box>
            </NativeBaseProvider>
        );
    }

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}} bg="gray.50">
                <Box safeArea flex={1} p={4}>
                    {/* Header */}
                    <Box bg="primary.600" p={4} borderBottomRadius="xl" shadow={4}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <HStack alignItems="center" space={3}>
                                <Icon as={Ionicons} name="person" size={6} color="white" />
                                <Heading color="white" size="lg">Editar Usuario</Heading>
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
                                    value={user.Nombre}
                                    onChangeText={(text) => setUser({...user, Nombre: text})}
                                    placeholder="Ingrese el nombre"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="person" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label>Apellido</FormControl.Label>
                                <Input
                                    value={user.Apellido}
                                    onChangeText={(text) => setUser({...user, Apellido: text})}
                                    placeholder="Ingrese el apellido"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="people" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label>Correo Electrónico</FormControl.Label>
                                <Input
                                    value={user.Correo}
                                    onChangeText={(text) => setUser({...user, Correo: text})}
                                    placeholder="Ingrese el correo"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="mail" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <FormControl.Label>Teléfono</FormControl.Label>
                                <Input
                                    value={user.Telefono}
                                    onChangeText={(text) => setUser({...user, Telefono: text})}
                                    placeholder="Ingrese el teléfono"
                                    keyboardType="phone-pad"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="call" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <FormControl.Label>Contraseña (dejar en blanco para no cambiar)</FormControl.Label>
                                <Input
                                    value={password}
                                    secureTextEntry
                                    onChangeText={setPassword}
                                    placeholder="Nueva contraseña"
                                    InputLeftElement={
                                        <Icon as={Ionicons} name="lock-closed" size={5} ml={2} color="gray.400" />
                                    }
                                />
                            </FormControl>

                            {/* Role and Status */}
                            <Heading size="md" color="primary.600" mt={4}>Configuración</Heading>
                            <Divider mb={2} />

                            <FormControl isRequired>
                                <FormControl.Label>Cargo</FormControl.Label>
                                <Select
                                    selectedValue={user.Cargo}
                                    minWidth="200"
                                    accessibilityLabel="Seleccione un cargo"
                                    placeholder="Seleccione un cargo"
                                    _selectedItem={{
                                        bg: "primary.500",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                    onValueChange={(value) => setUser({...user, Cargo: value})}
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
                                    selectedValue={user.Estado}
                                    minWidth="200"
                                    accessibilityLabel="Seleccione un estado"
                                    placeholder="Seleccione un estado"
                                    _selectedItem={{
                                        bg: "primary.500",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                    onValueChange={(value) => setUser({...user, Estado: value})}
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
                                <Select
                                    selectedValue={user.ID_Tarjeta_RFID}
                                    minWidth="200"
                                    accessibilityLabel="Seleccione una tarjeta"
                                    placeholder={tarjetas.length ? "Seleccione una tarjeta" : "No hay tarjetas disponibles"}
                                    _selectedItem={{
                                        bg: "primary.500",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                    onValueChange={(value) => setUser({...user, ID_Tarjeta_RFID: value})}
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
                                {tarjetas.length === 0 && (
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        No hay tarjetas RFID disponibles
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>

                        {/* Action Buttons */}
                        <Button.Group space={2} mt={6}>
                            <Button
                                flex={1}
                                variant="outline"
                                colorScheme="danger"
                                onPress={() => navigation.goBack()}
                                leftIcon={<Icon as={Ionicons} name="close" size={5} />}
                                isDisabled={saving}
                            >
                                Cancelar
                            </Button>
                            <Button
                                flex={1}
                                colorScheme="primary"
                                onPress={handleSave}
                                leftIcon={<Icon as={Ionicons} name="save" size={5} />}
                                isLoading={saving}
                                isLoadingText="Guardando..."
                            >
                                Guardar Cambios
                            </Button>
                        </Button.Group>
                    </Box>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default EditUserScreen;