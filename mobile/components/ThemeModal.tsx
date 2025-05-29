import { style } from '@/assets/styles/themeModal.styles';
import { THEMES } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContexts';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface modalProps {
    visible: boolean,
    onClose: () => void
}

type ThemeName = keyof typeof THEMES

const themeOptions: { label: string; value: ThemeName }[] = [
  { label: 'Ocean', value: 'ocean' },
  { label: 'Coffee', value: 'coffee' },
  { label: 'Forest', value: 'forest' },
  { label: 'Purple', value: 'purple' },
];

export default function ThemeModal({ visible, onClose }: modalProps) {
    const { changeTheme } = useTheme();
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        // onRequestClose={onClose}
        >
            <View style={style.topBackdrop}>
                <View style={style.container}>
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
                    <TouchableOpacity onPress={onClose}>
                        <Text style={style.cancel}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    );
}