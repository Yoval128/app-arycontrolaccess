import React, { useState } from "react";
import { View, Button, Alert, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import mime from "react-native-mime-types";
import { API_URL } from "@env";

const UploadExcelUsersScreen = () => {
    const [file, setFile] = useState(null);
    const templateUrl = `${API_URL}/uploads/excelTemplates/usuarios.xls`;
    const localUri = FileSystem.documentDirectory + "usuarios.xls";

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

            console.log("Resultado Subida", result);
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

            const response = await fetch(`${API_URL}/api/uploads/upload-excel-usuarios`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const textResponse = await response.text();
            console.log("Respuesta del servidor:", textResponse);

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

    const downloadTemplate = async () => {
        try {
            console.log("Descargando archivo desde:", templateUrl);

            const { uri } = await FileSystem.downloadAsync(templateUrl, localUri);

            Alert.alert("Descarga completada", `Archivo guardado en: ${uri}`);
            console.log("Archivo guardado en:", uri);
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
            Alert.alert("Error", "No se pudo descargar el archivo");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Seleccionar Archivo" onPress={pickDocument} />
            <Button title="Subir Archivo" onPress={uploadFile} disabled={!file} />
            <Text style={{ marginVertical: 20 }}>Descargar plantilla:</Text>
            <Button title="Descargar Usuarios.xls" onPress={downloadTemplate} />
        </View>
    );
};

export default UploadExcelUsersScreen;
