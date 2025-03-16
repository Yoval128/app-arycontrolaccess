import React from "react";
import { NativeBaseProvider, Box, Text } from "native-base";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthProvider";

export default function App() {
    return (
        <NativeBaseProvider>
            <AuthProvider>
                <AppNavigator />
            </AuthProvider>
        </NativeBaseProvider>
    );
}
