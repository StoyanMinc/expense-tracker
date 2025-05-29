import { styles } from '@/assets/styles/create.styles';
import { COLORS } from '@/constants/colors';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';

type IonIconName = keyof typeof Ionicons.glyphMap;

interface Category {
    id: string;
    name: string;
    icon: IonIconName;
}

const CATEGORIES: Category[] = [
    { id: 'food', name: 'Food & Drinks', icon: 'fast-food' },
    { id: 'shopping', name: 'Shopping', icon: 'cart' },
    { id: 'transportation', name: 'Transportation', icon: 'car' },
    { id: 'entertainment', name: 'Entertainment', icon: 'film' },
    { id: 'bills', name: 'Bills', icon: 'receipt' },
    { id: 'income', name: 'Income', icon: 'cash' },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal' },
]
export default function CreateScreen() {
    const { user } = useUser();

    const [isExpense, setIsExpense] = useState<boolean>(true);
    const [amount, setAmount] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isLoadinng, setIsLoading] = useState<boolean>(false);

    const { createTransaction } = useTransactions({ userId: user?.id });

    const createHandler = async () => {

        if (!title) return Alert.alert('Title is required!');
        if(isNaN(Number(amount)) || Number(amount) <= 0) return Alert.alert('Amount must be a valid number!');
        if (!selectedCategory) return Alert.alert('Category is required!');
        setIsLoading(true);
        try {
            const formatedAmount = isExpense
                ? -Math.abs(Number(amount))
                : Math.abs(Number(amount));

            // const date = new Date();
            const transaction = await createTransaction({
                user_id: user!.id,
                title,
                amount: formatedAmount,
                category: selectedCategory
            });
            console.log(transaction);
            router.back();
        } catch (error) {
            console.log('Error creating transaction:', error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='arrow-back' size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create transaction</Text>
                <TouchableOpacity
                    style={[styles.saveButtonContainer, isLoadinng && styles.saveButtonDisabled]}
                    disabled={isLoadinng}
                    onPress={createHandler}
                >
                    <Text style={styles.saveButton}>{isLoadinng ? 'Saving...' : 'Save'}</Text>
                    {!isLoadinng && <Ionicons name='checkmark' size={18} color={COLORS.primary} />}
                </TouchableOpacity>
            </View>
            <View style={styles.card}>

                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                        onPress={() => setIsExpense(true)}
                    >
                        <Ionicons
                            name='arrow-down-circle'
                            size={22}
                            color={isExpense ? COLORS.white : COLORS.expense}
                            style={styles.typeIcon}
                        />
                        <Text
                            style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}
                        >
                            Expense
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                        onPress={() => setIsExpense(false)}
                    >
                        <Ionicons
                            name='arrow-up-circle'
                            size={22}
                            color={isExpense ? COLORS.income : COLORS.white}
                            style={styles.typeIcon}
                        />
                        <Text
                            style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}
                        >
                            Income
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder='0.00'
                        placeholderTextColor={COLORS.textLight}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType='numeric'
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons
                        name='create-outline'
                        style={styles.inputIcon}
                        size={22}
                        color={COLORS.textLight}
                    />
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Transaction title'
                        placeholderTextColor={COLORS.textLight}
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    <Ionicons name='pricetag-outline' size={18} /> Category
                </Text>

                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[styles.categoryButton, selectedCategory === category.name && styles.categoryButtonActive]}
                            onPress={() => setSelectedCategory(category.name)}
                        >
                            <Ionicons
                                name={category.icon}
                                size={24}
                                style={styles.categoryIcon}
                                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                            />
                            <Text
                                style={[styles.categoryButtonText, selectedCategory === category.name && styles.categoryButtonTextActive]}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {isLoadinng && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'large'} color={COLORS.primary} />
                </View>
            )}
        </View>
    );
}