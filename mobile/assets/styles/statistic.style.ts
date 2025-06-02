import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center', // center everything inside this view
        paddingTop: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },

    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600'
    },

    chartWrapper: {
        // flex: 1,
        // alignItems: 'center', // Centers horizontally
        // justifyContent: 'center', // Centers vertically
    },

});