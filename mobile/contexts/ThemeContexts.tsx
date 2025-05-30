import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { THEMES } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage'


export type ThemeName = keyof typeof THEMES;

interface ThemeContextType {
    theme: typeof THEMES.ocean;
    selectedTheme: ThemeName;
    changeTheme: (name: ThemeName) => void;
}
const ThemeContext = createContext<ThemeContextType>({
    theme: THEMES.ocean,
    selectedTheme: 'ocean',
    changeTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [selectedTheme, setSelectedTheme] = useState<ThemeName>('ocean');
    const [theme, setTheme] = useState(THEMES.ocean);

    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme && savedTheme in THEMES) {
                setSelectedTheme(savedTheme as ThemeName);
                setTheme(THEMES[savedTheme as ThemeName]);
            }
        })()
    }, [])

    const changeTheme = async (name: ThemeName) => {
        setSelectedTheme(name);
        setTheme(THEMES[name]);
        await AsyncStorage.setItem('theme', name);
    };

    return (
        <ThemeContext.Provider
            value={{ theme, selectedTheme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useTheme = () => useContext(ThemeContext)
