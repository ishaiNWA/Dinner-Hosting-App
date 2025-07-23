import { searchForAddress } from "@/services/addressService";
import { getUserAddress } from "@/services/users";
import { StandardAddress } from "@/types/address";
import { useEffect, useState } from "react";



const useAddressContext = () => {

    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
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
            }
        }catch(error){
            console.log(`error while trying to get users home address ${error}`)
        }   
    }

    useEffect(() => {
        getUserHomeAddress();
    }, []); // Empty dependency array = run only once on mount


  const handleSelctedAddressSuggestionChange = (address: string) =>{
    setShowAddressSuggestions(false);
    setSelectedAddressSuggestion(address);
    handleAddressChange(address)
  }

  const invalidateHomeAddressState = () => {
    setUserHomeAddress('');
  }

    const handleAddressChange = (address: string) => {
        invalidateHomeAddressState();
       setAddress(address);
  
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

    return {
        address,
        addressError,
        userHomeAddress,
        showAddressSuggestions,
        addressSuggestions,
        selectedAddressSuggestion,
        handleSelctedAddressSuggestionChange,
        handleAddressChange,
        isAddressValid
    }
}
export default useAddressContext;