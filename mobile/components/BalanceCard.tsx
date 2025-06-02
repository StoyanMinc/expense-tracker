import { styles } from '@/assets/styles/home.styles';
import { COLORS, THEMES } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContexts';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

interface Summary {
    balance: number
    expenses: number
    income: number
}

interface BalanceCardProps {
    summary: Summary;
}

export default function BalanceCard({ summary }: BalanceCardProps) {
    const { selectedTheme } = useTheme()
    return (
        <View style={[styles.balanceCard, { backgroundColor: THEMES[selectedTheme].card }]}>
            <View style={styles.BalanceCardHeader}>
                <View>
                    <Text style={[styles.balanceTitle, { color: THEMES[selectedTheme].textLight }]}>Total Balance</Text>
                    <Text style={[styles.balanceAmount, { color: THEMES[selectedTheme].text }]}>{Number(summary.balance).toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.statsButton} onPress={() => router.push('/statistic')}>
                    <Text style={ { color: THEMES[selectedTheme].text }}>View Statistic</Text>
                    <Ionicons 
                    name='pie-chart'
                    size={33}
                    color={'orange'}
                    // style={styles.statsIcon}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={[styles.balanceStatLabel, { color: THEMES[selectedTheme].text }]}>Income</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
                        +${Number(summary.income).toFixed(2)}
                    </Text>
                </View>
                <View style={[styles.statDivider, { borderColor: THEMES[selectedTheme].border }]} />
                <View style={styles.balanceStatItem}>
                    <Text style={[styles.balanceStatLabel, { color: THEMES[selectedTheme].text }]}>Expenses</Text>
                    <Text style={[styles.balanceStatAmount, { color: THEMES[selectedTheme].expense }]}>
                        -${Math.abs(summary.expenses).toFixed(2)}
                    </Text>
                </View>
            </View>

        </View>
    );
}