import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const style = StyleSheet.create({

    topBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        paddingTop: 80, // push it a bit down from the very top
        alignItems: 'center',
        
    },

    container: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 10,
        width: '90%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },

    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    option: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },

    optionText: {
        fontSize: 16,
        fontWeight: '600',
    },

    cancel: {
        marginTop: 16,
        textAlign: 'center',
        color: COLORS.white,
        paddingVertical: 5,
        paddingHorizontal: 12,
        fontWeight: '600',
        fontSize: 15,
        backgroundColor: 'red',
        alignSelf: 'center',
        borderRadius: 8
    },

    currencyContainer: {
        gap: 7,
    }
});