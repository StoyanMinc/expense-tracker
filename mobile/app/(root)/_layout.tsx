import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function RootLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return null; // not to show login screen for a moment
    if (!isSignedIn) return <Redirect href={'/(auth)/sign-in'} />;

    return <Stack screenOptions={{ headerShown: false }} />
}