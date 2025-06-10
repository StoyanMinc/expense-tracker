import { styles } from '@/assets/styles/home.styles';
import { COLORS, THEMES } from '@/constants/colors';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContexts';
import { formatValueWithCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

const CATEGORY_ICONS: any = {
    "Food & Drinks": 'fast-food',
    Shopping: 'cart',
    Transport: 'car',
    Entertainment: 'film',
    Bills: 'receipt',
    Income: 'cash',
    Other: 'ellipsis-horizontal',
    Pharmacy: 'medkit',
    Beauty: 'flower',
    'Hobby and Sport': 'football',
    Saving: 'wallet',
    Education: 'book',
    Traveling: 'airplane'
}

interface dataProps {
    amount: number,
    category: string,
    created_at: string,
    id: number,
    title: string,
    user_id: string
}

interface TransactionItemProps {
    item: dataProps
    onDelete: (id: any) => void
}

export default function TransactionItem({ item, onDelete }: TransactionItemProps) {
    const { selectedTheme } = useTheme();
    const { selectedCurrency } = useCurrency();
    const isIncome = item.amount > 0;
    const itemIcon = CATEGORY_ICONS[item.category];

    return (
        <View style={[styles.transactionCard, { backgroundColor: THEMES[selectedTheme].card }]}>
            <TouchableOpacity style={styles.transactionContent}>
                <View style={styles.categoryIconContainer}>
                    <Ionicons name={itemIcon} size={22} color={isIncome ? COLORS.income : THEMES[selectedTheme].expense} />
                </View>
                <View style={styles.transactionLeft}>
                    <Text style={[styles.transactionTitle, { color: THEMES[selectedTheme].text }]}>{item.title}</Text>
                    <Text style={[styles.transactionCategory, { color: THEMES[selectedTheme].textLight }]}>{item.category}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: isIncome ? THEMES[selectedTheme].income : THEMES[selectedTheme].expense }]}>
                        {/* {isIncome ? '+' : '-'}{`${Math.abs(item.amount).toFixed(2)} ${selectedCurrency}`} */}
                        {isIncome ? '+' : '-'}{formatValueWithCurrency(Math.abs(item.amount).toFixed(2), selectedCurrency)}
                    </Text>
                    <Text style={[styles.transactionDate, { color: THEMES[selectedTheme].textLight }]}>{formatDate(item.created_at)}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deleteButton, { borderColor: THEMES[selectedTheme].border }]} onPress={() => onDelete(item.id)}>
                <Ionicons name='trash-outline' size={22} color={THEMES[selectedTheme].expense} />
            </TouchableOpacity>
        </View>
    );
}