import { useCallback, useEffect, useState } from "react"
import { Alert } from "react-native";
import { API_URL, API_URL_DEV } from '@env';


const BASE_URL = API_URL_DEV
interface createTransactionProps {
    user_id: string,
    title: string,
    amount: number,
    category: string,
}

interface Transaction {
    id: number;
    user_id: string;
    title: string;
    amount: number;
    category: string;
    created_at: string;
}


export const useTransactions = ({ userId }: any | null) => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0
    });

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const getTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log('Error get transactions:', error);
        }
    }, [userId])

    const getSummary = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/summary/${userId}`);
            const data = await response.json();
            setSummary({
                balance: data.balance | 0,
                income: data.income | 0,
                expenses: data.expenses | 0
            });
        } catch (error) {
            console.log('Error get summary:', error);
        }
    }, [userId])

    const loadData = useCallback(async () => {
        try {
            await Promise.all([getTransactions(), getSummary()])
        } catch (error) {
            console.log('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getTransactions, getSummary, userId])

    const deleteTransaction = async (id: any) => {

        try {
            const response = await fetch(`${BASE_URL}/${id}`,
                { method: 'DELETE' });
            const data = await response.json();
            loadData();
            Alert.alert(data.message);
        } catch (error) {
            Alert.alert('Error delete transaction');
            console.log('Error deleting transaction:', error);
        }
    };

    const createTransaction = async ({ user_id, title, amount, category }: createTransactionProps) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ user_id, title, amount, category })
            });
            const data = await response.json();
            const newTransaction: Transaction = {
                id: data.id,
                user_id: data.user_id,
                title: data.title,
                amount: data.amount,
                category: data.category,
                created_at: data.created_at
            }
            setTransactions((prev) => [...prev, newTransaction])

        } catch (error) {
            console.log('Error creating transaction:', error);
        }
    }


    return {
        transactions,
        summary,
        isLoading,
        loadData,
        deleteTransaction,
        createTransaction,
    };
}

export const useStatistic = ({ userId, start, end }: any) => {
    const [stats, setStats] = useState([]);
    if (!userId) return;
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${BASE_URL}/get-stats/${userId}?start=${start}&end=${end}`);
                const result = await response.json();
                setStats(result);
            } catch (error) {
                console.log('Error get statistic:', error);
            }
        })()
    }, [userId, start, end])

    return stats;
}