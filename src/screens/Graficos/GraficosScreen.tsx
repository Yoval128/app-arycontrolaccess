import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, HStack, Heading, Spinner, ScrollView } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import customTheme from "../../themes/index";
import { API_URL } from "@env";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GraficosScreen= ()=>{
    return (
        <NativeBaseProvider theme={customTheme}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Box safeArea p={5} bg="background.light" flex={1}>

                </Box>
            </ScrollView>
            </NativeBaseProvider>
                )
};
export default GraficosScreen;