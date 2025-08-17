import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import useGuestIdContext from '@/app/hooks/useGuestIdContext';

const GuestIdInput = ({guestIdContext}: {guestIdContext: ReturnType<typeof useGuestIdContext>}) => {

    const { guestId, guestIdError, handleGuestIdChange, isValidGuestId } = guestIdContext;
    
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Guest ID</Text>
            <View style={styles.fieldInput}>
                <TextInput
                    style={[
                        styles.input,
                        guestIdError ? styles.inputError : styles.inputValid
                    ]}
                    value={guestId}
                    onChangeText={handleGuestIdChange}
                    placeholder="Enter Guest ID"
                />
            </View>
            {guestIdError && <Text style={styles.fieldError}>{guestIdError}</Text>}
        </View>
    );
};

export default GuestIdInput;

const styles = StyleSheet.create({
    fieldContainer: {
        width: '100%',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 10,
        minWidth: 120,
    },
    fieldInput: {
        flex: 1,
        minWidth: 150,
    },
    fieldError: {
        fontSize: 14,
        color: '#FF3B30',
        marginTop: 5,
        width: '100%',
        marginLeft: 130, // Align with input (label width + marginRight)
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputValid: {
        borderColor: '#ddd',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
}); 