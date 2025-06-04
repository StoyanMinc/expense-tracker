import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { COLORS, THEMES } from '@/constants/colors';
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '@/assets/styles/auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContexts';

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const { selectedTheme } = useTheme()
    const [emailAddress, setEmailAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2));

            }
        } catch (err: unknown) {
            if (
                typeof err === 'object' &&
                err !== null &&
                'errors' in err &&
                Array.isArray((err as any).errors)
            ) {
                const errorCode = (err as any).errors[0]?.message;
                setError(errorCode);
            }
        }
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={[styles.container, { backgroundColor: THEMES[selectedTheme].background }]}>

                <Image
                    source={require('../../assets/images/revenue-i2.png')}
                    style={styles.illustration}
                />

                <Text style={[styles.title, { color: THEMES[selectedTheme].text }]}>Welcome Back !</Text>

                {error ? (
                    <View style={[styles.errorBox, { borderLeftColor: THEMES[selectedTheme].expense }]}>
                        <Text style={[styles.errorText, { color: THEMES[selectedTheme].text }]}>{error}</Text>
                        <TouchableOpacity onPress={() => setError('')}>
                            <Ionicons name='close' color={COLORS.textLight} size={20} />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TextInput
                    style={[styles.input, { borderColor: THEMES[selectedTheme].border, color: THEMES[selectedTheme].text }, error && [styles.errorInput, { borderColor: THEMES[selectedTheme].expense }]]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor='gray'
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />
                <TextInput
                    style={[
                        styles.input,
                        {
                            borderColor: THEMES[selectedTheme].border,
                            color: THEMES[selectedTheme].text
                        },
                        error && [styles.errorInput, { borderColor: THEMES[selectedTheme].expense }]
                    ]}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor='gray'
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: THEMES[selectedTheme].primary }]}
                    onPress={onSignInPress}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <View style={styles.footerSignUpContainter}>
                        <Text style={[styles.footerText, { color: THEMES[selectedTheme].text }]}>Don't have an account?</Text>
                        <Link href="/(auth)/sign-up">
                            <Text style={[styles.linkText, { color: THEMES[selectedTheme].primary }]}>Sign up</Text>
                        </Link>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                        <Text style={[styles.linkText, { color: THEMES[selectedTheme].primary, textAlign: 'right', marginTop: 10 }]}>
                            Forgot password?
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </KeyboardAwareScrollView>
    )
}