import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InvitadoDashboardScreen from "../screens/dashboards/InvitadoDashboardScreen";
import ProfileScreen from "../screens/profile/ProfileUserScreen";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// BottomBar para el invitado
function InvitadoBottomTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Dashboard" component={InvitadoDashboardScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

// SliderBar + BottomBar (Invitado)
export default function InvitadoNavigator() {
    console.log("Iniciando Screen Invitado");
    return (
        <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Home" component={InvitadoBottomTabs} />
            <Drawer.Screen name="Perfil" component={ProfileScreen} />
        </Drawer.Navigator>
    );
}