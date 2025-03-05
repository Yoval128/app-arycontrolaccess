import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useColorMode, useTheme } from "native-base";
import AdminDashboardScreen from "../screens/dashboards/AdminDashboardScreen";
import UploadsDashboardScreen from "../screens/dashboards/UploadsDashboardScreen";
import ProfileUser from "../screens/profile/ProfileUserScreen";
import ProfileUserScreen from "../screens/profile/ProfileUserScreen";


const Tab = createBottomTabNavigator();

const AdminTabs = () => {
    const theme = useTheme(); // Asegurar que tenemos acceso al tema
    const { colorMode } = useColorMode();

    // Definir colores con valores por defecto en caso de que el tema no se cargue
    const backgroundColor = theme.colors?.background?.[colorMode] || (colorMode === "dark" ? "#1C1E22" : "#F5F7FA");
    const activeColor = theme.colors?.accent?.[600] || "#0074E8";
    const inactiveColor = theme.colors?.secondary?.[500] || "#304C69";

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Inicio") iconName = "home";
                    else if (route.name === "Subidas") iconName = "cloud-upload";
                    else if (route.name === "Profile") iconName = "person";

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarStyle: {
                    backgroundColor: backgroundColor,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: 60,
                    paddingBottom: 10,
                },
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: inactiveColor,
                tabBarLabelStyle: {
                    fontFamily: "Poppins-Bold",
                    fontSize: 12,
                },
            })}
        >
            <Tab.Screen name="Inicio" component={AdminDashboardScreen} options={{headerShown: false}}/>
            <Tab.Screen name="Subidas" component={UploadsDashboardScreen} options={{headerShown: false}}/>
            <Tab.Screen name="Profile" component={ProfileUserScreen} options={{headerShown: false}}/>
        </Tab.Navigator>
    );
};

export default AdminTabs;
