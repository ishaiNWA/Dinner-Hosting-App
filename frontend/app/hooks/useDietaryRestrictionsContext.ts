import { useState } from "react";
import { DIETARY_RESTRICTIONS, DietaryRestrictionType } from "@/constants/dietaryRestrictions";

const DIETARY_RESTRICTIONS_ERROR_MESSAGES = {
    dietaryRestrictions: 'Select a dietary restriction or none if none apply',
}



const useDietaryRestrictionsContext = () => {
    const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<Set<DietaryRestrictionType | "" >>(new Set());
    const [dietaryRestrictionsError, setDietaryRestrictionsError] = useState(DIETARY_RESTRICTIONS_ERROR_MESSAGES.dietaryRestrictions);
    const [isShowOptions, setIsShowOptions] = useState(false);
    
    const clearForm = () => {
        setSelectedDietaryRestrictions(new Set());
        setDietaryRestrictionsError(DIETARY_RESTRICTIONS_ERROR_MESSAGES.dietaryRestrictions);
        setIsShowOptions(false);
    }

    const handleToggleRestrictionSelection = (restriction: DietaryRestrictionType) => {

        let newRestrictions;
            // toggle OFF option
        if(selectedDietaryRestrictions.has(restriction)){
            newRestrictions = new Set(selectedDietaryRestrictions);
            newRestrictions.delete(restriction);
            
            //toggle ON option
        }else{  
            if(selectedDietaryRestrictions.has("none")){
                 newRestrictions = new Set(selectedDietaryRestrictions);
                newRestrictions.delete("none");
                newRestrictions.add(restriction);
            }else{
                 newRestrictions =  ("none" === restriction)? new Set<DietaryRestrictionType | "">(["none"]) 
                : new Set([...selectedDietaryRestrictions, restriction])
            }
        
        }
        setSelectedDietaryRestrictions(newRestrictions);
        
        if(newRestrictions.size === 0){
            setDietaryRestrictionsError(DIETARY_RESTRICTIONS_ERROR_MESSAGES.dietaryRestrictions)
        }else{
            setDietaryRestrictionsError("");
        }
    }

    const handleToggleShowOptions = () => {
        setIsShowOptions((prev) => !prev);
    }

    const isValidDietaryRestrictions = () => {
        return selectedDietaryRestrictions.size > 0 && dietaryRestrictionsError === '';
    }

    return {
        selectedDietaryRestrictions,
        dietaryRestrictionsError,
        handleToggleRestrictionSelection,
        isValidDietaryRestrictions,
        DIETARY_RESTRICTIONS,
        isShowOptions,
        handleToggleShowOptions,
        clearForm
    };
}

export default useDietaryRestrictionsContext; 