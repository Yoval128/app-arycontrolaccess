import React from 'react';
import { NativeBaseProvider, Box, VStack, Button, Heading } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import customTheme from "../../themes";
import { useNavigation } from "@react-navigation/native";

const UploadsDashboardScreen = () => {
    const navigation = useNavigation();

    return (
        <NativeBaseProvider theme={customTheme}>
            <Box safeArea p={5} bg="primary.50" flex={1}>
                <Heading size="lg" mb={5} color="black">📂 Dashboard de Subida de Archivos</Heading>
                <VStack space={4}>
                    <Button
                        leftIcon={<Ionicons name="key" size={20} color="white" />}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                    >
                        Accesos
                    </Button>
                    <Button
                        leftIcon={<Ionicons name="people" size={20} color="white" />}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                    >
                        Administradores
                    </Button>
                    <Button
                        leftIcon={<Ionicons name="document" size={20} color="white" />}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                    >
                        Documentos
                    </Button>
                    <Button
                        leftIcon={<Ionicons name="pricetag" size={20} color="white" />}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                    >
                        Etiquetas RFID
                    </Button>
                    <Button
                        leftIcon={<Ionicons name="swap-horizontal" size={20} color="white" />}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                    >
                        Movimientos de Documentos
                    </Button>
                    <Button
                        leftIcon={<Ionicons name="card" size={20} color="white" />}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                    >
                        Tarjetas RFID
                    </Button>
                    <Button
                        onPress={() => navigation.navigate('ListUsers')}
                        leftIcon={<Ionicons name="person" size={20} color="white" />}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                    >
                        Usuarios
                    </Button>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default UploadsDashboardScreen;
