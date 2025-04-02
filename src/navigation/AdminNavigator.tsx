import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {Ionicons} from "@expo/vector-icons";
import {useColorModeValue} from "native-base";
import AdminDashboardScreen from "../screens/dashboards/AdminDashboardScreen";
import ProfileUserScreen from "../screens/profile/ProfileUserScreen";
import GestionStackScreen from "../screens/management/GestionStackScreen";
// Importa todas tus pantallas aquí...
import LoginScreen from "../screens/auth/LoginScreen";
import GraficosScreen from "../screens/Graficos/GraficosScreen";
import ListUsersScreen from "../screens/users/ListUsersScreen";
import AddUserScreen from "../screens/users/AddUserScreen";
import EditUserScreen from "../screens/users/EditUserScreen";
import DetailUserScreen from "../screens/users/DetailUserScreen";
import AccessHistoryScreen from "../screens/access/AccessHistoryScreen";
import AddAdministratorScreen from "../screens/administrators/AddAdministratorScreen";
import DetailAdministratorScreen from "../screens/administrators/DetailAdministratorScreen";
import ListAdministratorScreen from "../screens/administrators/ListAdministratorScreen";
import EditAdministratorScreen from "../screens/administrators/EditAdministratorScreen";
import AddDocumentMovementsScreen from "../screens/documentMovements/AddDocumentMovementsScreen";
import ListDocumentMovementsScreen from "../screens/documentMovements/ListDocumentMovementsScreen";
import DetailDocumentMovementsScreen from "../screens/documentMovements/DetailDocumentMovementsScreen";
import EditDocumentMovementsScreen from "../screens/documentMovements/EditDocumentMovementsScreen";
import AddDocumentScreen from "../screens/documents/AddDocumentScreen";
import EditDocumentsScreen from "../screens/documents/EditDocumentsScreen";
import ListDocumentsScreen from "../screens/documents/ListDocumentsScreen";
import DetailDocumentsScreen from "../screens/documents/DetailDocumentsScreen";
import UploadExcelUsersScreen from "../screens/excelUpload/UploadExcelUsersScreen";
import ExportPDFUserScreen from "../screens/excelUpload/ExportPDFUserScreen";
import AddRfidCardScreen from "../screens/rfidCards/AddRfidCardScreen";
import ListRfidCardScreen from "../screens/rfidCards/ListRfidCardScreen";
import EditRfidCardsScreen from "../screens/rfidCards/EditRfidCardsScreen";
import DetailRfidCardsScreen from "../screens/rfidCards/DetailRfidCardScreen";
import ListRfidTagsScreen from "../screens/rfidTags/ListRfidTagsScreen";
import DetailRfidTagsScreen from "../screens/rfidTags/DetailRfidTagsScreen";
import EditRfidTagsScreen from "../screens/rfidTags/EditRfidTagsScreen";
import AddRfidTagsScreen from "../screens/rfidTags/AddRfidTagsScreen";

import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Gestión Stack Navigator
function ManagementStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: useColorModeValue("#FFFFFF", "#1F2937"), // Blanco en claro, gris oscuro en oscuro
                },
                headerTintColor: useColorModeValue("#000000", "#FFFFFF"), // Negro en claro, blanco en oscuro
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                cardStyle: {
                    backgroundColor: useColorModeValue("#F9FAFB", "#111827"), // Fondo gris claro en claro, gris muy oscuro en oscuro
                }
            }}
        >

            <Stack.Screen name="GestiónStack " component={GestionStackScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ProfileUser" component={ProfileUserScreen}/>

            <Stack.Screen name="ListUsers" component={ListUsersScreen}/>
            <Stack.Screen name="AddUser" component={AddUserScreen}/>
            <Stack.Screen name="EditUser" component={EditUserScreen}/>
            <Stack.Screen name="DetailUser" component={DetailUserScreen}/>

            <Stack.Screen name="AccessHistory" component={AccessHistoryScreen}/>

            <Stack.Screen name="AddAdministrator" component={AddAdministratorScreen}/>
            <Stack.Screen name="DetailAdministrator" component={DetailAdministratorScreen}/>
            <Stack.Screen name="ListAdministrator" component={ListAdministratorScreen}/>
            <Stack.Screen name="EditAdministrator" component={EditAdministratorScreen}/>

            <Stack.Screen name="AddDocumentMovements" component={AddDocumentMovementsScreen}/>
            <Stack.Screen name="ListDocumentMovements" component={ListDocumentMovementsScreen}/>
            <Stack.Screen name="DetailDocumentMovements" component={DetailDocumentMovementsScreen}/>
            <Stack.Screen name="EditDocumentMovements" component={EditDocumentMovementsScreen}/>

            <Stack.Screen name="AddDocument" component={AddDocumentScreen}/>
            <Stack.Screen name="EditDocuments" component={EditDocumentsScreen}/>
            <Stack.Screen name="ListDocuments" component={ListDocumentsScreen}/>
            <Stack.Screen name="DetailDocuments" component={DetailDocumentsScreen}/>

            <Stack.Screen name="UploadExcelUsers" component={UploadExcelUsersScreen}/>
            <Stack.Screen name="ExportPDFUser" component={ExportPDFUserScreen}/>

            <Stack.Screen name="AddRfidCard" component={AddRfidCardScreen}/>
            <Stack.Screen name="ListRfidCard" component={ListRfidCardScreen}/>
            <Stack.Screen name="EditRfidCards" component={EditRfidCardsScreen}/>
            <Stack.Screen name="DetailRfidCards" component={DetailRfidCardsScreen}/>

            <Stack.Screen name="ListRfidTags" component={ListRfidTagsScreen}/>
            <Stack.Screen name="DetailRfidTags" component={DetailRfidTagsScreen}/>
            <Stack.Screen name="EditRfidTags" component={EditRfidTagsScreen}/>
            <Stack.Screen name="AddRfidTags" component={AddRfidTagsScreen}/>

            <Stack.Screen name="Login" component={LoginScreen}/>

            <Stack.Screen name="Graficas" component={GraficosScreen}/>


        </Stack.Navigator>
    );
}

// Navegación principal para Administrador
export default function AdminNavigation() {
    const tabBarBackground = useColorModeValue("#FFFFFF", "#1F2937"); // Blanco en claro, gris oscuro en oscuro
    const tabBarActiveTintColor = useColorModeValue("#3B82F6", "#93C5FD"); // Azul en claro, azul claro en oscuro
    const tabBarInactiveTintColor = useColorModeValue("#6B7280", "#9CA3AF"); // Gris en claro, gris claro en oscuro
    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();
    // Función para cambiar el idioma y guardar la preferencia
    const changeAppLanguage = async (lng) => {
        try {
            await i18n.changeLanguage(lng);
            await AsyncStorage.setItem('userLanguage', lng);
        } catch (error) {
            console.error("Error changing language:", error);
        }
    };

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: tabBarBackground,
                    borderTopColor: useColorModeValue("#E5E7EB", "#374151"), // Borde gris claro en claro, gris oscuro en oscuro
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarIcon: ({color, size, focused}) => {
                    let iconName;
                    switch (route.name) {
                        case t('tabs.home'):
                            iconName = focused ? "home" : "home-outline";
                            break;
                        case t('tabs.management'):
                            iconName = focused ? "construct" : "construct-outline";
                            break;
                        case t('tabs.profile'):
                            iconName = focused ? "person" : "person-outline";
                            break;
                        default:
                            iconName = "ellipse";
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: tabBarActiveTintColor,
                tabBarInactiveTintColor: tabBarInactiveTintColor,
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                },
            })}
        >
            <Tab.Screen
                name={t('tabs.home')}
                component={AdminDashboardScreen}
                options={{title: t('tabs.home')}}
            />
            <Tab.Screen
                name={t('tabs.management')}
                component={ManagementStack}
                options={{title: t('tabs.management')}}
            />
            <Tab.Screen
                name={t('tabs.profile')}
                component={ProfileUserScreen}
                options={{title: t('tabs.profile')}}
            />
        </Tab.Navigator>
    );
}