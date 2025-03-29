import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {AuthProvider, useAuth} from "../context/AuthProvider";
import LoginScreen from "../screens/auth/LoginScreen";
import RoleNavigator from "./RoleNavigator";
import {useColorMode} from "native-base";

const Stack = createStackNavigator();

export default function AppNavigator() {
    const { user } = useAuth();
    console.log("# AppNavigator #");
    console.log("Datos de usuarios en AppNavigator: "+ user.role);
    console.log("Datos de usuarios en AppNavigator: "+ user.email);
    console.log("-----------------------------------------------");
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user.token ? (
                    <Stack.Screen name="RoleNavigator" component={RoleNavigator} />
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}