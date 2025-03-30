import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {Ionicons} from "@expo/vector-icons";
import AdminDashboardScreen from "../screens/dashboards/AdminDashboardScreen";
import UploadsDashboardScreen from "../screens/dashboards/UploadsDashboardScreen";
import ProfileUserScreen from "../screens/profile/ProfileUserScreen";
import GestionStackScreen from "../screens/management/GestionStackScreen";
import ListUsersScreen from "../screens/users/ListUsersScreen";
import AddUserScreen from "../screens/users/AddUserScreen";
import EditUserScreen from "../screens/users/EditUserScreen";
import AccessHistoryScreen from "../screens/access/AccessHistoryScreen";
import AddAdministratorScreen from "../screens/administrators/AddAdministratorScreen";
import DetailUserScreen from "../screens/users/DetailUserScreen";
import DetailAdministratorScreen from "../screens/administrators/DetailAdministratorScreen";
import ListAdministratorScreen from "../screens/administrators/ListAdministratorScreen";
import EditAdministratorScreen from "../screens/administrators/EditAdministratorScreen";
import AddDocumentMovementsScreen from "../screens/documentMovements/AddDocumentMovementsScreen";
import DetailDocumentMovementsScreen from "../screens/documentMovements/DetailDocumentMovementsScreen";
import ListDocumentMovementsScreen from "../screens/documentMovements/ListDocumentMovementsScreen";
import EditDocumentMovementsScreen from "../screens/documentMovements/EditDocumentMovementsScreen";
import EditDocumentsScreen from "../screens/documents/EditDocumentsScreen";
import ListDocumentsScreen from "../screens/documents/ListDocumentsScreen";
import AddDocumentScreen from "../screens/documents/AddDocumentScreen";
import DetailDocumentsScreen from "../screens/documents/DetailDocumentsScreen";
import AddRfidCardScreen from "../screens/rfidCards/AddRfidCardScreen";
import EditRfidCardsScreen from "../screens/rfidCards/EditRfidCardsScreen";
import ListRfidCardScreen from "../screens/rfidCards/ListRfidCardScreen";
import DetailRfidCardsScreen from "../screens/rfidCards/DetailRfidCardScreen";
import ListRfidTagsScreen from "../screens/rfidTags/ListRfidTagsScreen";
import DetailRfidTagsScreen from "../screens/rfidTags/DetailRfidTagsScreen";
import EditRfidTagsScreen from "../screens/rfidTags/EditRfidTagsScreen";
import AddRfidTagsScreen from "../screens/rfidTags/AddRfidTagsScreen";
import UploadExcelUsersScreen from "../screens/excelUpload/UploadExcelUsersScreen";
import ExportPDFUserScreen from "../screens/excelUpload/ExportPDFUserScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import GraficosScreen from "../screens/Graficos/GraficosScreen";
import PreviewDocumentScreen from "../screens/PreviewDocument/PreviewDocumentScreen";
import ReadRFIDScreen from "../screens/test/RfidTestScreen";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Gestión Stack Navigator
function ManagementStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name="GestiónStack " component={GestionStackScreen} options={{headerShown: false}} />
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

            <Stack.Screen name="Graficas" component={ReadRFIDScreen}/>

            <Stack.Screen name="testRfid" component={ReadRFIDScreen}/>
           </Stack.Navigator>
    )
        ;
}

// Navegación principal para Administrador
export default function AdminNavigation() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarIcon: ({color, size}) => {
                    let iconName;
                    switch (route.name) {
                        case "Inicio":
                            iconName = "home";
                            break;
                        case "Gestión":
                            iconName = "construct";
                            break;
                        case "Perfil":
                            iconName = "person";
                            break;
                        default:
                            iconName = "ellipse";
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
            })}>
            <Tab.Screen name="Inicio" component={AdminDashboardScreen}/>
            <Tab.Screen name="Gestión" component={ManagementStack}/>
            <Tab.Screen name="Perfil" component={ProfileUserScreen}/>
        </Tab.Navigator>
    );
};
