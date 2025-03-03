import {View, Text, NativeBaseProvider, ScrollView, Box} from "native-base";
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';

import customTheme from "../../themes/index";

const ListUsersScreen = () => {
    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Box safeArea p={5} bg="primary.100" flex={1}>
                    <Text>Lista de usuarios</Text>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    )
}
export default ListUsersScreen;