// components/NavigationBar.tsx
import {
    Settings,
    User,
    Search,
    Activity,
    BarChart2,
    Info,
    Inbox,
    Heart,
    PlusCircle,
    Users,
    Gift,
    MapPin,
    ShoppingBag,
    Book,
    SearchCheck,
    GraduationCap,
    AudioLines,
    Play,
    BarChart,
    Home,
    Star,
  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useContactStore, useMarketListPopup, usePopup } from '@/utils/store/conversationStore';
import { useRouter, usePathname } from "next/navigation";
import AiRubricPopup from './popups/AiRubricPopup';
import CallStatsPopup from './popups/CallStatsPopup';


  const NavigationBar = () => {
    const {setShowMarketList} = useMarketListPopup();
    const {popup, setPopup} = usePopup();

    const { fromCallerId, setFromCallerId } = useContactStore();
    // Updated to match the provided image
    const navItems = [
      // { id: 'search', icon: <Search />,  action: () => {
      //   console.log("MarketsTYG clicked");
      //   setShowMarketList(true);
      // }, label: 'Search' },
      // { id: 'marketsTYG', icon: <MapPin />, action: () => {
      //   console.log("MarketsTYG clicked");
      //   setShowMarketList(true);
      // }, label: 'Markets' },
      // { id: 'contacts', icon: <User />, label: 'Contacts' },
      // { id: 'analytics', icon: <BarChart2 />, label: 'Analytics' },
      // { id: 'settings', icon: <Settings />, label: 'Settings' },
    ];
  
    // Add Inboxes and team member sections as separate arrays
    const inboxItems = [
      { id: 'home', url: "/", icon:  <Home />, label: 'Home', sublabel: "+17604630314", notifications: 0 },
      { id: 'call', url: "/call", icon:  <AudioLines />, label: 'AI Call Recordings & Mystery Shops', sublabel: "+17604630314", notifications: 0 },
      { id: 'support', url: "/train", icon: <GraduationCap />, label: 'AI Sales Trainer', sublabel: "+17733096894", notifications: 0 },
      { id: 'eval', url: "/eval" , icon:  <SearchCheck />, label: 'AI Scorecard', sublabel: "+17604630315", notifications: 5 },
    ];
   	

  
    const teamMembers = [
      // Add team member objects here
      { id: 'ai-rubric', name: 'Phone Shop Rubric', icon: <Book /> },
      { id: 'webinar', name: 'Live Train Webinar', icon: <Play />},
      { id: 'stats', name: 'Live Call Stats by Outerbase', icon: <BarChart />},
      // More team members...
    ];

    const router = useRouter();
    const currentPath = usePathname();


  
    return (
      <nav className="flex flex-col h-full border-r border-gray-300 ">
     
      </nav>
    );
  };
  
  export default NavigationBar;
  