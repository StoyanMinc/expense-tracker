import { styles } from '@/assets/styles/home.styles';
import { COLORS, THEMES } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContexts';
import { View, Text } from 'react-native';

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
        <View style={[styles.balanceCard, {backgroundColor: THEMES[selectedTheme].card}]}>
            <Text style={[styles.balanceTitle, { color: THEMES[selectedTheme].textLight }]}>Total Balance</Text>
            <Text style={[styles.balanceAmount, { color: THEMES[selectedTheme].text }]}>{Number(summary.balance).toFixed(2)}</Text>
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