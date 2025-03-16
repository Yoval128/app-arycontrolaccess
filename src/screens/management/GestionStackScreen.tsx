import React from 'react';
import {
    NativeBaseProvider,
    ScrollView,
    Box,
    Grid,
    Col,
    Button,
    Text,
    Icon,
    HStack,
    VStack,
    Heading,
} from 'native-base';
import customTheme from "../../themes";  // Asegúrate de tener este archivo de tema personalizado
import {useNavigation} from '@react-navigation/native';  // Asegúrate de importar useNavigation
import {Ionicons} from '@expo/vector-icons'; // Usamos expo-icons correctamente

const GestionStackScreen = () => {
    const navigation = useNavigation();  // Inicializa la función de navegación

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <HStack justifyContent="space-between" alignItems="center" mb={5} p={3} bg="secondary.500"
                            borderRadius="lg" shadow={2}>
                        <HStack alignItems="center">
                            <VStack ml={3}>
                                <Heading size="md" mb={3} bold color="white" textAlign="center">Panel de
                                    Gestión</Heading>
                            </VStack>
                        </HStack>
                    </HStack>

                    {/* Cuadrícula de opciones */}
                    <HStack space={3} mb={5}>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1} justifyContent="center"
                             alignItems="center">
                            <Button onPress={() => navigation.navigate('ListUsers')} size="lg" colorScheme="teal">
                                <Ionicons name="person" size={24} color="white"/>
                            </Button>
                            <Text bold mt={2} textAlign="center">Usuarios</Text>
                        </Box>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1} justifyContent="center"
                             alignItems="center">
                            <Button onPress={() => navigation.navigate('AccessHistory')} size="lg" colorScheme="teal">
                                <Ionicons name="lock-closed" size={24} color="white"/>
                            </Button>
                            <Text bold mt={2} textAlign="center">Accesos</Text>
                        </Box>
                    </HStack>

                    <HStack space={3} mb={5}>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1} justifyContent="center"
                             alignItems="center">
                            <Button onPress={() => navigation.navigate('ListAdministrator')} size="lg"
                                    colorScheme="teal">
                                <Ionicons name="person-add" size={24} color="white"/>
                            </Button>
                            <Text bold mt={2} textAlign="center">Administradores</Text>
                        </Box>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1} justifyContent="center"
                             alignItems="center">
                            <Button onPress={() => navigation.navigate('ListDocuments')} size="lg" colorScheme="teal">
                                <Ionicons name="document" size={24} color="white"/>
                            </Button>
                            <Text bold mt={2} textAlign="center">Documentos</Text>
                        </Box>
                    </HStack>

                    <HStack space={3} mb={5}>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1} justifyContent="center"
                             alignItems="center">
                            <Button onPress={() => navigation.navigate('ListRfidTags')} size="lg"
                                    colorScheme="teal">
                                <Ionicons name="barcode" size={24} color="white"/>
                            </Button>
                            <Text bold mt={2} textAlign="center">Etiquetas RFID</Text>
                        </Box>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1} justifyContent="center"
                             alignItems="center">
                            <Button onPress={() => navigation.navigate('ListDocumentMovements')} size="lg"
                                    colorScheme="teal">
                                <Ionicons name="clipboard" size={24} color="white"/>
                            </Button>
                            <Text bold mt={2} textAlign="center">Movimientos Documentos</Text>
                        </Box>
                    </HStack>

                    <HStack space={3} mb={5}>
                        <Box flex={1} p={5} bg="white" borderRadius="lg" shadow={1} justifyContent="center"
                             alignItems="center">
                            <Button onPress={() => navigation.navigate('ListRfidCard')} size="lg"
                                    colorScheme="teal">
                                <Ionicons name="card" size={24} color="white"/>
                            </Button>
                            <Text bold mt={2} textAlign="center">Tarjetas RFID</Text>
                        </Box>

                    </HStack>

                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default GestionStackScreen;
