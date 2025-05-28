import { useCallback, useState } from "react"
import { Alert } from "react-native";

const API_URL = 'http://localhost:3000/api/transactions'
export const useTransactions = ({ userId }: any) => {
    const [transactions, setTransactions] = useState([])
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0
    });

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const getTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log('Error get transactions:', error);
        }
    }, [userId])

    const getSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
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
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            const data = await response.json();
            loadData();
            Alert.alert(data.message);
        } catch (error) {
            Alert.alert('Error delete transaction');
            console.log('Error deleting transaction:', error);
        }
    };
    return { transactions, summary, isLoading, loadData, deleteTransaction };
}