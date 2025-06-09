import { styles } from '@/assets/styles/statistic.style';
import PageLoader from '@/components/PageLoader';
import { useStatistic } from '@/hooks/useTransactions';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContexts';
import { THEMES } from '@/constants/colors';
import { formatDateForFetch } from '@/utils/formatDateForFetch';
import ChoosePeriodModal from '@/components/ChoosePeriodModal';




// const CATEGORY_COLORS: Record<string, string> = {
//     'Food & Drinks': '#FF6384',
//     'Shopping': '#8E44AD',
//     'Transportation': '#36A2EB',
//     'Entertainment': '#F39C12',
//     'Bills': '#00B894',
//     'Others': '#636e72',
// };

const CATEGORY_COLORS: Record<string, string> = {
    'Food & Drinks': '#FF6384',        // red-pink
    'Shopping': '#8E44AD',             // purple
    'Transportation': '#36A2EB',       // blue
    'Transport': '#36A2EB',            // for consistency (alternate key)
    'Entertainment': '#F39C12',        // orange
    'Bills': '#00B894',                // teal
    'Income': '#2ECC71',               // green
    'Other': '#636e72',                // grey
    'Pharmacy': '#16A085',             // deep teal/green — health
    'Beauty': '#E91E63',               // hot pink — beauty/glam
    'Hobby and Sport': '#2980B9',      // sporty blue
    'Saving': '#27AE60',               // rich green — money
    'Education': '#3F51B5',            // academic blue
    'Traveling': '#00ACC1'             // sky blue — travel/air
};

const screenWidth = Dimensions.get('window').width;

export default function StatisticScreen() {

    const { user, isLoaded } = useUser();
    const { selectedTheme } = useTheme();

    // const [monthsCount, setMonthsCount] = useState<number>(0)
    const [showChooseModal, setShowChooseModal] = useState<boolean>(false)
    const [dateRange, setDateRange] = useState(() => {
        const today = new Date();

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        return formatDateForFetch(oneMonthAgo, today);
    })

    const stats = useStatistic({ userId: user?.id, start: dateRange.start, end: dateRange.end });

    if (!isLoaded || !stats) return <PageLoader />

    const pieData = (stats as any[])?.map((item) => ({
        name: `${item.category} - ${item.percentage}% (${item.total}lv)`,
        amount: item.total,
        color: CATEGORY_COLORS[item.category],
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
    }));

    const getStatsHandler = async (startDate: Date | null, endDate: Date | null) => {
        if (!startDate || !endDate) return
        const formatStart = startDate?.toISOString().split('T')[0];
        const formatEnd = endDate?.toISOString().split('T')[0];
        setDateRange({ start: formatStart, end: formatEnd });
        setShowChooseModal(false);
    }

    return (
        <View style={[styles.container, { backgroundColor: THEMES[selectedTheme].background }]}>
            <View style={styles.header}>
                <ChoosePeriodModal
                    visible={showChooseModal}
                    // onSelect={(value) => setMonthsCount(value)}
                    onClose={() => setShowChooseModal(false)}
                    getStatsHandler={getStatsHandler}
                />
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                        name='arrow-back'
                        size={24}
                    />
                </TouchableOpacity>
                <Text style={
                    [styles.title,
                    {
                        color: THEMES[selectedTheme].text
                    }]}
                >
                    Expense Breakdown
                </Text>

                <View />
            </View>
            <View>
                <PieChart
                    data={pieData}
                    width={screenWidth} // Use full screen width
                    height={250}
                    chartConfig={{
                        color: () => '#000',
                    }}
                    accessor={'amount'}
                    backgroundColor={'transparent'}
                    center={[100, 20]}  // Fine-tune X/Y chart centering
                    absolute
                    hasLegend={false}
                />
                <CustomLegend data={pieData} />
            </View>
            <View style={[styles.chooseButtonContainer,]}>
                <TouchableOpacity
                    style={
                        [styles.chooseButton,
                        {
                            borderColor: THEMES[selectedTheme].border
                        }]}
                    onPress={() => setShowChooseModal(prev => prev === false ? true : false)}
                >
                    <Text style={
                        [styles.chooseButtonText,
                        {
                            color: THEMES[selectedTheme].text,
                        }]}
                    >
                        Choose period
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const CustomLegend = ({ data }: any) => (

    <View style={styles.custumLegentContainer}>
        {data.map((item: any, index: any) => (
            <View key={index} style={styles.custumLegentItem}>
                <View style={{ width: 16, height: 16, backgroundColor: item.color, marginRight: 5 }} />
                <Text style={{ color: item.legendFontColor, fontSize: item.legendFontSize }}>{item.name}</Text>
            </View>
        ))}
    </View>
);






