import { useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '@/assets/styles/auth.styles';
import { THEMES } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContexts';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResetPasswordScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const { selectedTheme } = useTheme();

    const [email, setEmail] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const insets = useSafeAreaInsets();


    const requestResetCode = async () => {
        if (!isLoaded || !signIn) {
            setError('Sign-in not ready. Try again shortly.');
            return;
        }
        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });
            setCodeSent(true);
        } catch (err: any) {
            setError(err?.errors?.[0]?.message || 'Something went wrong');
        }
    };

    const resetPassword = async () => {
        if (!isLoaded || !signIn) {
            setError('Sign-in not ready. Try again shortly.');
            return;
        }
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password: newPassword,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.replace('/');
            }
        } catch (err: any) {
            setError(err?.errors?.[0]?.message || 'Reset failed');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: THEMES[selectedTheme].background }]}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    position: 'absolute',
                    top: 50, // Adjust based on status bar height
                    left: 20,
                    zIndex: 10,
                }}
            >
                <Ionicons
                    name='arrow-back'
                    size={24}
                    color={THEMES[selectedTheme].text}
                />
            </TouchableOpacity>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingTop: insets.top + 60, // leave space for arrow icon
                        paddingHorizontal: 20,
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: THEMES[selectedTheme].text }]}>
                        Reset Your Password
                    </Text>

                    {error && (
                        <Text style={[styles.errorText, { color: THEMES[selectedTheme].expense }]}>{error}</Text>
                    )}

                    {!codeSent ? (
                        <>
                            <TextInput
                                placeholder="Enter your email"
                                placeholderTextColor="gray"
                                value={email}
                                onChangeText={setEmail}
                                style={[styles.input, { borderColor: THEMES[selectedTheme].border, color: THEMES[selectedTheme].text }]}
                            />
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: THEMES[selectedTheme].primary }]}
                                onPress={requestResetCode}
                            >
                                <Text style={styles.buttonText}>Send Reset Code</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>

                            <TextInput
                                placeholder="Enter code from email"
                                placeholderTextColor="gray"
                                value={code}
                                onChangeText={setCode}
                                style={[styles.input, { borderColor: THEMES[selectedTheme].border, color: THEMES[selectedTheme].text }]}
                            />
                            <TextInput
                                placeholder="Enter new password"
                                placeholderTextColor="gray"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                                style={[styles.input, { borderColor: THEMES[selectedTheme].border, color: THEMES[selectedTheme].text }]}
                            />
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: THEMES[selectedTheme].primary }]}
                                onPress={resetPassword}
                            >
                                <Text style={styles.buttonText}>Reset Password</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
