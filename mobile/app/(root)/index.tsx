import { useUser } from '@clerk/clerk-expo'
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions';
import { useCallback, useEffect, useState } from 'react';
import PageLoader from '@/components/PageLoader';
import { styles } from '@/assets/styles/home.styles';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, THEMES } from '@/constants/colors';
import BalanceCard from '@/components/BalanceCard';
import TransactionItem from '@/components/TransactionItem';
import NoTransactions from '@/components/NoTransactions';
import { router, useFocusEffect } from 'expo-router';
import ThemeModal from '@/components/ThemeModal';
import { useTheme } from '@/contexts/ThemeContexts';



export default function Page() {
    const { user } = useUser();
    const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions({ userId: user?.id });
    const [refreshing, setRefreshing] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const { selectedTheme } = useTheme();
    useEffect(() => {
        loadData();
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    let username = '';
    if (user) {
        username = user?.emailAddresses[0].emailAddress.split('@')[0]
    }

    const deleteHandler = (id: any) => {
        Alert.alert('DeleteTransaction', 'Are you sure delete this transaction?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) }
        ])
    }

    if (isLoading && !refreshing) return <PageLoader />

    const onRefresh = async () => {
        setRefreshing(true);
        loadData();
        setRefreshing(false);
    }

    return (
        <View style={[styles.container, { backgroundColor: THEMES[selectedTheme].background }]}>
            <View style={styles.content}>
                <ThemeModal visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {/* <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.headerLogo}
                            resizeMode='contain'
                        /> */}
                        <View style={styles.welcomeContainer}>
                            <Text style={[styles.welcomeText, { color: THEMES[selectedTheme].textLight }]}>Welcome</Text>
                            <Text style={[styles.usernameText, { color: THEMES[selectedTheme].text }]}>{username}</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={[styles.addButton, { backgroundColor: THEMES[selectedTheme].primary }]} onPress={() => router.push('/create')}>
                            <Ionicons name='add' size={20} color={COLORS.white} />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: THEMES[selectedTheme].primary }]}
                            onPress={() => setIsMenuVisible((prev) => !prev)}
                        >
                            <Ionicons name='color-palette' size={20} color={COLORS.white} />
                        </TouchableOpacity>
                        <SignOutButton />
                    </View>
                </View>


                <BalanceCard summary={summary} />
                <View style={styles.transactionsHeaderContainer}>
                    <Text style={[styles.transactionTitle, { color: THEMES[selectedTheme].text }]}>Recent transactions</Text>
                </View>

            </View>
            <FlatList
                style={styles.transactionsList}
                contentContainerStyle={styles.transactionsListContent}
                data={transactions}
                renderItem={({ item }) => <TransactionItem item={item} onDelete={deleteHandler} />}
                ListEmptyComponent={<NoTransactions />}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    )
}