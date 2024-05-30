import React, { useState, FormEvent } from 'react';
import { Paperclip, Send, Clock, Smile, Hash, Sparkle } from 'lucide-react';
import { toast } from 'sonner';


const SendMessageForm = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic to send message
    console.log(message);
    setMessage(''); // Clear the input after sending
    toast("Message has been sent", {
      description: message,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="relative bg-white py-5 px-11 flex items-center "
    >
      <div className="flex-grow flex flex-col justify-between border rounded">
        <input
          type="text"
          placeholder="Write a message..."
          className="outline-none border-none p-4 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-between items-center px-3">
          <div className="flex space-x-1">
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Sparkle size={16} color='purple'/>
            </button>
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Hash size={16}/>
            </button>
            <button
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Paperclip size={16}/>
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
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Clock size={16}/>
            </button>
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
  );
};

export default SendMessageForm;
