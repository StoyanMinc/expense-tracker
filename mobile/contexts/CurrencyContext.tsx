import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Currency, CURRENCIES } from '@/constants/currencies';


interface CurencyContextType {
    selectedCurrency: Currency;
    changeCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext<CurencyContextType>({
    selectedCurrency: '€',
    changeCurrency: () => { }
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>('€');

    useEffect(() => {
        (async () => {
            const savedCurrency = await AsyncStorage.getItem('currency');
            if (savedCurrency && CURRENCIES.includes(savedCurrency as Currency)) {
                setSelectedCurrency(savedCurrency as Currency);
            }
        })();
    }, []);

    const changeCurrency = async (currency: Currency) => {
        setSelectedCurrency(currency);
        await AsyncStorage.setItem('currency', currency);
    };

    return (
        <CurrencyContext.Provider value={{ selectedCurrency, changeCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);