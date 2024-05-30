"use client";

import React from 'react';
import { PhoneCall, MessageCircle, Building, Briefcase, MapPin, Lock, Plus, Send, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import NotesInput from '@/components/NotesInput';
import { Button } from './ui/button';

const ContactBar = () => {
  // Static sample data for the contact bar.
  const contact = {
    name: 'Add a name...',
    phone: '(517) 305-2709',
    company: 'Set a company',
    role: 'Set a role',
    address: 'Set an address...',
    access: 'Everyone',
    notes: '',
  };

  return (
    <div className="w-1/5 flex-shrink-0 bg-white p-4 border-r-2 border-blue-500">
      <div className="mb-4 flex flex-col items-center border-b">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-2">
          {/* Profile Icon */}
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-500">{contact.name}</h3>
          <Separator className="my-2" />
          <div className="flex items-center justify-center space-x-3">
            <Button color= "transparent"
              className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
            > 
              <PhoneCall className="text-gray-600" />
            </Button>
            <Button color= "transparent"
              className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
            > 
              <MessageCircle className="text-gray-600" />
            </Button>
          </div>
        </div>
        <Separator className="my-2" />
      </div>
      <div className="px-4 space-y-3">
        <div className="flex items-center">
          <Building className="w-5 text-gray-500 mr-2" />
          <span className="text-xs text-gray-500">{"Company"}</span>
          <span className="px-5 text-xs text-gray-500">{contact.company}</span>
        </div>
        <div className="flex items-center">
          <Briefcase className="w-5 text-gray-500 mr-2" />
          <span className="text-xs text-gray-500">{"Role"}</span>
          <span className="px-12 text-xs text-gray-500">{contact.role}</span>
        </div>
        <div className="flex items-center">
          <PhoneCall className=" w-5 text-gray-600 mr-2" />
          <span className="text-xs text-gray-500">{"Phone"}</span>
          <span className="px-9 text-xs text-black-800">{contact.phone}</span>
        </div>
        <div className="flex items-center">
          <MapPin className=" w-5 text-gray-600 mr-2" />
          <span className="text-xs text-gray-500">{"Address"}</span>
          <span className="px-6 text-xs text-gray-500"> {contact.address}</span>
        </div>
        <div className="flex items-center">
          <Lock className=" w-5 text-gray-600 mr-2" />
          <span className="text-xs text-gray-500">{"Access"}</span>
          <span className="px-7 text-xs text-gray-800">{contact.access}</span>
          {/* Placeholder for accordion */}
        </div>
        <button className="flex items-center text-purple-500">
          <Plus className="w-5 mr-2"/>
          <span className="text-xs text-purple-500"> {"Add a property"}</span>
        </button>
      </div>
      <Separator className="my-6" />
      <span className=" px-2 text-xs text-gray-500" > {"Notes 0"} </span>
      <Separator className="my-1" />
      <NotesInput/>
    </div>
  );
};

export default ContactBar;
