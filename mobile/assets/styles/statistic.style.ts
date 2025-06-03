import { COLORS } from "@/constants/colors";
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

    custumLegentContaimer: {
        marginTop: 20,
        gap: 20,
        paddingLeft: 10
    },

    custumLegentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5
    },

    chooseButtonContainer: {
        marginTop: 50,
        alignItems: 'center'
    },

    chooseButton: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        backgroundColor: COLORS.white
    },

    chooseButtonText:{ 
        fontWeight: '600'
    }

});