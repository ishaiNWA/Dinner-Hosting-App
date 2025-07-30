import { useState } from "react";

const useNotesContext = ()=>{
    const [notes, setNotes] = useState('');
    const [notesError , setNotesError] = useState('');

    const handleNoteChange = (newNotes: string) => {
        setNotes(newNotes);

        if (notes.length > 500) {
            setNotesError("Notes must be 500 characters or less");
          }else{
            setNotesError('');
          }
    }

    const isValidNotes = ()=>{
       return notesError === '';
    }

    return {
        notes,
        notesError,
        handleNoteChange,
        isValidNotes
    }
}

export default useNotesContext;