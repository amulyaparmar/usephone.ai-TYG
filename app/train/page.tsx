"use client";
// app/page.tsx

import NavigationBar from "@/components/NavigationBar";
import { SelectedContactProvider } from "@/lib/SelectedContactContext";
import "@/app/globals.css";
import AiTrainer from "@/components/AiTrainer";

const DashboardPage = () => {
  return (
    <SelectedContactProvider>
      <div className="flex h-screen w-screen">
        <NavigationBar />
        <AiTrainer />
        {/* <TextMessagingArea /> */}
        {/* <ContactBar /> */}
      </div>
    </SelectedContactProvider>
  );
};

export default DashboardPage;
