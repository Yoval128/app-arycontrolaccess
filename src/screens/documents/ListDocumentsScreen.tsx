import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    NativeBaseProvider,
    ScrollView,
    Box,
    FlatList,
    HStack,
    VStack,
    Avatar,
    Spinner,
    IconButton,
    AlertDialog,
    Button,
    useColorModeValue
} from "native-base";
import {Ionicons} from '@expo/vector-icons';
import customTheme from "../../themes/index";
import {API_URL} from "@env";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ActivityIndicator} from "react-native";
import {useAuth} from "../../context/AuthProvider";
import {useTranslation} from "react-i18next";

const ListDocumentsScreen = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const {user} = useAuth();

    // Hook para obtener traducciones
    const {t, i18n} = useTranslation();

    // Colores adaptables al tema
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
    const headerBg = useColorModeValue("primary.500", "primary.700");
    const fabBg = useColorModeValue("primary.500", "primary.600");

    // Colores fijos para iconos
    const viewIconColor = "#3182CE";       // Azul
    const editIconColor = "#38A169";       // Verde
    const deleteIconColor = "#E53E3E";     // Rojo
    const addIconColor = "white";          // Blanco
    const headerIconColor = "white";       // Icono del header en blanco

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        if (route.params?.refresh) {
            fetchDocuments();
        }
    }, [route.params?.refresh]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/documents/list-documents`);
            if (!response.ok) {
                throw new Error('Error al obtener los documentos');
            }
            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id) => {
        setIsOpen(false);
        try {
            await fetch(`${API_URL}/api/documents/delete-document/${id}`, {method: "DELETE"});
            setDocuments(documents.filter(doc => doc.ID_Documento !== id));
        } catch (error) {
            setError("Error al eliminar documento: " + error.message);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#007bff"/>;
    if (error) return <Text style={{color: 'red', padding: 10}}>Error: {error}</Text>;

    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}} bg={bgColor}>
                <Box safeArea p={5} flex={1}>
                    <HStack alignItems="center" mb={4} bg={headerBg} p={4} borderRadius="md" shadow={3} justifyContent="center">
                        <Ionicons name="document-text-outline" size={28} color={headerIconColor}/>
                        <Text fontSize="2xl" fontWeight="bold" ml={3} color="white">
                            {t('documents.listDocuments.listTitle')}
                        </Text>
                    </HStack>

                    {loading ? (
                        <Spinner size="lg" color="primary.500"/>
                    ) : (
                        <FlatList
                            data={documents}
                            keyExtractor={(item) => item.ID_Documento.toString()}
                            renderItem={({item}) => (
                                <Box bg={cardBg} p={4} mb={3} borderRadius="lg" shadow={2}>
                                    <HStack space={3} alignItems="center">
                                        <Avatar bg="primary.400" size="md">
                                            {item.Nombre_Documento[0]}
                                        </Avatar>
                                        <VStack flex={1}>
                                            <Text fontSize="md" fontWeight="bold" color={textColor}>
                                                {item.Tipo_Documento}
                                            </Text>
                                            <Text fontSize="sm" color={secondaryTextColor}>
                                                {item.Ubicacion}
                                            </Text>
                                            <Text fontSize="xs" color={secondaryTextColor}>
                                                {item.Estado}
                                            </Text>
                                        </VStack>
                                        <HStack space={2}>
                                            {user.role === 'administrador' && (
                                                <>
                                                    <IconButton
                                                        icon={<Ionicons name="eye-outline" size={20} color={viewIconColor}/>}
                                                        onPress={() => navigation.navigate("DetailDocuments", {documento_id: item.ID_Documento})}
                                                    />
                                                    <IconButton
                                                        icon={<Ionicons name="pencil-outline" size={20} color={editIconColor}/>}
                                                        onPress={() => navigation.navigate("EditDocuments", {documento_id: item.ID_Documento})}
                                                    />
                                                    <IconButton
                                                        icon={<Ionicons name="trash-outline" size={20} color={deleteIconColor}/>}
                                                        onPress={() => {
                                                            setSelectedDocument(item.ID_Documento);
                                                            setIsOpen(true);
                                                        }}
                                                    />
                                                </>
                                            )}
                                            {user.role === 'empleado' && (
                                                <>
                                                    <IconButton
                                                        icon={<Ionicons name="eye-outline" size={20} color={viewIconColor}/>}
                                                        onPress={() => navigation.navigate("DetailDocuments", {documento_id: item.ID_Documento})}
                                                    />
                                                    <IconButton
                                                        icon={<Ionicons name="pencil-outline" size={20} color={editIconColor}/>}
                                                        onPress={() => navigation.navigate("EditDocuments", {documento_id: item.ID_Documento})}
                                                    />
                                                </>
                                            )}
                                            {user.role === 'invitado' && (
                                                <IconButton
                                                    icon={<Ionicons name="eye-outline" size={20} color={viewIconColor}/>}
                                                    onPress={() => navigation.navigate("DetailDocuments", {documento_id: item.ID_Documento})}
                                                />
                                            )}
                                        </HStack>
                                    </HStack>
                                </Box>
                            )}
                        />
                    )}
                </Box>
            </ScrollView>

            {/* Modal de Confirmación para Eliminar */}
            <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <AlertDialog.Content>
                    <AlertDialog.Header>Eliminar Documento</AlertDialog.Header>
                    <AlertDialog.Body>¿Estás seguro de que deseas eliminar este documento?</AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button variant="ghost" onPress={() => setIsOpen(false)}>Cancelar</Button>
                        <Button colorScheme="danger" onPress={() => deleteDocument(selectedDocument)}>Eliminar</Button>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>

            {/* Botón flotante para agregar */}
            {(user.role === 'administrador' || user.role === 'empleado') && (
                <IconButton
                    icon={<Ionicons name="add" size={40} color={addIconColor}/>}
                    bg={fabBg}
                    borderRadius="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                    onPress={() => navigation.navigate("AddDocument")}
                />
            )}
        </NativeBaseProvider>
    );
};

export default ListDocumentsScreen;