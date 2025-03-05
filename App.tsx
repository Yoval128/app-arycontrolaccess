import React from "react";
import {NativeBaseProvider, Box, Text} from "native-base";
import customTheme from "./src/themes/index";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
    return (
        <NativeBaseProvider>
            <AppNavigator />
        </NativeBaseProvider>
    );
}
