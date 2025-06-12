import { style } from '@/assets/styles/settingsModal.styles';
import { THEMES } from '@/constants/colors';
import { Currency } from '@/constants/currencies';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContexts';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useTransactions } from '@/hooks/useTransactions';

interface modalProps {
    visible: boolean,
    onClose: () => void
}

type ThemeName = keyof typeof THEMES

type CurrencyOption = {
    label: string;
    value: Currency;
};
const themeOptions: { label: string; value: ThemeName }[] = [
    { label: 'Ocean', value: 'ocean' },
    { label: 'Coffee', value: 'coffee' },
    { label: 'Forest', value: 'forest' },
    { label: 'Purple', value: 'purple' },
];

const currencyOptions: CurrencyOption[] = [
    { label: 'EURO', value: '€' },
    { label: 'USD', value: '$' },
    { label: 'ЛЕВА', value: 'лв.' }
];

export default function SetttingsModal({ visible, onClose }: modalProps) {
    const { selectedTheme, changeTheme } = useTheme();
    const { changeCurrency } = useCurrency();
    const { user } = useUser();
    const { signOut } = useAuth();
    const { deleteUserTransactions } = useTransactions({ userId: user?.id });

    const deleteAccountHandler = async () => {

        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone!',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: (async () => {
                        try {
                            await deleteUserTransactions();
                            await user?.delete();
                            await signOut();
                            router.replace('/(auth)/sign-in');
                        } catch (error) {
                            console.error('Failed to delete account:', error);
                            Alert.alert('Error', 'Account deletion failed.');
                        }
                    })
                }
            ]
        )
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        // onRequestClose={onClose}
        >
            <View style={style.topBackdrop}>
                <View style={style.container}>
                    <View>
                        <Text style={style.title}>Choose your theme</Text>
                        {themeOptions.map((theme) => (
                            <TouchableOpacity
                                key={theme.value}
                                onPress={() => {
                                    changeTheme(theme.value);
                                    onClose();
                                }}
                                style={[style.option, { backgroundColor: THEMES[theme.value as ThemeName].background }]}
                            >
                                <Text style={[style.optionText, { color: THEMES[theme.value as ThemeName].primary }]}>{theme.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={style.currencyContainer}>
                        <Text style={style.title}>Choose your currency</Text>
                        {currencyOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => {
                                    changeCurrency(option.value);
                                    onClose();
                                }}
                            // style={[style.option, { backgroundColor: THEMES[theme.value as ThemeName].background }]}
                            >
                                <Text style={[style.optionText, { color: THEMES[selectedTheme].text }]}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={style.title}>Danger Zone</Text>
                        <TouchableOpacity onPress={deleteAccountHandler} style={style.deleteButton}>
                            <Text style={style.deleteText}>Delete My Account</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onClose}>
                        <Text style={style.cancel}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    );
}