import { useState } from "react";

const FIELD_INPUT_ERROR_MESSAGES = {
    kosher: 'please select a Kosher option',
}
const useKosherContext = () => {
    
    const [kosher, setKosher] = useState<string|undefined>(undefined);
    const[ kosherError, setKosherError] = useState(true); // boolean: true = has error
    const[showKosherDropDown , setShowKosherDropDown] = useState(false);

    const kosherDropDownOptionsArray = ['Yes', 'No'];

    const handleDropdownOptionSelection = (option: string) => {
        setKosher(option);
        setKosherError(false); // no error when option is selected
        setShowKosherDropDown(false);
    }
  

    const isKosherValid = () => {
        return !kosherError; // valid when no error
    }

    const clearKosher = () => {
        setKosher(undefined);
        setKosherError(true); // Reset to initial error state
        setShowKosherDropDown(false);
    }

    return {
        kosher,
        kosherError, // boolean
        kosherErrorMessages: FIELD_INPUT_ERROR_MESSAGES.kosher,
        setKosher,
        showKosherDropDown,
        setShowKosherDropDown,
        handleDropdownOptionSelection,
        kosherDropDownOptionsArray,
        isKosherValid,
        clearKosher
    }
}

export default useKosherContext;