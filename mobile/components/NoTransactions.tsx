import { styles } from '@/assets/styles/home.styles';
import { COLORS, THEMES } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContexts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NoTransactions() {
    const {selectedTheme} = useTheme();
    const router = useRouter()
    return (
        <View style={[styles.emptyState, {backgroundColor: THEMES[selectedTheme].background}]}>
            <Ionicons
                name='receipt-outline'
                size={60}
                color={COLORS.textLight}
                style={styles.emptyStateIcon}
            />
            <Text style={[styles.emptyStateTitle, {color: THEMES[selectedTheme].text}]}>No transactions yet</Text>
            <Text style={[styles.emptyStateText, {color: THEMES[selectedTheme].textLight}]}>Start tracking your finances by adding first transaction</Text>
            <TouchableOpacity style={[styles.emptyStateButton, {backgroundColor: THEMES[selectedTheme].primary}]} onPress={() => router.push('/(root)/create')}>
                <Ionicons name='add-circle' size={18} color={COLORS.white} />
                <Text style={styles.emptyStateButtonText}>Add transaction</Text>
            </TouchableOpacity>
        </View>
    );
}