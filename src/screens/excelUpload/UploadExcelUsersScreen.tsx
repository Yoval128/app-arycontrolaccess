import React, {useState} from "react";
import {View, Button, Alert} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import mime from "react-native-mime-types";
import {API_URL} from '@env';

const UploadExcelUsersScreen = () => {
    const [file, setFile] = useState(null);
    console.log("URL de la API:", API_URL);
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"],
            });

            if (result.canceled) {
                Alert.alert("Selección cancelada");
                return;
            }

            console.log("Resultado Subida");
            console.log(result);

            setFile(result.assets[0]);
        } catch (error) {
            console.error("Error al seleccionar el archivo:", error);
        }
    };

    const uploadFile = async () => {
        if (!file) {
            Alert.alert("Por favor selecciona un archivo");
            return;
        }

        const formData = new FormData();
        formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: mime.lookup(file.name) || "application/octet-stream",
        });

        try {
            console.log("Subiendo archivo...");

            const response = await fetch(`${process.env.API_URL}/api/uploads/upload-excel-usuarios`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const textResponse = await response.text(); // Primero obtenemos la respuesta en texto
            console.log("Respuesta del servidor:", textResponse);

            // Intentamos parsear la respuesta a JSON
            try {
                const jsonResponse = JSON.parse(textResponse);
                Alert.alert("Resultado", JSON.stringify(jsonResponse, null, 2));
            } catch (jsonError) {
                console.error("Error al parsear JSON:", jsonError);
                Alert.alert("Error", "La respuesta del servidor no es un JSON válido");
            }
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            Alert.alert("Error", "No se pudo subir el archivo");
        }
    };

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Button title="Seleccionar Archivo" onPress={pickDocument}/>
            <Button title="Subir Archivo" onPress={uploadFile} disabled={!file}/>
        </View>
    );
};

export default UploadExcelUsersScreen;
