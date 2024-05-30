"use client";

import React, { FormEvent, useState } from 'react';
import { AtSign, Smile, Send } from 'lucide-react';
import { toast } from 'sonner';

const NotesInput = () => {
  const [note, setNote] = useState('');

  const handleNoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the submission of the note
    console.log(note);
    setNote(''); // Clear the note input after submit
    toast("Note has been saved", {
      description: "note",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
  };

  return (
    <form
      onSubmit={handleNoteSubmit}
      className="relative bg-white py-0 px-0 flex items-center "
    >
      <div className="flex-grow flex flex-col justify-between border rounded">
        <input
          type="text"
          placeholder="Write a note..."
          className="outline-none border-none p-4 text-sm"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex justify-between items-center px-3">
          <div className="flex space-x-1 py-3">
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <AtSign size={16} />
            </button>
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Smile size={16}/>
            </button> 
            
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Send size={16}/>
            </button>
          </div>
        </div>
      </div>
    </form>
)};

export default NotesInput;
