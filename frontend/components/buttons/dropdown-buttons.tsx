import { commonStyles } from "@/styles/commonStyles";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input } from "react-native-elements";

interface DropdownButtonProps {
    text: string;
    state: string | undefined | any;
    setState: (state: string | undefined | any | boolean) => void;
    error: boolean;
    errorMessages: string;
    showDropdown: boolean;
    setShowDropdown: (showDropdown: boolean) => void;
    dropdownOptionsArray: string[];
    handleDropdownOptionSelection: (option: string) => void;
}


const DropdownButton = ({text, state, setState, error, errorMessages, showDropdown, setShowDropdown, dropdownOptionsArray ,handleDropdownOptionSelection}: DropdownButtonProps) => {



    const renderOptions = ({item}: {item: string}) => {
        return (
        <TouchableOpacity
        style={styles.dropdownOption}
        onPress={() => handleDropdownOptionSelection(item)}
      >
        <Text style={styles.dropdownOptionText}>{item}</Text>
      </TouchableOpacity>
    );
    }


    return (
        <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.label}>{text}</Text>
            <View style={styles.dropdownContainer}>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDropdown(!showDropdown)}>
                    <Input
                        value={state}
                        onChangeText={(text) => setState(text)}
                        placeholder={text}
                        editable={false}
                        style={styles.dropdownButtonText}
                    />
                </TouchableOpacity>
                
                {showDropdown && (
                    <View style={styles.dropdownOptionsContainer}>
          <FlatList
            data={dropdownOptionsArray}
            renderItem={renderOptions}
            keyExtractor={(option) => option}
          />
                    </View>
                )}
            </View>
            {(error || !state) && <Text style={commonStyles.errorText}>{errorMessages}</Text>}
        </View>
    )
}


const styles = StyleSheet.create({
    dropdownContainer: {
        position: 'relative',
        zIndex: 1000,
    },
    dropdownButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dropdownOptionsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginTop: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1001,
    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'white',
        position: 'relative',
        zIndex: 1002,
    },
    dropdownOptionText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default DropdownButton;  