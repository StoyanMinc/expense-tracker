import { styles } from '@/assets/styles/home.styles';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NoTransactions() {
    const router = useRouter()
    return (
        <View style={styles.emptyState}>
            <Ionicons
                name='receipt-outline'
                size={60}
                color={COLORS.textLight}
                style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>No transactions yet</Text>
            <Text style={styles.emptyStateText}>Start tracking your finances by adding first transaction</Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push('/(root)')}>
                <Ionicons name='add-circle' size={18} color={COLORS.white} />
                <Text style={styles.emptyStateButtonText}>Add transaction</Text>
            </TouchableOpacity>
        </View>
    );
}