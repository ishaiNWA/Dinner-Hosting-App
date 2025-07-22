import { searchForAddress } from "@/services/addressService";
import { StandardAddress } from "@/types/address";
import { useEffect, useState } from "react";



const useAddressContext = () => {

    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState<StandardAddress[]>([]);
    const [selectedAddressSuggestion, setSelectedAddressSuggestion] = useState('');



  const handleSelctedAddressSuggestionChange = (address: string) =>{
    setShowAddressSuggestions(false);
    setSelectedAddressSuggestion(address);
    handleAddressChange(address)
  }
    
    const handleAddressChange = (address: string) => {
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
        showAddressSuggestions,
        addressSuggestions,
        selectedAddressSuggestion,
        handleSelctedAddressSuggestionChange,
        handleAddressChange,
        isAddressValid
    }
}
export default useAddressContext;