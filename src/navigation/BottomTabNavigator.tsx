import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {Ionicons} from "@expo/vector-icons";
import AdminDashboardScreen from "../screens/dashboards/AdminDashboardScreen";
import ListUsersScreen from "../screens/users/ListUsersScreen";
import customTheme from '../themes/index';
import UploadsDashboardScreen from "../screens/dashboards/UploadsDashboardScreen";


// Crear el stack
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Ejemplo de pestañas para Administrador
const AdminTabs = () => (
    <Tab.Navigator
        screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
                let iconName;

                if (route.name === "Dashboard") {
                    iconName = "home";
                } else if (route.name === "Notificaciones") {
                    iconName = "notifications";
                } else if (route.name === "Perfil ") {
                    iconName = "people";
                }

                return <Ionicons name={iconName} size={size} color={color}/>;
            },
            tabBarActiveTintColor: "#007bff",
            tabBarInactiveTintColor: "gray",
        })}
    >
        <Tab.Screen name="Dashboard" component={AdminDashboardScreen}/>
        <Tab.Screen name="Usuarios" component={ListUsersScreen}/>
        <Tab.Screen name="Uploads" component={UploadsDashboardScreen}/>
    </Tab.Navigator>
);

// Puedes definir más TabNavigators para empleados e invitados si lo necesitas

export default AdminTabs;
