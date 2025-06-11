import { styles } from '@/assets/styles/home.styles';
import { COLORS, THEMES } from '@/constants/colors';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContexts';
import { formatValueWithCurrency } from '@/utils/formatCurrency';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

interface Summary {
    balance: number
    expenses: number
    income: number
}

interface CurrencyRate {
    label: '$' | '€' | 'лв.';
    usd?: number;
    eur?: number;
    bgn?: number;
}

interface BalanceCardProps {
    summary: Summary;
    currency: string,
    currencyData: CurrencyRate
}


export default function BalanceCard({ summary, currency, currencyData }: BalanceCardProps) {
    const { selectedCurrency } = useCurrency();
    const { selectedTheme } = useTheme()
    let balanceToDisplay = summary.balance;
    let incomeToDisplay = summary.income;
    let expenseToDispay = summary.expenses;

    if (selectedCurrency != currency) {
        if (selectedCurrency === 'лв.' && currencyData.bgn) {
            balanceToDisplay= summary.balance / currencyData.bgn;
            incomeToDisplay = summary.income / currencyData.bgn;
            expenseToDispay = summary.expenses / currencyData.bgn
        } else if (selectedCurrency === '$' && currencyData.usd) {
           balanceToDisplay= summary.balance / currencyData.usd;
            incomeToDisplay = summary.income / currencyData.usd;
            expenseToDispay = summary.expenses / currencyData.usd
        } else if (selectedCurrency === '€' && currencyData.eur) {
            balanceToDisplay= summary.balance / currencyData.eur;
            incomeToDisplay = summary.income / currencyData.eur;
            expenseToDispay = summary.expenses / currencyData.eur
        }

    }

    return (

        <View style={[styles.balanceCard, { backgroundColor: THEMES[selectedTheme].card }]}>
            <View style={styles.BalanceCardHeader}>
                <View>
                    <Text style={[styles.balanceTitle, { color: THEMES[selectedTheme].textLight }]}>Total Balance</Text>
                    <Text style={[styles.balanceAmount, { color: THEMES[selectedTheme].text }]}>{formatValueWithCurrency(balanceToDisplay.toFixed(2), currency)}</Text>
                </View>
                <TouchableOpacity style={styles.statsButton} onPress={() => router.push('/statistic')}>
                    <Text style={{ color: THEMES[selectedTheme].text }}>View Statistic</Text>
                    <Ionicons
                        name='pie-chart'
                        size={33}
                        color={'orange'}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={[styles.balanceStatLabel, { color: THEMES[selectedTheme].text }]}>Income</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
                        {/* {`${Number(summary.income).toFixed(2)} ${selectedCurrency}`} */}
                        {formatValueWithCurrency(incomeToDisplay.toFixed(2), currency)}
                    </Text>
                </View>
                <View style={[styles.statDivider, { borderColor: THEMES[selectedTheme].border }]} />
                <View style={styles.balanceStatItem}>
                    <Text style={[styles.balanceStatLabel, { color: THEMES[selectedTheme].text }]}>Expenses</Text>
                    <Text style={[styles.balanceStatAmount, { color: THEMES[selectedTheme].expense }]}>
                        -{formatValueWithCurrency(Math.abs(expenseToDispay).toFixed(2), currency)}
                    </Text>
                </View>
            </View>
        </View>

    );
}