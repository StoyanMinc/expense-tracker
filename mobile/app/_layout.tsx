import SafeScreen from "@/components/SafeScreen";
import { ThemeProvider } from "@/contexts/ThemeContexts";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from "react-native";
import { StatusBar } from 'expo-status-bar'; // ✅ THIS IS THE CORRECT ONE

import { useEffect } from "react";
export default function RootLayout() {

    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync("#000000");
            NavigationBar.setButtonStyleAsync('light');

        }
    }, [])

    return (
        <SafeScreen>
            <StatusBar
                style="dark" // or "dark" depending on your theme
                backgroundColor="#000000" // Android only
            />
            <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
                <ThemeProvider>
                    <CurrencyProvider>
                        <Slot />
                    </CurrencyProvider>
                </ThemeProvider>
            </ClerkProvider>
        </SafeScreen>
    )
}
