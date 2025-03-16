import React, { useEffect } from 'react';
import { View, Text } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';

const InvitadoDashboardScreen = () => {
    // Aquí puedes poner cualquier código que quieras ejecutar cada vez que se enfoque la pantalla
    useFocusEffect(
        React.useCallback(() => {
            // Lógica que deseas ejecutar cuando la pantalla se enfoque
            console.log('Pantalla enfocada, recargando...');

            // Si deseas realizar una "recarga" o alguna acción, la puedes colocar aquí.
            // Ejemplo: obtener datos, refrescar estado, etc.

            return () => {
                // Si necesitas limpiar algo cuando la pantalla deje de estar enfocada, lo puedes hacer aquí.
                console.log('Pantalla desfocada');
            };
        }, [])
    );

    return (
        <View>
            <Text>INVITADO</Text>
        </View>
    );
};

export default InvitadoDashboardScreen;
