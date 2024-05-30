// components/MessagesList.tsx
// @ts-nocheck
import {
  Contact,
} from "lucide-react";
import { supabase } from "@/utils/supabase/supabase";

import React, { useEffect, useState } from "react";
import { useSelectedContact } from "@/lib/SelectedContactContext";
import Phone from "./Phone";
import {
  useContactStore,
  useVapiStore,
} from "@/utils/store/conversationStore";
import Markdown from 'markdown-to-jsx';
import EmailVerification from "./EmailVerfication";
import { handleCallUpdates } from "@/utils/twilio/utils";
import { toast } from "sonner";
import Vapi from '@vapi-ai/web';
import { VapiButtonTYG } from "./Vapi";
import { uuid } from "uuidv4";
import { select } from "@material-tailwind/react";


type Contact = {
  id: number;
  sender: string;
  preview: string;
  date: string;
  unread: boolean;
};


// Function to format keyword into a title
const formatTitle = (keyword) => {
  return keyword
    .split('_')  // Split the string by underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
    .join(' ');  // Join the words with spaces
};

// Function to truncate text to 20 characters
const truncateText = (text) => {
  return text.length > 20 ? text.substring(0, 50) + "..." : text;
};


const PreviewCard = ({ keyword, score, comment, onClick=()=>{} }) => {
  // if comment is json , convert keys and values into one big string
  if (typeof comment === 'object') {
    // object entries into one string
    // use Object.entries to get an array of key-value pairs
    // use map to convert each key-value pair into a string
    // use join to concatenate all strings into one big string
    comment = Object.entries(comment)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' ');
  }

  return (
    <div className="relative cursor-pointer bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
      onClick={onClick}
    >
      <h2 className="text-lg font-semibold text-gray-900">{formatTitle(keyword)} (Score: {score})</h2>
      <p className="text-gray-700 overflow-hidden relative">
        {truncateText(comment)}
        <span className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></span>
      </p>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent rounded-lg  to-white opacity-0 transition-opacity duration-300 hover:opacity-50 hover:from-blue-500 hover:to-transparent"></div>
    </div>
  );
};


const AiTrainer = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { fromCallerId, setCallerId, phoneNumber, setPhoneNumber, setMarketKey, powerDialNumbers, setPowerDialNumbers } = useContactStore();

  const { setSelectedContact } = useSelectedContact();


const agentButtons = [
  { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/7ac376db-a5ca-49d8-2253-3e60a7e40b00/public', alt: 'Image 1', voice: 'aGkVQvWUZi16EH8aZJvT' , name: 'Steve'}, // steve australian
  { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/c446b5a0-12a3-4862-8fe3-0ae619609c00/public', alt: 'Image 2', voice: 'QrRJx7pPvPGFVMtAx4IR' , name: 'Amelia' }, // freya
  { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/3b7cedaf-d9f1-4844-83a1-4ab7f5537200/public', alt: 'Image 3', voice: 'xZCYzAJ7kV10muof1vQJ' , name: 'Josh' }, // josh 
  { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/0cb2f044-13e0-40ba-1c70-fdecefab9000/public', alt: 'Image 4', voice: 'aQDFfzgOthQyfLprlvkY' , name: 'Joanne' },  // joanne
  { src: "https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/1784c61e-69af-463b-41ed-1372f04f2400/400pxHeight", alt: 'Image 5',  voice: '3gsg3cxXyFLcGIfNbM6C' , name: 'Raju' }, // raju indian
  { src: "https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/1f2b5d73-4b95-4c76-7500-66cb510d4500/400pxHeight", alt: 'Image 6', voice: 'FQygEXXdVfjOosF7jzJ7', name: 'Veda' } // veda indian
];


const callFocus = {
  'Basic Intro': `
    give a basic intro and ask any common questions one would ask when looking to lease
   `,
  'Pricing/Objection Handling': `
1. **How does the rent compare to similar properties in this area?**
   - Justifies the cost based on location, amenities, and any additional services offered, highlighting the value proposition.
2. **What is included in the rent?**
   - Helps assess the total value by knowing what utilities (water, electricity, gas, internet) and services (parking, gym access, maintenance) are included or excluded from the rent.
3. **Can you explain the fees for additional services like parking and pets?**
   - For budget planning and understanding all potential costs. Details on fees, deposits, and any restrictions related to parking, pet ownership, or other amenities.
4. **What makes your apartments a better choice over others in the same price range?**
   - Highlights unique selling points such as upgraded appliances, modern design, proximity to public transportation, or community amenities like swimming pools, co-working spaces, or pet parks.
  `,
  'Experience Driving/Value Testing': `
1. **What amenities are available to residents?**
   - Gives insight into the lifestyle promoted by the property. Details on amenities like fitness centers, swimming pools, communal spaces, pet-friendly features, or on-site services (laundry, dry cleaning, concierge).
2. **Are there community events or activities?**
   - Helps gauge the community environment among residents. Information on social events, classes, or gatherings organized by the leasing office fosters a sense of belonging and community engagement.
3. **How do you handle maintenance and repair requests?**
   - Efficient maintenance can enhance the living experience. Procedures for submitting maintenance requests, response times, and emergency maintenance protocols reassure renters about prompt assistance and property upkeep.
4. **What are the safety features and protocols in place at the property?**
   - Safety is a primary concern for many renters. Details on security measures, surveillance systems, controlled access, and emergency preparedness reassure renters about their well-being and peace of mind.
  `,
  'Lead Capture Test': `
1. **Would you like to schedule a virtual tour to see the apartment and amenities?**
   - Invites potential renters to experience the property remotely. Offerings virtual tours via video calls or pre-recorded videos allow renters to explore the property from the comfort of their homes, convenient for long-distance or busy renters.
2. **Can I schedule a time for you to join a live virtual walkthrough with one of our leasing agents?**
   - Adds a personal touch and real-time interaction. Live virtual walkthroughs with leasing agents offer personalized guidance, address specific questions, and build rapport with potential renters.
3. **Can I get your contact information to keep you updated on our latest units and offers?**
   - Captures leads by obtaining contact details. Collecting names, phone numbers, and email addresses enables follow-up communication, updates on available units, and promotions tailored to individual preferences.
4. **Are you interested in receiving more detailed information about our community via email?**
   - Keeps potential renters engaged and informed. Offering to send brochures, floor plans, neighborhood guides, or testimonials via email provides additional information for renters to consider and revisit.
  `,
};
function getRandomKey(obj) {
  const keys = Object.keys(obj);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];
  return randomKey;
}

  const [activeCallSid, setActiveCallSid] = useState("");
  const [selectedAgent, setSelectedAgent] =  useState(() => {
    const randomIndex = Math.floor(Math.random() * agentButtons.length);
    return agentButtons[randomIndex];
  });
  const [selectedFocus, setSelectedFocus] = useState(
    getRandomKey(callFocus)
  );


  const [markdownContent, setMarkdownContent] = useState('');
  const [markdownContentKey, setMarkdownContentKey] = useState('');

  const [mysteryShopName, setMysteryShopName] = useState("");
  const [mysteryShopNotes, setMysteryShopNotes] = useState("");

  

  const markdownContentList = {
    'Basic Intro': `
1. **Do you have any 1 bedroom or studio apartments?**
   - Helps potential renters understand the variety of options.
2. **Can you provide details on the size and layout of the apartments?**
   - Renters will want to know about square footage and layout.
3. **What lease terms do you offer?**
   - Important for understanding long-term or short-term housing needs.
4. **Are there any move-in specials or discounts currently available?**
   - Informs about promotions and can be a deciding factor.

    `,
    'Pricing/Objection Handling': `
1. **How does the rent compare to similar properties in this area?**
   - Justifies the cost based on location and amenities.
2. **What is included in the rent?**
   - Helps assess the total value by knowing what utilities and services are included.
3. **Can you explain the fees for additional services like parking and pets?**
   - For budget planning and understanding all potential costs.
4. **What makes your apartments a better choice over others in the same price range?**
   - Highlights unique selling points.

    `,
    'Experience Driving/Value Testing': `
1. **What amenities are available to residents?**
   - Gives insight into the lifestyle promoted by the property.
2. **Are there community events or activities?**
   - Helps gauge the community environment among residents.
3. **How do you handle maintenance and repair requests?**
   - Efficient maintenance can enhance the living experience.
4. **What are the safety features and protocols in place at the property?**
   - Safety is a primary concern for many renters.

    `,
    'Lead Capture Test': `
1. **Would you like to schedule a virtual tour to see the apartment and amenities?**
   - Invites potential renters to experience the property remotely.
2. **Can I schedule a time for you to join a live virtual walkthrough with one of our leasing agents?**
   - Adds a personal touch and real-time interaction.
3. **Can I get your contact information to keep you updated on our latest units and offers?**
   - Captures leads by obtaining contact details.
4. **Are you interested in receiving more detailed information about our community via email?**
   - Keeps potential renters engaged and informed.

    `,
};




const { initObj, setInitObj } = useVapiStore();
const [randomState, setRandomState] = useState(uuid());

function generateVapiJson (agent, content, inputPhoneNumber) { 
  let template =  {
    "assistantId": "9a910528-2101-45b6-a6fe-314a5afcf9a2",
    "assistantOverrides": {
      "voice": {
        "voiceId": selectedAgent?.voice,
        "provider": "11labs",
        "stability": 0.6,
        "similarityBoost": 0.75,
        "useSpeakerBoost": true,
        "optimizeStreamingLatency": 4
      },
      "firstMessageMode": "assistant-waits-for-user",
      "firstMessage": "Hi is this the leasing office?",
      "model": {
        "messages": [
          {
            "role": "assistant",
            "content": `
  
            These examples of some real mystery phone shops:
      
      
      \nSpeaker 0: Thank you for calling. Please wait and a staff member will be with you shortly. This call may be monitored or recorded for quality assurance.\n\nSpeaker 1: Hey. Welcome to the last message. You're from Greystar. How may I help you?\n\nSpeaker 2: Hi there. I was calling to see the prices for your 2 person.\n\nSpeaker 1: Yeah. So currently, we are sold completely out all of our 2 3 bedrooms, so we only do have our 4 bedrooms. So we do have 3 floor plans for that.\n\nSpeaker 2: Okay. So you have the 44 person. And how much does that cost? I guess your most affordable one.\n\nSpeaker 1: So that would be our 4 by 4 flat, which is going for 4.80 base rent.\n\nSpeaker 2: Okay. And you said base rent. Is there anything else that comes on top of that? Like, how much is, like, utilities?\n\nSpeaker 1: So, I wouldn't be able to give you, like, an an exact number for utilities, but I do know that, I do wanna mention that there's a $40 cap on utilities on us, meaning that as a unit, we give $40 off. And then whatever the unit does as that over that, that's what you guys will have to end up paying. And then I know that that's just, water and sewage, and that is always around, like, 11 to $15 from what I've seen on average.\n\nSpeaker 2: Okay. So But\n\nSpeaker 1: I know, like, the most I've seen is, like, electricity, which which would be, like, in the 100. Just you know, and that just depends on how much is actually used amongst the unit.\n\nSpeaker 2: Okay. So you said the electricity is in the 100, like, multiple 100, like, 200, or, like\n\nSpeaker 1: I've not I've just seen I've just seen in the in the 100, like, diff just, yeah, just in the 100.\n\nSpeaker 2: Gotcha. Okay. Alright. So 4.80 plus whatever the utilities would be. Some probably just assume around, like, $100.\n\nSpeaker 1: How about You could put that in there. And the only other reoccurring charges after base rent and utilities is gonna be if you did have, like like I say, you had a pet or you had a car that's 5th oh, the car's $15 monthly. The pet is $25 monthly. And then, you know, if you had our renter's insurance, then that would be, you know, a fine too as a little fee too as well if you have. But those are just, like, charges if.\n\nWhat ifs?\n\nSpeaker 2: Okay. And and how much is that the you said the renter's insurance fine?\n\nSpeaker 1: Yeah. So, renter's insurance, let me go ahead and check that for you really quickly. Okay. So our monthly premium is $14 a month. Okay.\n\nSpeaker 2: $14. So 4.80 plus the 100 plus $14, and then parking is 15 more. Is there any other, like, fees that I would have to think about?\n\nSpeaker 1: To my knowledge, no. That's the only, like, reoccurring things that you'd have to worry about. There's nothing else that'll be charged to your account, to my knowledge.\n\nSpeaker 2: Okay. Okay. Perfect. Well, thank you. I think you answered all my questions.\n\nSpeaker 1: Okay. Definitely. Did you did you wanna go ahead and navigate through the Law Offset City Center website? And you could just do apply now. And like I said, it's it's pretty straightforward if you wanted to fill all that out.\n\nAnd if you did wanna do the 4 by 4, we're also hosting a special you where you'd get your 2nd month free. So you'd get September, and then you'd get your last month free in July.\n\nSpeaker 2: Okay. Well, that's awesome. Okay. Yeah. I'll go ahead, and I'll take a look at the website.\n\nSpeaker 1: Alright. Perfect. You do that, man. And if you have any other questions, you can call back up here. My name is Jordan, man.\n\nOkay?\n\nSpeaker 2: Awesome. Thank you, Jordan.\n\nSpeaker 1: Yes, sir. You have
      
      \nSpeaker 0: This is Hailey. I was just the pleasure of speaking with.\n\nSpeaker 1: Hi. My name is Krista.\n\nSpeaker 0: Hi. What can I help you with?\n\nSpeaker 1: Yeah. I'm just interested in one of your apartments, possibly for your next school year.\n\nSpeaker 0: Yes, ma'am. And would you like to come in for a tour maybe, or what questions did you have?\n\nSpeaker 1: Well, I'm transferring in, so I'm not in the area yet. Still in South Carolina, so I won't be able to come in for a tour.\n\nSpeaker 0: Okay. Got you. Well, were you interested in hearing about some of our prices, or what floor plan were you interested in?\n\nSpeaker 1: Absolutely. The studio or 1 bedroom? The studio or 1 bedroom?\n\nSpeaker 0: Got you. So our 1 bedroom start off at 1700, and the second biggest one bedroom is 17 15, and the largest biggest one bedroom is gonna be 17:30.\n\nSpeaker 1: Okay. Perfect. Do you guys have parking?\n\nSpeaker 0: Yes, ma'am. Our parking is an additional $100 per month.\n\nSpeaker 1: Oh, okay. Is that my own single spot, or is that the tandem spots?\n\nSpeaker 0: So you do get assigned parking, and that's where you'll be parking for the remaining.\n\nSpeaker 1: Okay. Perfect. Also, I have a cat. Am I able to bring in pets?\n\nSpeaker 0: Yes, ma'am. We do we are a pet family. Okay.\n\nSpeaker 1: Perfect. What other questions do I have? Also, my current apartment requires renters insurance. Do you guys require renters insurance, or do you guys provide it?\n\nSpeaker 0: Yes. We do require renters insurance as well.\n\nSpeaker 1: Okay. Perfect. Alright. So parking, renter's insurance, pets. I think that's all I needed to know.\n\nSpeaker 0: Okay. Yes, ma'am. Did you want me to go ahead and put your name in our system? That way, I can send you a link to the application.\n\nSpeaker 1: Sure. That's fine.\n\nSpeaker 0: Okay. Perfect. I just need your first, last name, phone number, and email.\n\nSpeaker 1: Yeah. So my first name is Ashley.\n\nSpeaker 0: Ashley. And that's k. And then your last name? Davis. P a v I s.\n\nAnd then your phone number?\n\nSpeaker 1: 843\n\nSpeaker 0: 843.\n\nSpeaker 1: 412\n\nSpeaker 0: 412. 6520. 6520. And then your email?\n\nSpeaker 1: Yeah. It's a_davis\n\nSpeaker 0: Mhmm.\n\nSpeaker 1: 95@gmail.com.\n\nSpeaker 0: Perfect. I went ahead and got all your information. I will email you all the pricing information as well. You do have any other questions or concerns, just give us a callback, and I'll be more than happy to help you. Okay?\n\nSpeaker 1: Okay. Perfect. And one question. How many, one bedrooms do you guys have left?\n\nSpeaker 0: We have let me double check with you. Give me one second. What's that about? We do have limited availability for the a threes. We only have 2 left, but the rest of them, we are very flexible in which floor that you would like to stay in and everything else because we have much more of those rather than the a 3.\n\nSpeaker 1: Okay. Perfect. Alright. Awesome. That's all I needed.\n\nThank you.\n\nSpeaker 0: You're welcome. Have a good day. Bye.
      
      
      —————
      
      Help me design a prompt for an Ai Agent that pretends to be a lead. I want to be open ended, shorter and more human (less perfect) word choice so they sound more human if that makes sense
      
      You are a lead, it is your responsibility to talk to someone on the leasing office.  Keep on asking that question until you hear a yes? Also dial any sort of numbers on the keypad to ultimately get you in touch with the office / leasing team.
      
      And you are to pretend to ask relevant questions as a lead. Ask the question one at a time. Followup on questions make it feel logical.
      
      Feel free to make up relevant information that might be relevant that a real human student might ask.
      
      If they ask you for your phone number it is 5862588588 and your email is amulya@umich.edu. Be a little hesitant to offer it at first. Make them give you a good reason to share both pieces of information. If they ask you for email or name, say it once and then spell it out the email before @ , ie; P like Peter, A like Alpha etc... but just say the domain (ie: at gmail.com ) and only spell that specific part if requested.
      
      and your name is ${selectedAgent?.name}
      
      
      NO matter what do not transfer the call even if they say
      
      You are a a potential tenant named ${selectedAgent?.name}, engage with the leasing office staff by asking relevant questions about apartment availability, pricing, utilities, parking, pet policies, and renter’s insurance. Your goal is to gather information while maintaining a conversational, human-like tone.
      Here are the key instructions to follow:
      Until they confirm themselves that this is the leasing office, keep asking is this the leasing office?
      After they do confirm, Introduce yourself and state your interest in the apartments.
      Ask about availability and pricing of specific units, followed by questions about additional costs like utilities, parking, pet fees, and renter’s insurance.
      Inquire about any special offers or promotions.
      Follow up logically based on the responses you receive, ensuring a natural flow to the conversation.
      Be hesitant to offer personal information such as your phone number (5862588588) and email (membreno@umich.edu) unless provided a good reason.
      When asked for your email, spell it out before the “@” symbol (e.g., “membreno” as M like Mary, E like Echo, …) unless requested to spell the domain.
      Please take into consideration the extended examples below for tone and flow:
      <example-1>
      Speaker 0: Thank you for calling. Please wait and a staff member will be with you shortly. This call may be monitored or recorded for quality assurance.
      Speaker 1: Hey, welcome to [Leasing Office]. How may I help you?
      Speaker 1 (Mateo): I’m looking to move in for the next school year and looking at the one-bedroom units. What’s the best price you have on those?
      Speaker 1: Sure, we currently have our one-bedroom units starting at $1,700. There are different sizes with the largest at $1,730.
      Speaker 2 (Mateo): Okay. How many are left What about utilities? Are they included in the rent?
      Speaker 1: Utilities are not included. There’s a utility cap of $40, and beyond that, it’s split among tenants. Water and sewage usually run around $11 to $15.
      Speaker 2 (Mateo): Got it. What about parking? Is it available and how much does it cost?
      Speaker 1: Yes, parking is available for an additional $100 per month. You get an assigned spot.
      </example-1>
      <example-2>
      Speaker 0: This is Hailey. How can I assist you?
      Speaker 1: Hi, my name is ${selectedAgent?.name}.
      Speaker 0: Hi Mateo, what can I help you with today?
      Speaker 1 (Mateo): I’m looking to move in for the next school year and looking at the one-bedroom units. What’s the best price you have on those?
      Speaker 0: Sure, our one-bedroom units start off at $1,700. We also have different sizes available.
      Speaker 1 (Mateo): Perfect. Do you have any special offers or promotions currently?
      Speaker 0: Yes, we’re offering the second month free when you sign a lease for one of our one-bedroom units.
      Speaker 1 (Mateo): That sounds great. I have a cat; are pets allowed and is there an additional fee?
      Speaker 0: Yes, we are pet-friendly. There is a pet fee of $25 monthly.
      Speaker 1 (Mateo): Excellent. Is there anything special about your apartment like the location?
      Speaker 0: Yes, we do require renter’s insurance. Our monthly premium is $14 if you choose to go with our provider.
      </example-2>
      
      
                `
          }
        ],
        "provider": "openai",
        "model": "gpt-4o",
        "fallbackModels": [
          "gpt-4-turbo",
          "gpt-3.5-turbo-1106"
        ],
        "semanticCachingEnabled": true,
        "numFastTurns": 1,
        "temperature": 0,
        "maxTokens": 525,
        "emotionRecognitionEnabled": true
      },
  
      "silenceTimeoutSeconds": 50,
      "responseDelaySeconds": 1,
      "llmRequestDelaySeconds": 0.2,
      "numWordsToInterruptAssistant": 7,
      "dialKeypadFunctionEnabled": false,
      "serverUrl": "https://shop.leasemagnets.com/api/vapi/webhook",
      "endCallFunctionEnabled": false
    },
    "customer": {
      "number": "+1"+phoneNumber
    },
    "phoneNumberId": "4d35e79b-4d1e-472d-b6d9-c7c37251ea2f"
  }

  setInitObj(template);
  console.log('vapi template TYG initObj TYG', template)
  return template;
}

  useEffect(() => {
    generateVapiJson(selectedAgent, callFocus?.[selectedFocus], `+1${phoneNumber}`);
  }, [selectedFocus, selectedAgent, phoneNumber]);

  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * agentButtons.length);
    const newAgent = agentButtons[randomIndex];
    setSelectedAgent(newAgent);

    const randomFocus = getRandomKey(callFocus);
    setSelectedFocus(randomFocus);

    generateVapiJson(newAgent, randomFocus);
  }, []);


async function handleVapiCall () {
  try {
    const myHeaders = new Headers();
    myHeaders.append("authorization", "Bearer ");
    myHeaders.append("content-type", "application/json");

      const raw = JSON.stringify(initObj);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

       fetch("https://api.vapi.ai/call/phone", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result, result?.phoneCallProviderId);
          setActiveCallSid(result?.phoneCallProviderId);
        })
        .catch((error) => console.error(error));



    // const result = await response.json();
    console.log('API call success:');
  } catch (error) {
    console.error('API call failed:', error);
  }
};





const phoneNumberIsValid = (phoneNumber) => {
  // Regular expression to validate phone number format
  const phoneNumberRegex = /^\d{10}$/;

  // Test if the phone number matches the regex pattern
  return phoneNumberRegex.test(phoneNumber);
};

const handleCall = () => {
  console.log('calling');

  if (!selectedAgent || !selectedFocus) {
    alert("Please select both an agent and a focus area.");
    return;
  }

  if (!phoneNumberIsValid(phoneNumber)) {
    alert("Make sure phone number is 10 digits");
    return;
  }

  generateVapiJson()
  handleVapiCall();
};


  
  return (
    <>
    
    
    <style jsx>{`
      .circle-number {
        display: inline-block;
        width: 30px;
        height: 30px;
        background-color: skyblue;
        color: #fff;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        padding: 4px;
        margin-right: 10px;
        margin-top: 5px;
    }
    `}</style>

    {true && 
      <div className="w-screen h-screen pt-[5vh] bg-gray-100 flex flex-col items-center justify-start p-4 overflow-y-scroll">
      
      <div className="bg-white w-full max-w-4xl shadow-lg rounded-lg p-8 mb-5">
          <h1 className="text-4xl font-bold text-gray-900 mb-4"> Train yourself with AI</h1>
          <div className="text-lg text-gray-700 mb-8">
              <strong><span className="circle-number">1</span> Pick your AI Agent:</strong> Pick an agent to call you as a potential prospect. <br />

              <div className="flex space-x-4 my-4">
                {agentButtons.map((agent, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        setSelectedAgent(agent);  // Assuming each image source is unique
                        generateVapiJson(agent, callFocus[selectedFocus], `+1${phoneNumber}`);
                      }}
                      className="focus:outline-none"
                    >
                      <img
                        src={agent?.src}
                        alt={agent?.alt}
                        className={`h-16 w-16 rounded-full border-2 ${selectedAgent?.src === agent?.src ? 'opacity-100 border-blue-500 ' : 'border-gray-300 opacity-50 '} hover:border-blue-500 hover:scale-110 hover:opacity-100 transition duration-300`}
                      />
                    </button>
                    <span className={`mt-2 text-sm text-gray-700 ${selectedAgent?.src === agent?.src ? 'opacity-100' : 'opacity-50'} `}>{agent?.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5">
              <strong><span className="circle-number">2</span> Pick your mock call focus</strong> Select what you are most interested in testing for. <br />
                </div>

              <div className="flex gap-4">
                {Object.keys(callFocus).map((focus, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedFocus(focus);
                      generateVapiJson(selectedAgent, callFocus[focus], `+1${phoneNumber}`);
                    }}
                    className={`px-4 py-2 border ${selectedFocus === focus ? 'border-blue-500 bg-gray-100 opacity-100' : 'border-gray-300 opacity-50 hover:bg-gray-200 hover:opacity-100'} hover:border-blue-500 hover:scale-105 hover:bg-gray-200 transition duration-300 rounded`}
                  >
                    {focus}
                  </button>
                ))}
            </div>
            
              {/* <EmailVerification /> */}
                <div className="mt-5">
                  <span> <strong><span className="circle-number">3</span> Initiate Phone Call:</strong>  Our AI will also generate an automatic evaluation for your convenience. <br /></span>
                </div>              
              <div className="flex items-center mt-3">
                
                <VapiButtonTYG
                  onStart={() => {
                  }}
                />
                <span className="px-5">or </span>
                <input
                    className="number-input outline-none focus:ring-0 rounded-md"
                    placeholder="+1 Phone Number"
                    style={{ color: "black", fontSize: "22px" }}
                    value={phoneNumber}
                    onChange={(e) =>{
                      const enteredPhoneNumber = event.target.value.replace(/[^\d+]/g, "");

                      // Update the state with the entered phone number
                      setPhoneNumber(enteredPhoneNumber);
                    }} 
                    // on key down, enter key
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCall();
                      }
                    }}

                  />
                  <div  
                  className="cursor-pointer border border-blue-500 text-blue-500 bg-blue-500 hover:bg-blue-600 hover:text-white transition-colors duration-200 ease-in-out py-2 px-4 rounded"
                    style={{ justifyContent: "center" }}
                      onClick={() => {
                        handleCall();
                      }}
                    >
                      <i className="material-icons flex text-center">
                        <svg
                          width="20"
                          height="22"
                          viewBox="0 0 20 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.0316 20.625C14.2812 20.625 13.227 20.3216 11.6484 19.3359C9.72882 18.1328 8.24404 17.022 6.33483 14.8938C4.49405 12.8377 3.59826 11.5066 2.34455 8.9568C0.928209 6.0779 1.16965 4.56884 1.43954 3.92387C1.76094 3.15301 2.23536 2.69196 2.84857 2.23434C3.19687 1.9793 3.56546 1.76066 3.94966 1.58122C3.9881 1.56274 4.02386 1.54512 4.05577 1.52923C4.24607 1.43341 4.53442 1.2886 4.89965 1.44329C5.1434 1.54555 5.361 1.75481 5.70163 2.13079C6.40019 2.90079 7.3548 4.61567 7.70696 5.45786C7.9434 6.02548 8.09987 6.40016 8.10026 6.8204C8.10026 7.31239 7.87881 7.6918 7.61008 8.1013C7.55971 8.17821 7.50973 8.25169 7.46129 8.32301C7.16872 8.7527 7.10451 8.87688 7.1468 9.0986C7.23254 9.54419 7.87189 10.8706 8.92261 12.0424C9.97333 13.2141 11.1259 13.8836 11.5262 13.979C11.733 14.0284 11.8464 13.9536 12.2432 13.615C12.3001 13.5665 12.3585 13.5162 12.4196 13.4659C12.8295 13.1252 13.1532 12.8841 13.583 12.8841H13.5853C13.9594 12.8841 14.2796 13.0655 14.8102 13.3645C15.5022 13.7547 17.0827 14.8079 17.7759 15.5895C18.1131 15.9693 18.3011 16.2116 18.3929 16.4836C18.5314 16.8931 18.401 17.2141 18.3161 17.429C18.3018 17.4646 18.2861 17.5037 18.2695 17.5471C18.1077 17.9758 17.9109 18.3868 17.6817 18.7752C17.273 19.4584 16.859 19.9873 16.1677 20.347C15.8127 20.5346 15.4243 20.6297 15.0316 20.625Z"
                            fill="white"
                          />
                        </svg>
                      </i>
                    </div>

               


                    
              </div>
              {activeCallSid &&<div className="mt-4"><a href={`/eval?callSid=${activeCallSid}`} className="text-black">{activeCallSid}</a>
              <a href={`/eval?callSid=${activeCallSid}`} target="_blank" className="text-blue-500 ml-2">View your LiveCall Shop evaluation results</a></div>}

              
          </div>
      </div>
        
          {/* <input type="text" placeholder="Ask a question..."
                 className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" /> */}


        <div className={`max-w-4xl mb-5 ${activeCallSid ? "opacity-100" : "opacity-50"}`}>
        <strong><span className="circle-number">4</span> Title your Training Shop</strong> (Optional) Create a helpful reference to remember this phone shop by ie: 'You x Landmark May 12 - Good Call'.  <br />
        <input type="text" 
        onChange={(e) => setMysteryShopName(e.target.value)}
        value={mysteryShopName}
         placeholder="Title your Training Session..." className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
          <textarea 
            onChange={(e) => setMysteryShopNotes(e.target.value)}
            value={mysteryShopNotes}
            placeholder="Enter your notes here..., like cues you used, key questions missed/room for improvement, or any other feedback details you want to remember about the call."
            className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
          onClick={()=> {
            if (activeCallSid) {
              handleCallUpdates({callId: activeCallSid, subtitle: mysteryShopName, notes: mysteryShopNotes});
              toast.success('Updated mystery shop with notes!')
            } else {
              toast.error('No active call found')
            }
          }}
           className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white mt-4 min-w-[150px] rounded-lg">Save</button>
      </div> 

        
      <div className="my-5 mt-3 max-w-4xl">
          <span> <strong><span className="circle-number">5</span> Review helpful notecards:</strong>  Be prepared and use best practice tips for your convenience. Review the notes below on how to handle these calls <br /></span>
        </div>

      {markdownContent && <div className="mt-2 mb-4 bg-white p-4 w-full max-w-4xl">
          <button className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
              setMarkdownContent(null);
              setMarkdownContentKey(null);
          }}>
              Back
          </button>
          <Markdown>
              {markdownContent}
          </Markdown>
      </div>}

      
      {true && <div className="grid grid-cols-2 gap-4 mb-10 w-full max-w-4xl">
          <PreviewCard 
                keyword="Basic Intro: Could you tell me a bit about the housing options available?" 
                score={0.8} 
                comment={truncateText(markdownContentList['Basic Intro'])} 
                onClick={() => {
                  setMarkdownContent(markdownContentList['Basic Intro']);
                  setMarkdownContentKey('Basic Intro');
                }} 
              />
              <PreviewCard 
                keyword="Pricing/Objection Handling: How do you justify the price of the accommodation compared to other options in the area?" 
                score={0.8} 
                comment={truncateText(markdownContentList['Pricing/Objection Handling'])} 
                onClick={() => {
                  setMarkdownContent(markdownContentList['Pricing/Objection Handling']);
                  setMarkdownContentKey('Pricing/Objection Handling');
                }} 
              />
              <PreviewCard 
                keyword="What unique experiences or amenities does your accommodation offer to enhance the living experience?" 
                score={0.8} 
                comment={truncateText(markdownContentList['Experience Driving/Value Testing'])} 
                onClick={() => {
                  setMarkdownContent(markdownContentList['Experience Driving/Value Testing']);
                  setMarkdownContentKey('Experience Driving/Value Testing');
                }} 
              />
              <PreviewCard 
                keyword="Lead Capture Test: Would you be interested in booking a virtual tour of the accommodation?" 
                score={0.8} 
                comment={truncateText(markdownContentList['Lead Capture Test'])} 
                onClick={() => {
                  setMarkdownContent(markdownContentList['Lead Capture Test']);
                  setMarkdownContentKey('Lead Capture Test');
                }} 
              />
              </div>}
      


     

      
   
  </div>

    }

   

    </>
  );
};

export default AiTrainer;