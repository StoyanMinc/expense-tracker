import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/contexts/ThemeContexts';
import { THEMES } from '@/constants/colors';
import { modalStyles } from '@/assets/styles/choose-period-modal.styles';

type ChooseMonthsCountModalProps = {
    visible: boolean;
    onClose: () => void;
    getStatsHandler: (startDate: Date | null, endDate: Date | null) => void

};
export default function ChoosePeriodModal({ visible, onClose, getStatsHandler }: ChooseMonthsCountModalProps) {

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
                    <Text style={[modalStyles.title, {color: THEMES[selectedTheme].text}]}>Select period</Text>

                    {/* DATE PICKER */}
                    <View style={{ marginVertical: 20, width: '100%' }}>
                        <Text style={{ fontWeight: 'bold' }}>Custom Date Range</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (!startDate) setStartDate(new Date()); // Default to today
                                setShowStartPicker(true);
                            }}
                            style={modalStyles.datePickerButton}
                        >
                            <Text>{startDate ? startDate.toDateString() : 'Select start date'}</Text>
                        </TouchableOpacity>

                        {showStartPicker && (
                            <>
                                <DateTimePicker
                                    value={startDate || new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? "spinner" : 'calendar'}
                                    onChange={(event, selectedDate) => {
                                        // setShowStartPicker(false);
                                        if (selectedDate) setStartDate(selectedDate);
                                    }}
                                    themeVariant="light"
                                />
                                <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                                    <Text style={{ textAlign: 'center', padding: 10, color: 'blue' }}>Done</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity
                            onPress={() => {
                                if (!endDate) setEndDate(new Date()); // Default to today
                                setShowStartPicker(true);
                            }}
                            style={modalStyles.datePickerButton}
                        >
                            <Text>{endDate ? endDate.toDateString() : 'Select end date'}</Text>
                        </TouchableOpacity>

                        {showEndPicker && (
                            <>
                                <DateTimePicker
                                    value={endDate || new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? "spinner" : 'calendar'}
                                    // display='calendar'
                                    onChange={(event, selectedDate) => {
                                        // setShowEndPicker(false);
                                        if (selectedDate) setEndDate(selectedDate);
                                    }}
                                    themeVariant="light"
                                />
                                <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                                    <Text style={{ textAlign: 'center', padding: 10, color: 'blue' }}>Done</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                    <TouchableOpacity onPress={() => getStatsHandler(startDate, endDate)} style={modalStyles.sendButton}>
                        <Text
                            style={modalStyles.cancelButtonText}
                        >
                            Send
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { onClose(), setEndDate(null), setStartDate(null) }} style={modalStyles.cancelButton}>
                        <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

