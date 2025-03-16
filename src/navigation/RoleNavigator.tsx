import React from "react";
import { useAuth } from "../context/AuthProvider";
import AdminNavigator from "./AdminNavigator";
import EmpleadoNavigator from "./EmpleadoNavigator";
import InvitadoNavigator from "./InvitadoNavigator";
import DefaultScreen from "../screens/auth/DefaultScreen";

export default function RoleNavigator() {
    const { user } = useAuth();
    console.log("El rol accedio con "+ user.role);
    switch (user.role) {
        case "administrador":
            return <AdminNavigator />;
        case "empleado":
            return <EmpleadoNavigator />;
        case "invitado":
            return <InvitadoNavigator />;
        default:
            return <DefaultScreen />; // Fallback en caso de error
    }
}
