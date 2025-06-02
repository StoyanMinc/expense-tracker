import { styles } from '@/assets/styles/statistic.style';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = [
    {
        name: 'Food & Drinks',
        amount: 220,
        color: '#FF6384',
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
    },
    {
        name: 'Shopping',
        amount: 150,
        color: '#8E44AD',
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
    },
    {
        name: 'Transportation',
        amount: 80,
        color: '#36A2EB',
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
    },
    {
        name: 'Entertainment',
        amount: 90,
        color: '#F39C12',
        legendFontColor: '#7F7F7F',
        legendFontSize: 14,
    },
];

const total = data.reduce((sum, item) => sum + item.amount, 0);


const pieData = data.map(item => ({
    name: `${item.name} (${Math.round((item.amount / total) * 100)}%)`,
    amount: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
}));

const CustomLegend = ({ data }: any) => (
    <View style={{ marginTop: 20 , gap: 20, paddingLeft: 10}}>
        {data.map((item: any, index: any) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                <View style={{ width: 16, height: 16, backgroundColor: item.color, marginRight: 5 }} />
                <Text style={{ color: item.legendFontColor, fontSize: item.legendFontSize }}>{item.name}</Text>
                <Text style={{ color: item.legendFontColor, fontSize: item.legendFontSize }}>{item.amount}lv</Text>
            </View>
        ))}
    </View>
);


export default function StatisticScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                        name='arrow-back'
                        size={24}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Expense Breakdown</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>period</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.chartWrapper}>
                <PieChart
                    data={pieData}
                    width={screenWidth} // Use full screen width
                    height={250}
                    chartConfig={{
                        color: () => '#000',
                    }}
                    accessor={'amount'}
                    backgroundColor={'transparent'}
                    // paddingLeft={'50'} // Shift it more to the right
                    center={[100, 20]}  // Fine-tune X/Y chart centering
                    absolute
                    hasLegend={false}
                />
                <CustomLegend data={pieData} />
            </View>
        </View>
    );
}


