import React from "react";
import { NativeBaseProvider } from "native-base";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthProvider";
import usePersistedColorMode from "./src/hooks/usePersistedColorMode";
import customTheme from "./src/themes/index";

export default function App() {
    return (
        <NativeBaseProvider theme={customTheme}>
            <ColorModeManager>
                <AuthProvider>
                    <AppNavigator />
                </AuthProvider>
            </ColorModeManager>
        </NativeBaseProvider>
    );
}

// Componente adicional para manejar el color mode
function ColorModeManager({ children }: { children: React.ReactNode }) {
    usePersistedColorMode();
    return <>{children}</>;
}