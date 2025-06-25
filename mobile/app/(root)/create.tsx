import { styles } from '@/assets/styles/create.styles';
import { COLORS, THEMES } from '@/constants/colors';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContexts';
import { useTransactions } from '@/hooks/useTransactions';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type IonIconName = keyof typeof Ionicons.glyphMap;

interface Category {
    id: string;
    name: string;
    icon: IonIconName;
}

const CATEGORIES: Category[] = [
    { id: 'food', name: 'Food & Drinks', icon: 'fast-food' },
    { id: 'shopping', name: 'Shopping', icon: 'cart' },
    { id: 'bills', name: 'Bills', icon: 'receipt' },
    { id: 'transport', name: 'Transport', icon: 'car' },
    { id: 'pharmacy', name: 'Pharmacy', icon: 'medkit' },
    { id: 'beauty', name: 'Beauty', icon: 'flower' },
    { id: 'hobby', name: 'Hobby and Sport', icon: 'football' },
    { id: 'education', name: 'Education', icon: 'book' },
    { id: 'entertainment', name: 'Entertainment', icon: 'film' },
    { id: 'traveling', name: 'Traveling', icon: 'airplane' },
    { id: 'income', name: 'Income', icon: 'cash' },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal' },
    { id: 'saving', name: 'Saving', icon: 'wallet' }
]

export default function CreateScreen() {
    const { user } = useUser();
    const { selectedTheme } = useTheme();
    const { selectedCurrency } = useCurrency();

    const [isExpense, setIsExpense] = useState<boolean>(true);
    const [amount, setAmount] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isLoadinng, setIsLoading] = useState<boolean>(false);

    const { createTransaction } = useTransactions({ userId: user?.id });

    const createHandler = async () => {

        const normalizedAmount = amount.replace(',', '.');
        if (!title) return Alert.alert('Title is required!');
        if (isNaN(Number(normalizedAmount)) || Number(normalizedAmount) <= 0) return Alert.alert('Amount must be a valid number!');
        if (!selectedCategory) return Alert.alert('Category is required!');
        setIsLoading(true);
        try {
            const formatedAmount = isExpense
                ? -Math.abs(Number(normalizedAmount))
                : Math.abs(Number(normalizedAmount));

            // const date = new Date();
            await createTransaction({
                user_id: user!.id,
                title,
                amount: formatedAmount,
                category: selectedCategory
            });

            router.back();
        } catch (error) {
            console.log('Error creating transaction:', error);
        } finally {
            setIsLoading(false);
        }
    }
    return (

        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
        >

            <View style={[styles.container, { backgroundColor: THEMES[selectedTheme].background }]}>
                <View style={[styles.header, { borderBottomColor: THEMES[selectedTheme].border }]}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='arrow-back' size={24} color={THEMES[selectedTheme].text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: THEMES[selectedTheme].text }]}>Create transaction</Text>
                    <TouchableOpacity
                        style={[styles.saveButtonContainer, isLoadinng && styles.saveButtonDisabled]}
                        disabled={isLoadinng}
                        onPress={createHandler}
                    >
                        <Text style={[styles.saveButton, { color: THEMES[selectedTheme].primary }]}>{isLoadinng ? 'Saving...' : 'Save'}</Text>
                        {!isLoadinng && <Ionicons name='checkmark' size={18} color={THEMES[selectedTheme].primary} />}
                    </TouchableOpacity>
                </View>
                <View style={[styles.card, { backgroundColor: THEMES[selectedTheme].card }]}>

                    <View style={styles.typeSelector}>
                        <TouchableOpacity
                            style={
                                [[styles.typeButton,
                                { borderColor: THEMES[selectedTheme].border }],
                                isExpense &&
                                {
                                    backgroundColor: THEMES[selectedTheme].primary,
                                    borderColor: THEMES[selectedTheme].primary
                                }]}
                            onPress={() => setIsExpense(true)}
                        >
                            <Ionicons
                                name='arrow-down-circle'
                                size={22}
                                color={isExpense ? COLORS.white : COLORS.expense}
                                style={styles.typeIcon}
                            />
                            <Text
                                style={
                                    [[styles.typeButtonText,
                                    { color: THEMES[selectedTheme].text }],
                                    isExpense &&
                                    {
                                        backgroundColor: THEMES[selectedTheme].primary,
                                        color: THEMES[selectedTheme].white
                                    }]}
                            >
                                Expense
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={
                                [[styles.typeButton,
                                { borderColor: THEMES[selectedTheme].border }],
                                !isExpense &&
                                {
                                    backgroundColor: THEMES[selectedTheme].primary,
                                    borderColor: THEMES[selectedTheme].primary
                                }]}
                            onPress={() => setIsExpense(false)}
                        >
                            <Ionicons
                                name='arrow-up-circle'
                                size={22}
                                color={isExpense ? COLORS.income : COLORS.white}
                                style={styles.typeIcon}
                            />
                            <Text
                                style={[[styles.typeButtonText, { color: THEMES[selectedTheme].text }], !isExpense && {
                                    backgroundColor: THEMES[selectedTheme].primary,
                                    color: THEMES[selectedTheme].white
                                }]}
                            >
                                Income
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.amountContainer, { borderBottomColor: THEMES[selectedTheme].border }]}>
                        <Text style={[styles.currencySymbol, { color: THEMES[selectedTheme].text }]}>
                            {selectedCurrency}
                        </Text>
                        <TextInput
                            style={[styles.amountInput, { color: THEMES[selectedTheme].text }]}
                            placeholder='0.00'
                            placeholderTextColor={THEMES[selectedTheme].textLight}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType='numeric'
                        />
                    </View>

                    <View style={[styles.inputContainer, { borderColor: THEMES[selectedTheme].border }]}>
                        <Ionicons
                            name='create-outline'
                            style={styles.inputIcon}
                            size={22}
                            color={THEMES[selectedTheme].textLight}
                        />
                        <TextInput
                            style={[styles.input, { color: THEMES[selectedTheme].text }]}
                            value={title}
                            onChangeText={setTitle}
                            placeholder='Transaction title'
                            placeholderTextColor={THEMES[selectedTheme].textLight}
                        />
                    </View>

                    <Text style={[styles.sectionTitle, { color: THEMES[selectedTheme].text }]}>
                        <Ionicons name='pricetag-outline' size={18} /> Category
                    </Text>


                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryButton,
                                    { borderColor: THEMES[selectedTheme].border },
                                    selectedCategory === category.name &&
                                    {
                                        borderColor: THEMES[selectedTheme].primary,
                                        backgroundColor: THEMES[selectedTheme].primary
                                    }
                                ]}
                                onPress={() => setSelectedCategory(category.name)}
                            >
                                <Ionicons
                                    name={category.icon}
                                    size={24}
                                    style={styles.categoryIcon}
                                    color={selectedCategory === category.name ? COLORS.white : THEMES[selectedTheme].text}
                                />
                                <Text
                                    style={
                                        [[styles.categoryButtonText,
                                        { color: THEMES[selectedTheme].text }],
                                        selectedCategory === category.name &&
                                        styles.categoryButtonTextActive]}
                                >
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
                {isLoadinng && (
                    <View style={[styles.loadingContainer, { backgroundColor: THEMES[selectedTheme].background }]}>
                        <ActivityIndicator size={'large'} color={COLORS.primary} />
                    </View>
                )}
            </View>

        </KeyboardAwareScrollView>

    );
}