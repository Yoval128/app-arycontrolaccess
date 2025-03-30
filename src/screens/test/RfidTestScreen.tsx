import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

// Inicializa el NFC Manager
NfcManager.start();

const ReadRFIDScreen = () => {
    const [tag, setTag] = useState(null);

    useEffect(() => {
        return () => {
            NfcManager.stop();
        };
    }, []);

    const readTag = async () => {
        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();
            setTag(tag);
            Alert.alert("Tarjeta detectada", `ID: ${tag?.id}`);
        } catch (error) {
            Alert.alert("Error", "No se pudo leer la tarjeta.");
        } finally {
            NfcManager.cancelTechnologyRequest();
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Acerca la tarjeta al teléfono</Text>
            <Button title="Leer tarjeta" onPress={readTag} />
            {tag && <Text style={{ marginTop: 20 }}>ID de la tarjeta: {tag.id}</Text>}
        </View>
    );
};

export default ReadRFIDScreen;
