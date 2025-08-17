import React from 'react';
import useAllergiesContext from '@/app/hooks/useAllergiesContext';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

const AllergiesInput = ({allergiesContext}: {allergiesContext: ReturnType<typeof useAllergiesContext>}) => {
    const {allergies, allergiesError, isNoneSelected, toggleNoneSelection, handleAllergiesChange, } = allergiesContext;


    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Allergies</Text>
            <View style={styles.fieldInput}>
                <TextInput
                    style={styles.fieldInput}
                    value={allergies}
                    onChangeText={handleAllergiesChange}
                    placeholder="Enter your allergies"
                    editable={!isNoneSelected}
                />
                {allergiesError && <Text style={styles.fieldError}>{allergiesError}</Text>}
                <TouchableOpacity style={styles.noneButton}
                 onPress={toggleNoneSelection}>
                    <Text style={styles.noneButtonText}>None</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
};

export default AllergiesInput; 


const styles = StyleSheet.create({
    fieldContainer: {
        width: '100%',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    fieldError: {
        color: 'red',
        fontSize: 12,
    },
    fieldInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    noneButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    noneButtonText: {
        color: 'white',
        fontSize: 12,
    },
});