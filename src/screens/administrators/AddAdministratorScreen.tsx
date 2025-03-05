import React, {useState, useEffect} from "react";
import {
    Box,
    Button,
    VStack,
    Heading,
    useTheme,
    useToast,
    NativeBaseProvider,
    ScrollView,
    Select,
    CheckIcon
} from "native-base";
import {API_URL} from '@env';
import customTheme from "../../themes/index";
import {useNavigation} from "@react-navigation/native";
import {Dropdown} from "react-native-element-dropdown";

const nivelesPermiso = [
    {label: "Básico", value: "Básico"},
    {label: "Medio", value: "Medio"},
    {label: "Avanzado", value: "Avanzado"}
];

const AddAdministratorScreen = () => {
    const theme = useTheme();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({
        ID_Usuario: "",  // Inicialmente vacío
        nivelPermiso: ""
    });

    const navigation = useNavigation();

    // Función para obtener los usuarios
    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API_URL}/api/users/list-users`);
            const data = await response.json();
            // Formateamos los datos de usuarios
            const usuariosList = data.map((usuario) => ({
                label: `${usuario.Nombre} ${usuario.Apellido}`, // Mostrar el nombre completo
                value: usuario.ID_Usuario // El valor será el ID de usuario
            }));
            setUsuarios(usuariosList);
        } catch (error) {
            toast.show({
                title: "Error",
                description: "No se pudo obtener la lista de usuarios.",
                status: "error"
            });
        }
    };

    useEffect(() => {
        fetchUsuarios(); // Cargar los usuarios cuando la pantalla se monta
    }, []);

    const handleChange = (key, value) => {
        setForm({...form, [key]: value});
    };

    const handleSubmit = async () => {
        // Validaciones básicas
        if (!form.ID_Usuario || !form.nivelPermiso) {
            toast.show({
                title: "Error",
                description: "Todos los campos son obligatorios",
                status: "error"
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/administrators/register-administrator`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ID_Usuario: form.ID_Usuario,
                    Nivel_Permiso: form.nivelPermiso
                })
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                toast.show({
                    title: "Éxito",
                    description: "Administrador registrado correctamente",
                    status: "success"
                });
                setForm({ID_Usuario: "", nivelPermiso: ""});
                navigation.navigate('ListAdministrator');  // Redirigir a la lista de administradores
            } else {
                toast.show({
                    title: "Error",
                    description: data.error || "No se pudo registrar el administrador",
                    status: "error"
                });
            }
        } catch (error) {
            setLoading(false);
            toast.show({
                title: "Error",
                description: "Error de conexión con el servidor",
                status: "error"
            });
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}} keyboardShouldPersistTaps="handled">
                <Box flex={1} p={5} bg={theme.colors.primary[50]}>
                    <Heading size="lg" color={theme.colors.primary[500]}>Registro de Administrador</Heading>
                    <VStack space={4} mt={5}>
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
                            data={usuarios}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecciona un usuario"
                            searchPlaceholder="Buscar..."
                            value={form.ID_Usuario}
                            onChange={item => handleChange('ID_Usuario', item.value)}/>


                        {/* Select para seleccionar el nivel de permiso */}
                        <Select
                            selectedValue={form.nivelPermiso}  // Asegúrate de que el valor del estado esté vinculado
                            onValueChange={(value) => handleChange("nivelPermiso", value)}  // Al seleccionar, actualiza el estado
                            placeholder="Selecciona el nivel de permiso"
                            _selectedItem={{
                                bg: theme.colors.primary[500],
                                endIcon: <CheckIcon size={4}/>
                            }}
                        >
                            {nivelesPermiso.map((item) => (
                                <Select.Item key={item.value} label={item.label} value={item.value}/>
                            ))}
                        </Select>

                        {/* Botón para registrar el administrador */}
                        <Button isLoading={loading} onPress={handleSubmit} mt={3}>Registrar Administrador</Button>
                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default AddAdministratorScreen;
