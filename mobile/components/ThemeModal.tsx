import { style } from '@/assets/styles/themeModal.styles';
import { THEMES } from '@/constants/colors';
import { Currency } from '@/constants/currencies';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContexts';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

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

export default function ThemeModal({ visible, onClose }: modalProps) {
    const { selectedTheme, changeTheme } = useTheme();
    const { changeCurrency } = useCurrency();
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
                                <Text style={[style.optionText, {color: THEMES[selectedTheme].text}]}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={style.cancel}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    );
}