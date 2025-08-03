


  
import { getTimeWeekFromNow } from "@/services/utils";
import { useState } from "react";
import { Platform } from "react-native";

const INVALID_DATE_PLACEHOLDER = new Date()

const FIELD_INPUT_ERROR_MESSAGES = {
    newEventDate: 'please select an event date at least one week from now',
    existingEventDate: 'this date is already taken - please select a different date'
}

const useDateContext = (existingEventDates: string[])=>{


    const [newEventDate, setNewEventDate] = useState<Date>(INVALID_DATE_PLACEHOLDER);
    const [newEventDateError, setNewEventDateError] = useState(FIELD_INPUT_ERROR_MESSAGES.newEventDate);
    const [showMobileDatePicker, setShowMobileDatePicker] = useState(false);


    const handleNewEventDateChange = (event: any, selectedDate?: Date | undefined)=>{
        if(selectedDate && selectedDate < getTimeWeekFromNow()){
          setNewEventDateError(FIELD_INPUT_ERROR_MESSAGES.newEventDate);
        }else if(existingEventDates.includes(selectedDate?.toISOString() || '')){
          setNewEventDateError(FIELD_INPUT_ERROR_MESSAGES.existingEventDate);
        }else{
          setNewEventDateError('');
        }
        if(selectedDate){
          setNewEventDate(selectedDate);
        }
        if(Platform.OS !== 'web'){
          setShowMobileDatePicker(false);
        }
      }

      const isDateValid = ()=>{
        return (newEventDate !== INVALID_DATE_PLACEHOLDER && newEventDateError === '');
      }

      const clearDate = ()=>{
        setNewEventDate(INVALID_DATE_PLACEHOLDER);
        setNewEventDateError(FIELD_INPUT_ERROR_MESSAGES.newEventDate);
        setShowMobileDatePicker(false);
      }

      return {newEventDate, setNewEventDate, newEventDateError, setNewEventDateError, showMobileDatePicker, setShowMobileDatePicker, handleNewEventDateChange, isDateValid, clearDate};
}

export default useDateContext;