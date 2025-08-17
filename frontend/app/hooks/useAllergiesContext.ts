import { useState } from "react";
import { useForm } from "react-hook-form";

const ALLERGIES_ERROR_MESSAGE = "Please describe your allergies Or select `None`.";

const useAllergiesContext = () => {
    
    const [allergies, setAllergies] = useState<string>("");
    const [allergiesError, setAllergiesError] = useState<string>(ALLERGIES_ERROR_MESSAGE);
    const [isNoneSelected , setIsNoneSelected] = useState<boolean>(false);

    const toggleNoneSelection = ()=>{
        setIsNoneSelected(!isNoneSelected);
        if(isNoneSelected){
            handleAllergiesChange("NONE");
        }else{
            handleAllergiesChange("");
        }

    }

    const handleAllergiesChange = (text: string) => {
        setAllergies(text);

        if(allergies.length > 0){
            setAllergiesError("");
        }else{
            setAllergiesError(ALLERGIES_ERROR_MESSAGE);
        }
    }

    const isValidAllergies = () => {
        return allergies.length > 0 && allergiesError === "";
    }


    return {
        allergies,
        allergiesError,
        isNoneSelected,
        toggleNoneSelection,
        handleAllergiesChange,
        isValidAllergies
    };
}

export default useAllergiesContext; 