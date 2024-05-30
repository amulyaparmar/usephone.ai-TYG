import React, { createContext, useContext, useState, ReactNode } from 'react';

type Contact = {
  id: number;
  sender: string;
  preview: string;
  date: string;
  unread: boolean;
};

// Define the shape of your context data
type SelectedContactContextType = {
  selectedContact: Contact | null; // Allow for null or Message type
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>; // Allow for null or Message type
};

// Provide default values for the context
const defaultContextValue: SelectedContactContextType = {
  selectedContact: null,
  setSelectedContact: () => {}, // Provide a no-op function as default
};

// Create the context with default value
const SelectedContactContext = createContext<SelectedContactContextType>(defaultContextValue);

export const useSelectedContact = () => useContext(SelectedContactContext);

interface SelectedContactProviderProps {
  children: ReactNode; // Define children prop type explicitly
}

export const SelectedContactProvider: React.FC<SelectedContactProviderProps> = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <SelectedContactContext.Provider value={{ selectedContact, setSelectedContact }}>
      {children}
    </SelectedContactContext.Provider>
  );
};
