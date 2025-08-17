import React from 'react';
import useDietaryRestrictionsContext from '@/app/hooks/useDietaryRestrictionsContext';
import { DietaryRestrictionType } from '@/constants/dietaryRestrictions';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DietaryRestrictionsInput = ({dietaryRestrictionsContext}: {dietaryRestrictionsContext: ReturnType<typeof useDietaryRestrictionsContext>}) => {

    const { selectedDietaryRestrictions, dietaryRestrictionsError, handleToggleRestrictionSelection, isValidDietaryRestrictions, DIETARY_RESTRICTIONS, isShowOptions, handleToggleShowOptions } = dietaryRestrictionsContext;

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Dietary Restrictions</Text>
            <View style={styles.fieldInput}>
                <TouchableOpacity 
                    style={[
                        styles.dropdownButton,
                        dietaryRestrictionsError ? styles.dropdownButtonError : styles.dropdownButtonValid
                    ]}
                    onPress={handleToggleShowOptions}
                >
                    <View style={styles.dropdownButtonContent}>
                        <Text style={styles.dropdownButtonText}>
                            Dietary Restrictions
                        </Text>
                        <Text style={styles.arrowIcon}>▼</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {isShowOptions && <View style={styles.dropdownOptions}>
                {DIETARY_RESTRICTIONS.map((restriction) => (
                    <TouchableOpacity
                    key={restriction} 
                    style={[
                        styles.optionItem,
                        selectedDietaryRestrictions.has(restriction) 
                            ? styles.optionSelected 
                            : styles.optionUnselected
                    ]}
                      
                     onPress={() => handleToggleRestrictionSelection(restriction)}>
                        <View style={styles.optionContent}>
                            <Text style={[
                                styles.optionText,
                                selectedDietaryRestrictions.has(restriction) 
                                    ? styles.optionTextSelected 
                                    : styles.optionTextUnselected
                            ]}>
                                {restriction}
                            </Text>
                            {selectedDietaryRestrictions.has(restriction) && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>}
            {dietaryRestrictionsError && <Text style={styles.fieldError}>{dietaryRestrictionsError}</Text>}
        </View>
    );
};

export default DietaryRestrictionsInput;    

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
    dropdownButton: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        minHeight: 48,
    },
    dropdownButtonValid: {
        borderColor: '#ddd',
    },
    dropdownButtonError: {
        borderColor: '#FF3B30',
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'left',
    },
    dropdownButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    arrowIcon: {
        fontSize: 16,
        color: '#333',
    },
    dropdownOptions: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        zIndex: 1000,
        elevation: 5, // For Android
    },
    optionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    optionSelected: {
        backgroundColor: '#e8f5e8', // Light green background
        borderLeftWidth: 4,
        borderLeftColor: '#28a745', // Green accent border
    },
    optionUnselected: {
        backgroundColor: '#fff',
    },
    optionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    optionTextSelected: {
        fontWeight: 'bold',
        color: '#007bff', // Example color for selected text
    },
    optionTextUnselected: {
        fontWeight: 'normal',
        color: '#333',
    },
    checkmark: {
        fontSize: 20,
        color: '#007bff', // Example color for checkmark
    },
});