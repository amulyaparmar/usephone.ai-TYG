"use client";
// app/page.tsx

import NavigationBar from "@/components/NavigationBar";
import MessagesList from "@/components/MessagesList";
import TextMessagingArea from "@/components/TextMessagingArea";
import { SelectedContactProvider } from "@/lib/SelectedContactContext";
import ContactBar from "@/components/ContactBar";
import "@/app/globals.css";
import LandingPage from "@/components/LandingTYG";

const DashboardPage = () => {
  return (
    <SelectedContactProvider>
      <div className="flex h-screen w-screen">
        <NavigationBar />
        {/* <MessagesList /> */}
        <LandingPage />
        {/* <TextMessagingArea /> */}
        {/* <ContactBar /> */}
      </div>
    </SelectedContactProvider>
  );
};

export default DashboardPage;
