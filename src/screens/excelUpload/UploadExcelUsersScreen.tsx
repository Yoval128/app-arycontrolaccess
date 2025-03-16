import React, {useState} from 'react';
import {API_URL} from '@env'; // La URL de tu API
import {StyleSheet} from 'react-native';
import {NativeBaseProvider, Box, Text, VStack, Heading, Button, Spinner, ScrollView, useToast, View} from 'native-base';
import {Dropdown} from 'react-native-element-dropdown';
import {Ionicons} from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

import customTheme from '../../themes';
import {color} from "native-base/lib/typescript/theme/styled-system";

const UploadExcelUsersScreen = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            console.log(file);
            console.log(URL.createObjectURL(file));
            console.log(".....7777");
        } else {
            console.log('El usuario canceló la selección del archivo');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            console.log('No se ha seleccionado ningún archivo');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/api/uploads/upload-excel-usuarios`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Datos cargados correctamente:', response.data);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    };

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="primary.100" flex={1}>
                    <Heading size="md" mb={3} color="secondary.500">Subir Archivo Excel</Heading>
                    <Box>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            style={styles.inputFile}
                        />
                        <Ionicons name="cloud-upload-outline" size={24} color="white" style={styles.icon}/>

                    </Box>
                    <Button
                        onPress={handleUpload}
                        bg="blue.500"
                        _text={{color: 'white'}}
                        borderRadius="md">
                    Subir archivo
                    </Button>
                </Box>
            </ScrollView>
        </NativeBaseProvider>

    );
}

const styles = StyleSheet.create({

    fileInput: {
        width: '80%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#5c84ff',
        textAlign:'center',
        alignContent: 'center',
    },
    icon: {
        marginRight: 10,
        alignContent: 'center',
    },
    text: {
        fontSize: 16,
    },
    fileName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default UploadExcelUsersScreen;