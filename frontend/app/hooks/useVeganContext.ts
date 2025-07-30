import { useState } from "react";

const FIELD_INPUT_ERROR_MESSAGES = {
    vegan: 'please select a Vegan option',
}
const useVeganContext = () => {
    const [vegan, setVegan] = useState<string|undefined>(undefined);
    const [showVeganDropDown, setShowVeganDropDown] = useState(false);
    const [veganError, setVeganError] = useState(true); // boolean: true = has error
    const veganDropDownOptionsArray = ['Yes', 'No'];

    const handleDropdownOptionSelection = (option: string) => {
        setVegan(option);
        setVeganError(false); // no error when option is selected
        setShowVeganDropDown(false);
    }

    const isVeganValid = () => {
        return !veganError; // valid when no error
    }

    return {
        vegan,
        veganError, // boolean
        veganErrorMessages: FIELD_INPUT_ERROR_MESSAGES.vegan,
        setVegan,
        showVeganDropDown,
        setShowVeganDropDown,
        handleDropdownOptionSelection,
        veganDropDownOptionsArray,
        isVeganValid
    }
}


export default useVeganContext;