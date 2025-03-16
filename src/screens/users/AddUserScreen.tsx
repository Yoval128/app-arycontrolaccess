import React, {useState, useEffect} from "react";
import {View, Text, NativeBaseProvider, ScrollView, Box, Input, FormControl, Button, Icon, VStack, HStack} from "native-base";
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropShadow from 'react-native-drop-shadow';
import {Ionicons} from '@expo/vector-icons';
import customTheme from "../../themes/index";
import {Dropdown} from "react-native-element-dropdown";
import {API_URL} from '@env';

const AddUserScreen = () => {
    const navigation = useNavigation();

    const [Nombre, setNombre] = useState('');
    const [Apellido, setApellido] = useState('');
    const [Cargo, setCargo] = useState('');
    const [Correo, setCorreo] = useState('');
    const [Contraseña, setContraseña] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [Telefono, setTelefono] = useState('');
    const [ID_Tarjeta_RFID, setID_Tarjeta_RFID] = useState('');
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [tarjetas, setTarjetas] = useState([]); // Aquí almacenaremos las tarjetas RFID
    const cargos = [
        {label: 'Administrador', value: 'administrador'},
        {label: 'Empleado', value: 'empleado'},
        {label: 'Invitado', value: 'invitado'},
    ];

    // Obtener la lista de tarjetas RFID
    useEffect(() => {
        fetch(`${API_URL}/api/rfidCards/rfid-list-disponible`)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.length > 0) {
                    setTarjetas(data.filter((item) => {

                        return !item.ID_Usuario;
                    }).map((item) => ({
                        label: item.Codigo_RFID,
                        value: item.ID_Tarjeta_RFID,
                    })));
                }
            })
            .catch((error) => {
                console.error("Error fetching tarjetas RFID", error);
            });
    }, []);


    const handleSubmit = () => {
        if (Contraseña !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!Correo || !Nombre || !Apellido || !Cargo || !Contraseña || !Telefono || !ID_Tarjeta_RFID) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setError("");
        setMessage("");

        const userData = {
            Nombre,
            Apellido,
            Cargo,
            Correo,
            Contraseña,
            Telefono,
            ID_Tarjeta_RFID,
        };

        fetch(`${API_URL}/api/users/register-user`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setMessage(data.message);
                    setNombre("");
                    setApellido("");
                    setCargo("");
                    setCorreo("");
                    setContraseña("");
                    setConfirmPassword("");
                    setTelefono("");
                    setID_Tarjeta_RFID("");
                    navigation.navigate('ListUsers', {refresh: true});
                } else if (data.error) {
                    setError(data.error);
                }
            })
            .catch((error) => {
                setError("Error al registrarse. Inténtalo de nuevo.");
                console.error(error);
            });
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}} keyboardShouldPersistTaps="handled">
                <Box safeArea p={5} bg="primary.50">

                    <Text fontSize="2xl" fontWeight="bold" mb={5} textAlign={"center"} bg={"primary.500"}
                          borderRadius={5} color={"white"}>
                        Agregar un nuevo usuario
                    </Text>

                    <DropShadow
                        style={{
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 0},
                            shadowOpacity: 1,
                            shadowRadius: 5,
                        }}>
                        <VStack space={4} background={"white"} padding={2} borderRadius="md" box>
                            <FormControl isRequired isInvalid={!!error}>
                                <FormControl.Label>Nombre</FormControl.Label>
                                <Input
                                    value={Nombre}
                                    onChangeText={setNombre}
                                    placeholder="Ingresa el nombre"
                                    borderColor="primary.400"
                                    _focus={{borderColor: "primary.500", bg: "primary.50"}}
                                />
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error}>
                                <FormControl.Label>Apellido</FormControl.Label>
                                <Input
                                    value={Apellido}
                                    onChangeText={setApellido}
                                    placeholder="Ingresa el apellido"
                                    borderColor="primary.400"
                                    _focus={{borderColor: "primary.500", bg: "primary.50"}}
                                />
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error}>
                                <FormControl.Label>Cargo</FormControl.Label>
                                <Dropdown
                                    style={{
                                        height: 50,
                                        borderColor: "primary.400",
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        padding: 2
                                    }}
                                    placeholderStyle={{color: "grey"}}
                                    selectedTextStyle={{color: "black"}}
                                    inputSearchStyle={{height: 40}}
                                    iconStyle={{width: 20, height: 20}}
                                    data={cargos}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Selecciona un cargo"
                                    searchPlaceholder="Buscar..."
                                    value={Cargo}
                                    onChange={item => setCargo(item.value)}
                                />
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error}>
                                <FormControl.Label>Correo</FormControl.Label>
                                <Input
                                    value={Correo}
                                    onChangeText={setCorreo}
                                    placeholder="Ingresa el correo"
                                    borderColor="primary.400"
                                    _focus={{borderColor: "primary.500", bg: "primary.50"}}
                                />
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error}>
                                <FormControl.Label>Contraseña</FormControl.Label>
                                <Input
                                    value={Contraseña}
                                    onChangeText={setContraseña}
                                    placeholder="Ingresa la contraseña"
                                    secureTextEntry
                                    borderColor="primary.400"
                                    _focus={{borderColor: "primary.500", bg: "primary.50"}}
                                />
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error}>
                                <FormControl.Label>Confirmar Contraseña</FormControl.Label>
                                <Input
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirma la contraseña"
                                    secureTextEntry
                                    borderColor="primary.400"
                                    _focus={{borderColor: "primary.500", bg: "primary.50"}}
                                />
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error}>
                                <FormControl.Label>Teléfono</FormControl.Label>
                                <Input
                                    value={Telefono}
                                    onChangeText={setTelefono}
                                    placeholder="Ingresa el teléfono"
                                    keyboardType="phone-pad"
                                    borderColor="primary.400"
                                    _focus={{borderColor: "primary.500", bg: "primary.50"}}
                                />
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error}>
                                <FormControl.Label>ID Tarjeta RFID</FormControl.Label>
                                <Dropdown
                                    style={{
                                        height: 50,
                                        borderColor: "primary.400",
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        padding: 2
                                    }}
                                    placeholderStyle={{color: "grey"}}
                                    selectedTextStyle={{color: "black"}}
                                    data={tarjetas}  // Utilizamos las tarjetas obtenidas
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Selecciona una tarjeta RFID"
                                    value={ID_Tarjeta_RFID}
                                    onChange={item => setID_Tarjeta_RFID(item.value)}
                                />
                            </FormControl>

                            <Button mt={1} onPress={handleSubmit}
                                    rightIcon={<Icon as={Ionicons} name="person-add" size="sm"/>}>
                                Agregar Usuario
                            </Button>
                            <Button mt={1} onPress={() => navigation.goBack()} variant="outline" colorScheme="danger"
                                    leftIcon={<Icon as={Ionicons} name="close" size="sm"/>}>
                                Cancelar
                            </Button>

                        </VStack>
                    </DropShadow>

                    {error ? (
                        <Box bg="red.100" p={3} mb={4} borderRadius="md">
                            <Text color="red.600">{error}</Text>
                        </Box>
                    ) : null}

                    {message ? (
                        <Box bg="green.100" p={3} mb={4} borderRadius="md">
                            <Text color="green.600">{message}</Text>
                        </Box>
                    ) : null}
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AddUserScreen;
