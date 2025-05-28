import { styles } from '@/assets/styles/home.styles';
import { COLORS } from '@/constants/colors';
import { formatDate } from '@/utils/formatDate';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

const CATEGORY_ICONS: any = {
    "Food & Drinks": 'fast-food',
    Shopping: 'cart',
    Transportation: 'car',
    Intertainment: 'film',
    Bills: 'receipt',
    Income: 'cash',
    Other: 'ellipsis-horizontal'
}

interface dataProps {
    amount: string,
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
    
    const isIncome = Number(item.amount) > 0;
    const itemIcon = CATEGORY_ICONS[item.category];
    
    return (
        <View style={styles.transactionCard}>
            <TouchableOpacity style={styles.transactionContent}>
                <View style={styles.categoryIconContainer}>
                    <Ionicons name={itemIcon} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
                </View>
                <View style={styles.transactionLeft}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionCategory}>{item.category}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
                        {isIncome ? '+' : '-'}${Math.abs(Number(item.amount)).toFixed(2)}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                <Ionicons name='trash-outline' size={22} color={COLORS.expense} />
            </TouchableOpacity>
        </View>
    );
}