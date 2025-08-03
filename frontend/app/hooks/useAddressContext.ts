import { searchForAddress } from "@/services/addressService";
import { getUserAddress } from "@/services/users";
import { StandardAddress } from "@/types/address";
import { useEffect, useState } from "react";

const FIELD_INPUT_ERROR_MESSAGES = {
    address: 'please select an address from the suggestions',
}

const useAddressContext = () => {

    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState(FIELD_INPUT_ERROR_MESSAGES.address);
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState<StandardAddress[]>([]);
    const [selectedAddressSuggestion, setSelectedAddressSuggestion] = useState('');
    const [userHomeAddress , setUserHomeAddress] = useState<string | undefined>(undefined);


    const getUserHomeAddress = async () => {
        try{
            const response = await getUserAddress();

            console.log("ADDRESS CONTEXT USER HOME ADDRESS RESPONSE: ", response);
            if(response.length > 3){
            setUserHomeAddress(response);
            setAddress(response);
            setAddressError('');
            }
        }catch(error){
            console.log(`error while trying to get users home address ${error}`)
        }   
    }

    useEffect(() => {
        getUserHomeAddress();
    }, []); // Empty dependency array = run only once on mount


  const handleSelectAddressSuggestion = (address: string) =>{
    setShowAddressSuggestions(false);
    setSelectedAddressSuggestion(address);
    setAddress(address);
    setAddressError('');
  }

  const invalidateHomeAddressState = () => {
    setUserHomeAddress('');
  }

    const handleAddressChange = (address: string) => {
        invalidateHomeAddressState();
       setAddress(address);
       setAddressError(FIELD_INPUT_ERROR_MESSAGES.address);
  
    }
  
    useEffect(() => {
      let searchAddressTimeoutId: any;
      if(address.length >= 3 && address !== selectedAddressSuggestion){  
      searchAddressTimeoutId = setTimeout(async function fetchAddressSuggestions() {
  
          const suggestionsArray = await searchForAddress(address);
          setAddressSuggestions(suggestionsArray);
          setShowAddressSuggestions(true);
        }, 500);// 500ms debounce delay
  
      }else{
        setShowAddressSuggestions(false);
      }
      return () => clearTimeout(searchAddressTimeoutId);
    }, [address]);
  

    const isAddressValid = () => {
        return address !== '' && addressError === '' && selectedAddressSuggestion === address;
    }

    const clearAddress = () => {
        setAddress('');
        setAddressError(FIELD_INPUT_ERROR_MESSAGES.address);
        setShowAddressSuggestions(false);
        setAddressSuggestions([]);
        setSelectedAddressSuggestion('');
    }

    return {
        address,
        addressError,
        userHomeAddress,
        showAddressSuggestions,
        addressSuggestions,
        selectedAddressSuggestion,
        handleSelectAddressSuggestion,
        handleAddressChange,
        isAddressValid,
        clearAddress
    }
}
export default useAddressContext;