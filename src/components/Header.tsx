import React from 'react';
import { Box, HStack, Icon, Heading, IconButton, Spacer } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, iconName }) => {
    const navigation = useNavigation();

    return (
        <Box bg="primary.600" p={4} borderBottomRadius="xl" shadow={4}>
            <HStack justifyContent="space-between" alignItems="center">
                <HStack alignItems="center" space={3}>
                </HStack>
                <HStack alignItems="center" space={3}>
                    <Icon as={Ionicons} name={iconName} size={6} color="white" />
                    <Heading color="white" size="lg" textAlign="center">{title}</Heading>
                </HStack>

                <IconButton
                    icon={<Icon as={Ionicons} name="arrow-back" size={6} color="white" />}
                    onPress={() => navigation.goBack()}
                />
            </HStack>
        </Box>
    );
};

export default Header;
