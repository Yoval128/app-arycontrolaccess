import React, { useEffect, useState } from "react";
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
    Button
} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

const ListDocumentsScreen = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const route = useRoute(); // Usar useRoute para acceder a los parámetros

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        if (route.params?.refresh) {
            fetchDocuments(); // Recargar los documentos cuando el parámetro `refresh` es true
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
            setError(error.message); // Manejo de error
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
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="background.light" flex={1}>
                    <HStack alignItems="center" mb={4}>
                        <Ionicons name="document-text-outline" size={28} color="#003469"/>
                        <Text fontSize="xl" fontWeight="bold" ml={2} color="primary.500">
                            Lista de Documentos
                        </Text>
                    </HStack>

                    {loading ? (
                        <Spinner size="lg" color="primary.500"/>
                    ) : (
                        <FlatList
                            data={documents}
                            keyExtractor={(item) => item.ID_Documento.toString()}
                            renderItem={({item}) => (
                                <Box bg="white" p={4} mb={3} borderRadius="lg" shadow={2}>
                                    <HStack space={3} alignItems="center">
                                        <Avatar bg="primary.400" size="md">
                                            {item.Nombre_Documento[0]}
                                        </Avatar>
                                        <VStack flex={1}>
                                            <Text fontSize="md" fontWeight="bold">
                                                {item.Tipo_Documento}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {item.Ubicacion}
                                            </Text>
                                            <Text fontSize="xs" color="gray.400">
                                                {item.Estado}
                                            </Text>
                                        </VStack>
                                        <HStack space={2}>
                                            <IconButton
                                                icon={<Ionicons name="eye-outline" size={20} color="blue"/>}
                                                onPress={() => navigation.navigate("DetailDocument", {documento_id: item.ID_Documento})}
                                            />
                                            <IconButton
                                                icon={<Ionicons name="pencil-outline" size={20} color="green"/>}
                                                onPress={() => navigation.navigate("EditDocument", {documento_id: item.ID_Documento})}
                                            />
                                            <IconButton
                                                icon={<Ionicons name="trash-outline" size={20} color="red"/>}
                                                onPress={() => {
                                                    setSelectedDocument(item.ID_Documento);
                                                    setIsOpen(true);
                                                }}
                                            />
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
        </NativeBaseProvider>
    );
};

export default ListDocumentsScreen;
