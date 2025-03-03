import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeBaseProvider, Box, Text, Center, Spinner} from "native-base";
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View, StyleSheet} from "react-native";
import customTheme from "../themes/index";
import AppLoading from "expo-app-loading";

import {useFonts, Poppins_700Bold} from "@expo-google-fonts/poppins";
import {Inter_400Regular} from "@expo-google-fonts/inter";
import {RobotoMono_400Regular} from "@expo-google-fonts/roboto-mono";

import LoginScreen from "../screens/auth/LoginScreen";
import AdminDashboard from "../screens/dashboards/AdminDashboardScreen";
import AdminDashboardScreen from "../screens/dashboards/AdminDashboardScreen";
import UploadExcelScreen from "../screens/excelUpload/UploadExcelScreen";
import UploadsDashboardScreen from "../screens/dashboards/UploadsDashboardScreen";
import AddUserScreen from "../screens/users/AddUserScreen";
import ListUsersScreen from "../screens/users/ListUsersScreen";


const Stack = createStackNavigator();

const AppNavigator = () => {
    const [fontsLoaded] = useFonts({
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
        "Inter-Italic": require("../../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
        "Roboto-Mono": require("../../assets/fonts/RobotoMono-VariableFont_wght.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <NativeBaseProvider theme={customTheme}>
                <Center flex={1}>
                    <Spinner size="lg" color="primary.500"/>
                </Center>
            </NativeBaseProvider>
        );
    }


    return (
        <NativeBaseProvider theme={customTheme}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen}/>
                    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen}/>
                    <Stack.Screen name="ExcelUploadDasboard" component={UploadsDashboardScreen}/>
                    <Stack.Screen name="ExcelUpload-User" component={UploadExcelScreen}/>
                    <Stack.Screen name="ListUser" component={ListUsersScreen}/>
                    <Stack.Screen name="AddUser" component={AddUserScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </NativeBaseProvider>
    )
};

export default AppNavigator;