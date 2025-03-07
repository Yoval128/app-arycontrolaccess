import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Center, Spinner, Text} from 'native-base';

import LoginScreen from '../screens/auth/LoginScreen';
import CustomDrawerContent from '../context/CustomDrawerContent';
import AdminTabs from './BottomTabNavigator';
import EmpleadoDashboardScreen from '../screens/dashboards/EmpleadoDashboardScreen';
import InvitadoDashboardScreen from '../screens/dashboards/InvitadoDashboardScreen';
import AddUserScreen from '../screens/users/AddUserScreen';
import ListUsersScreen from '../screens/users/ListUsersScreen';
import EditUserScreen from '../screens/users/EditUserScreen';
import DetailUserScreen from '../screens/users/DetailUserScreen';
import AddDocumentScreen from "../screens/documents/AddDocumentScreen";
import ListDocumentsScreen from "../screens/documents/ListDocumentsScreen";
import AddRfidTagsScreen from "../screens/rfidTags/AddRfidTagsScreen";
import ListRfidTagsScreen from "../screens/rfidTags/ListRfidTagsScreen";
import DetailRfidTagsScreen from "../screens/rfidTags/DetailRfidTagsScreen";
import EditRfidTagsScreen from "../screens/rfidTags/EditRfidTagsScreen";
import DetailDocumentsScreen from "../screens/documents/DetailDocumentsScreen";
import EditDocumentsScreen from "../screens/documents/EditDocumentsScreen";
import AccessHistoryScreen from "../screens/access/AccessHistoryScreen";
import ListAdministratorScreen from "../screens/administrators/ListAdministratorScreen";
import AddAdministratorScreen from "../screens/administrators/AddAdministratorScreen";
import DetailAdministratorScreen from "../screens/administrators/DetailAdministratorScreen";
import EditAdministratorScreen from "../screens/administrators/EditAdministratorScreen";
import ListRfidCardsScreen from "../screens/rfidCards/ListRfidCardScreen";
import AddRfidCardsScreen from "../screens/rfidCards/AddRfidCardScreen";
import EditRfidCardsScreen from "../screens/rfidCards/EditRfidCardsScreen";
import DetailRfidCardsScreen from "../screens/rfidCards/DetailRfidCardScreen";
import ListDocumentMovementsScreen from "../screens/documentMovements/ListDocumentMovementsScreen";
import AddDocumentMovementsScreen from "../screens/documentMovements/AddDocumentMovementsScreen";
import DetailDocumentMovementsScreen from "../screens/documentMovements/DetailDocumentMovementsScreen";
import EditDocumentMovementsScreen from "../screens/documentMovements/EditDocumentMovementsScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const userData = await AsyncStorage.getItem('usuario');
                setIsLoggedIn(!!token);
                if (userData) setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('usuario');
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    if (loading) {
        return (
            <Center flex={1}>
                <Spinner size="lg" color="primary.500"/>
            </Center>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? <MainDrawer user={user} onLogout={handleLogout}/> : <AuthStack/>}
        </NavigationContainer>
    );
};

const AuthStack = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
    </Stack.Navigator>
);

const MainDrawer = ({user, onLogout}) => (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} user={user} onLogout={onLogout} />}>
    {user?.rol === 'administrador' ? (
            <>
                {/* Options: Nombres de Header*/}
                <Drawer.Screen name="AdminDashboard" component={AdminTabs} options={{title: 'Inicio Administrador'}}/>
                {/* Rutas Usuarios*/}
                <Drawer.Screen name="ListUsers" component={ListUsersScreen} options={{title: 'Listar Usuarios'}}/>
                <Drawer.Screen name="AddUser" component={AddUserScreen} options={{title: 'Alta Usuario'}}/>
                <Drawer.Screen name="EditUser" component={EditUserScreen} options={{title: 'Editar Usuario'}}/>
                <Drawer.Screen name="DetailUser" component={DetailUserScreen} options={{title: 'Detalle de Usuario'}}/>
                {/* Rutas Documentos*/}
                <Drawer.Screen name="ListDocuments" component={ListDocumentsScreen}
                               options={{title: 'Listar Documentos'}}/>
                <Drawer.Screen name="AddDocument" component={AddDocumentScreen} options={{title: 'Alta de Documento'}}/>
                <Drawer.Screen name="DetailDocument" component={DetailDocumentsScreen}
                               options={{title: 'Detalle de Documento'}}/>
                <Drawer.Screen name="EditDocument" component={EditDocumentsScreen}
                               options={{title: 'Editar Documento'}}/>

                {/* Rutas Rfid Tags*/}
                <Drawer.Screen name="AddRfidTags" component={AddRfidTagsScreen} options={{title: 'Alta RfidTags'}}/>
                <Drawer.Screen name="ListRfidTags" component={ListRfidTagsScreen} options={{title: 'Listar RfidTags'}}/>
                <Drawer.Screen name="DetailRfidTag" component={DetailRfidTagsScreen}
                               options={{title: 'Detalle de RfidTags'}}/>
                <Drawer.Screen name="EditRfidTag" component={EditRfidTagsScreen} options={{title: 'Editar RfidTags'}}/>

                {/* Rutas Acceso*/}
                <Drawer.Screen name="ListAccessHistory" component={AccessHistoryScreen}
                               options={{title: 'Listar Acceso'}}/>

                {/* Rutas Administardores*/}
                <Drawer.Screen name="ListAdministrator" component={ListAdministratorScreen}
                               options={{title: 'Listar Administrador'}}/>
                <Drawer.Screen name="AddAdministrator" component={AddAdministratorScreen}
                               options={{title: 'Alta Administrador'}}/>
                <Drawer.Screen name="DetailAdministrator" component={DetailAdministratorScreen}
                               options={{title: 'Detalle de Administrador'}}/>
                <Drawer.Screen name="EditAdministrator" component={EditAdministratorScreen}
                               options={{title: 'Editar Administrador'}}/>

                {/* RUtas de RfidCards*/}
                <Drawer.Screen name="ListRfidCards" component={ListRfidCardsScreen}
                               options={{title: 'Listar RfidCards'}}/>
                <Drawer.Screen name="AddRfidCards" component={AddRfidCardsScreen} options={{title: 'Alta RfidCards'}}/>
                <Drawer.Screen name="DetailRfidCard" component={DetailRfidCardsScreen}
                               options={{title: 'Detalle RfidCards'}}/>
                <Drawer.Screen name="EditRfidCard" component={EditRfidCardsScreen}
                               options={{title: 'Editar RfidCards'}}/>

                {/* RUtas de DocumentMovements*/}
                <Drawer.Screen name="ListDocumentMovements" component={ListDocumentMovementsScreen}
                               options={{title: 'Movimientos Documentos'}}/>
                <Drawer.Screen name="AddDocumentMovement" component={AddDocumentMovementsScreen}
                               options={{title: 'Alta Movimientos Documentos'}}/>
                <Drawer.Screen name="DetailDocumentMovement" component={DetailDocumentMovementsScreen}
                               options={{title: 'Detalle Movimientos Documentos'}}/>
                <Drawer.Screen name="EditDocumentMovement" component={EditDocumentMovementsScreen}
                               options={{title: 'Editar Movimientos Documentos'}}/>

            </>
        ) : user?.rol === 'empleado' ? (
            <Drawer.Screen name="DashboardEmpleado" component={EmpleadoDashboardScreen} options={{title: 'Inicio i'}}/>
        ) : (
            <Drawer.Screen name="DashboardInvitado" component={InvitadoDashboardScreen} options={{title: 'Inicio g'}}/>
        )}
    </Drawer.Navigator>
);

export default AppNavigator;
