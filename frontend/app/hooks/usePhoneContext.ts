import { useState } from "react";




const usePhoneContext = () => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const validateIsraeliPhone = (phone: string) => {
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');
        
        // Must be exactly 10 digits starting with 05
        const israeliPhoneRegex = /^05\d{8}$/;
        return israeliPhoneRegex.test(digits);
      };
    
      const handlePhoneChange = (text: string) => {
        setPhoneNumber(text);
        
        // Real-time validation
        if (text.length > 0) {
          if (!validateIsraeliPhone(text)) {
            setPhoneError('Invalid format. Use: 05X-XXXXXXX');
          } else {
            setPhoneError(''); // Clear error when valid
          }
        } else {
          setPhoneError(''); // Clear error when empty
        }
      };

      const isValidPhone = () => {
        return phoneNumber !== '' && phoneError === '';
      };

      return {
        phoneNumber,
        phoneError,
        handlePhoneChange,
        isValidPhone
    }
}

export default usePhoneContext;