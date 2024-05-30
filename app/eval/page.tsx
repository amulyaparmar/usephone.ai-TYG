"use client";
// app/page.tsx

import NavigationBar from "@/components/NavigationBar";
import { SelectedContactProvider } from "@/lib/SelectedContactContext";
import "@/app/globals.css";
import AiEval from "@/components/AiEval";

const DashboardPage = () => {
  return (
    <SelectedContactProvider>
      <div className="flex h-screen w-screen">
        <NavigationBar />
        <AiEval />
        {/* <TextMessagingArea /> */}
        {/* <ContactBar /> */}
      </div>
    </SelectedContactProvider>
  );
};

export default DashboardPage;
