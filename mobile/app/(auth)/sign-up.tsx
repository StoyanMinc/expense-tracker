import { useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { styles } from '@/assets/styles/auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, THEMES } from '@/constants/colors';
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@/contexts/ThemeContexts';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()
    const { selectedTheme } = useTheme();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
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

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    if (pendingVerification) {
        return (
            <View style={[styles.verificationContainer, { backgroundColor: THEMES[selectedTheme].background }]}>
                <Text style={[styles.verificationTitle, { color: THEMES[selectedTheme].text }]}>Verify your email</Text>
                {error ? (
                    <View style={[styles.errorBox, {borderLeftColor: THEMES[selectedTheme].expense}]}>
                        <Text style={[styles.errorText, {color: THEMES[selectedTheme].text}]}>{error}</Text>
                        <TouchableOpacity onPress={() => setError('')}>
                            <Ionicons name='close' color={COLORS.textLight} size={20} />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TextInput
                    style={
                        [[styles.verificationInput,
                        {
                            borderColor: THEMES[selectedTheme].border,
                            color: THEMES[selectedTheme].text
                        }],
                        error &&
                        [styles.errorInput,
                        {
                            borderColor: THEMES[selectedTheme].expense

                        }]]}
                    value={code}
                    placeholder="Enter your verification code"
                    placeholderTextColor='gray'
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity onPress={onVerifyPress} style={[styles.button, { backgroundColor: THEMES[selectedTheme].primary }]}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <View style={[styles.container, { backgroundColor: THEMES[selectedTheme].background }]}>
                <Image source={require('../../assets/images/revenue-i1.png')} style={styles.illustration} />

                <Text style={[styles.title, {color: THEMES[selectedTheme].text}]}>Create account</Text>

                {error ? (
                    <View style={[styles.errorBox, {borderLeftColor: THEMES[selectedTheme].expense}]}>
                        <Text style={[styles.errorText, {color: THEMES[selectedTheme].text}]}>{error}</Text>
                        <TouchableOpacity onPress={() => setError('')}>
                            <Ionicons name='close' color={COLORS.textLight} size={20} />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TextInput
                    style={[styles.input, error && [styles.errorInput, { borderColor: THEMES[selectedTheme].expense }]]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput
                    style={[styles.input, error && [styles.errorInput, { borderColor: THEMES[selectedTheme].expense }]]}
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <TouchableOpacity onPress={onSignUpPress} style={[styles.button, { backgroundColor: THEMES[selectedTheme].primary }]}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={[styles.footerText, { color: THEMES[selectedTheme].text }]}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={[styles.linkText, { color: THEMES[selectedTheme].primary }]}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}