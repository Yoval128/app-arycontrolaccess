import React from "react";
import {NativeBaseProvider} from "native-base";
import AppNavigator from "./src/navigation/AppNavigator";
import {AuthProvider} from "./src/context/AuthProvider";
import usePersistedColorMode from "./src/hooks/usePersistedColorMode";
import customTheme from "./src/themes/index";
import I18nProvider from './src/providers/I18nProvider';

export default function App() {
    return (
        <I18nProvider>
            <NativeBaseProvider theme={customTheme}>
                <ColorModeManager>
                    <AuthProvider>
                        <AppNavigator/>
                    </AuthProvider>
                </ColorModeManager>
            </NativeBaseProvider>
        </I18nProvider>
    );
}

function ColorModeManager({children}: { children: React.ReactNode }) {
    usePersistedColorMode();
    return <>{children}</>;
}