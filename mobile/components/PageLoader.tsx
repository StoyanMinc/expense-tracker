import { styles } from '@/assets/styles/home.styles';
import { COLORS, THEMES } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContexts';
import { View, ActivityIndicator } from 'react-native';

export default function PageLoader() {
    const { selectedTheme } = useTheme();
    return (
        <View style={[styles.loadingContainer, { backgroundColor: THEMES[selectedTheme].background }]}>
            <ActivityIndicator size='large' color={COLORS.primary} />
        </View>
    );
}