import { styles } from '@/assets/styles/statistic.style';
import PageLoader from '@/components/PageLoader';
import { useStatistic } from '@/hooks/useTransactions';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/contexts/ThemeContexts';
import { THEMES } from '@/constants/colors';
import { formatDateForFetch } from '@/utils/formatDateForFetch';


type ChooseMonthsCountModalProps = {
    visible: boolean;
    // onSelect: (value: number) => void;
    onClose: () => void;
    getStatsHandler: (startDate: Date | null, endDate: Date | null) => void

};

const CATEGORY_COLORS: Record<string, string> = {
    'Food & Drinks': '#FF6384',
    'Shopping': '#8E44AD',
    'Transportation': '#36A2EB',
    'Entertainment': '#F39C12',
    'Bills': '#00B894',
    'Others': '#636e72',
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

    console.log(dateRange);


    const stats = useStatistic({ userId: user?.id, start: dateRange.start, end: dateRange.end });
    console.log('stats:', stats);

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
        setDateRange({ start: formatStart, end: formatEnd })
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

    <View style={styles.custumLegentContaimer}>
        {data.map((item: any, index: any) => (
            <View key={index} style={styles.custumLegentItem}>
                <View style={{ width: 16, height: 16, backgroundColor: item.color, marginRight: 5 }} />
                <Text style={{ color: item.legendFontColor, fontSize: item.legendFontSize }}>{item.name}</Text>
            </View>
        ))}
    </View>
);


const ChoosePeriodModal = ({ visible, onClose, getStatsHandler }: ChooseMonthsCountModalProps) => {

    const { selectedTheme } = useTheme();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={modalStyles.container}>
                <View style={modalStyles.contain}>
                    <Text style={modalStyles.title}>Select period</Text>

                    {/* DATE PICKER */}
                    <View style={{ marginVertical: 20, width: '100%' }}>
                        <Text style={{ fontWeight: 'bold' }}>Custom Date Range</Text>
                        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={modalStyles.datePickerButton}>
                            <Text>{startDate ? startDate.toDateString() : 'Select start date'}</Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? "spinner" : 'calendar'}
                                onChange={(event, selectedDate) => {
                                    setShowStartPicker(false);
                                    if (selectedDate) setStartDate(selectedDate);
                                }}
                            />
                        )}

                        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={modalStyles.datePickerButton}>
                            <Text>{endDate ? endDate.toDateString() : 'Select end date'}</Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? "spinner" : 'calendar'}
                                onChange={(event, selectedDate) => {
                                    setShowEndPicker(false);
                                    if (selectedDate) setEndDate(selectedDate);
                                }}
                            />
                        )}
                    </View>
                    <TouchableOpacity onPress={() => getStatsHandler(startDate, endDate)} style={modalStyles.cancelButton}>
                        <Text
                            style={modalStyles.cancelButtonText}
                        >
                            Send
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {onClose(), setEndDate(null), setStartDate(null)}} style={modalStyles.cancelButton}>
                        <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};


const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    contain: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },

    title: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '600'
    },

    monthOptionContainer: {
        flexDirection: 'row',
        gap: 5
    },

    monthItem: {
        marginTop: 10,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignItems: 'center',
    },

    monthItemText: {
        fontWeight: 'bold',
    },

    datePickerButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginTop: 10
    },

    cancelButton: {
        marginTop: 10,
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: 'red',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignItems: 'center',
    },

    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
})  
