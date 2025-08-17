import { useState } from "react";

const GUEST_ID_ERROR_MESSAGES = {
    guestId: 'Guest ID must be 24 characters long',
}

const useGuestIdContext = () => {

    const [guestId, setGuestId] = useState('');
    const [guestIdError, setGuestIdError] = useState(GUEST_ID_ERROR_MESSAGES.guestId);

    const validateGuestId = (guestId: string) => {
        if (guestId.length !== 24) {
            setGuestIdError(GUEST_ID_ERROR_MESSAGES.guestId);
        } else {
            setGuestIdError('');
        }
    }
    const handleGuestIdChange = (newGuestId: string) => {
        setGuestId(newGuestId);
        validateGuestId(newGuestId);
    }

    const isValidGuestId = ()=>{
        return guestId.length === 24 && guestIdError === '';
    }

    const clearGuestId = () => {
        setGuestId('');
        setGuestIdError(GUEST_ID_ERROR_MESSAGES.guestId);
    }

    return {
        guestId,
        guestIdError,
        handleGuestIdChange,
        isValidGuestId,
        clearGuestId
    };
}

export default useGuestIdContext; 