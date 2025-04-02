import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../locales/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await AsyncStorage.getItem('userLanguage');
            if (savedLanguage) {
                i18n.changeLanguage(savedLanguage);
            }
        };
        loadLanguage();
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
};

export default I18nProvider;