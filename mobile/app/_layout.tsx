import SafeScreen from "@/components/SafeScreen";
import { ThemeProvider } from "@/contexts/ThemeContexts";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from "expo-router";
export default function RootLayout() {

    return (
        <SafeScreen>
            <ClerkProvider tokenCache={tokenCache}>
                <ThemeProvider>
                    <Slot />
                </ThemeProvider>
            </ClerkProvider>
        </SafeScreen>
    )
}
