"use client";

import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SendMessageForm from '@/components/SendMessageForm';
import { PhoneCall, CheckCircle, FileText, MoreVertical, User } from 'lucide-react';
import { supabase } from '@/utils/supabase/supabase';
import { useSelectedContact } from '@/lib/SelectedContactContext';

type Message = {
  id: number;
  contact_id: string;
  text: string;
  isOwn: boolean;
  time: number;
  display_time: string;
};

const TextMessagingArea = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedContact } = useSelectedContact();

  useEffect(() => {
    if (!selectedContact) {
      setMessages([]); // Clear messages if no contact is selected
      return;
    }

    const fetchMessagesForContact = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('contact_id', selectedContact.id) // Filter messages for the selected contact
        .order('time', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data);
    };

    fetchMessagesForContact();
  }, [selectedContact]);

  return (
    <div className="flex flex-col border-r border-l w-[50%] border-gray-300">
      <div className="p-3.5 border-b border-gray-200 bg-white flex items-center justify-between">
        {/* Recipient info with profile picture */}
        <div className="flex items-center space-x-3">
        <div className="rounded-full bg-gray-300 p-2">
            <User className="w-6 h-6 text-gray-600" />
        </div>
        <div className="text-sm font-bold">
              {selectedContact ? selectedContact.sender : ""}
        </div>
        </div>
        {/* Rightmost icons */}
        <div className="flex items-center space-x-4">
        <PhoneCall className="w-5 h-5 text-gray-600 cursor-pointer" />
        <CheckCircle className="w-5 h-5 text-gray-600 cursor-pointer" />
        <FileText className="w-5 h-5 text-gray-600 cursor-pointer" />
        <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
        </div>

      {/* Messages display area */}
      <ScrollArea className="flex-grow ">
      {selectedContact ? (
        <div className="p-4">
          {messages.map((message, index, array) => (
            <React.Fragment key={message.id}>
              {/* Timestamp */}
              {index === 0 || message.time !== array[index - 1].time ? (
                <div className="text-center text-xs text-gray-500 my-2">
                  {message.display_time}
                </div>
              ) : null}
              {/* Message bubble */}
              {/* Message bubble */}
                <div className={`flex items-end text-xs ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                {!message.isOwn && (
                  <div className="flex items-center mr-2">
                    <div className="rounded-full bg-gray-300 p-1">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                )}
                <div
                  className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'} mb-4`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg ${message.isOwn ? 'bg-blue-100 w-auto max-w-full' : 'bg-gray-300'} max-w-[34%] break-words`}
                  >
                    <div>{message.text}</div>
                  </div>
                </div>
                </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-80 h-full">
        <span>No contact selected</span>
      </div>
      )}
      </ScrollArea>

      {/* Message input area */}
      <SendMessageForm />
    </div>
  );
};

export default TextMessagingArea;









