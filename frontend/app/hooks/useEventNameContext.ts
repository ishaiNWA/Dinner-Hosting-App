import { useState } from "react";

const FIELD_INPUT_ERROR_MESSAGES = {
    newEventName: 'must input an event name with 3 to 25 characters',
  }

const useEventNameContext = ()=>{
    const [newEventName, setNewEventName] = useState('');
    const [newEventNameError, setNewEventNameError] = useState('');

    const handleNewEventNameChange = (text: string)=>{
        setNewEventName(text);
        if(text.length < 3 || text.length > 25){
            setNewEventNameError(FIELD_INPUT_ERROR_MESSAGES.newEventName);
        }else{
            setNewEventNameError('');
        }
    }

    const isEventNameValid = ()=>{
        return (newEventName !== '' && newEventNameError === '');
    }

        return {newEventName, setNewEventName, newEventNameError, setNewEventNameError, handleNewEventNameChange, isEventNameValid};
}

export default useEventNameContext;