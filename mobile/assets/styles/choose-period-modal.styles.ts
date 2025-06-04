import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
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

    sendButton: {
        marginTop: 10,
        backgroundColor: 'green',
        borderWidth: 1,
        borderColor: 'green',
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