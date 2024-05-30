// components/MessagesList.tsx
// @ts-nocheck

import {
  Contact,
  Sparkles
} from "lucide-react";
import { supabase } from "@/utils/supabase/supabase_usePhoneAi_db";

import React, { use, useEffect, useState } from "react";
import { useSelectedContact } from "@/lib/SelectedContactContext";
import Phone from "./Phone";
import {
  useContactStore,
} from "@/utils/store/conversationStore";
import Markdown from 'markdown-to-jsx';
import EmailVerification from "./EmailVerfication";
import PlayerAndTranscript from "./audio/PlayerAndTranscript";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { handleCallUpdates, transformDeepgramParagraphsToUnifiedStructure } from '@/utils/twilio/utils';


import axios from 'axios';


type Contact = {
  id: number;
  sender: string;
  preview: string;
  date: string;
  unread: boolean;
};

export function saveCallHistoryLogs(localCallSid) {
  const MAX_HISTORY = 10;
  const callSid = localCallSid; // replace with your actual callSid

  // Ensure callSid is valid
  if (!callSid) return;

  // Get the existing history
  let history = JSON.parse(localStorage.getItem('callSidHistory')) || [];
  setCallSidHistory(history);

  // and is not part of existing history
  if (history.includes(callSid)) return;


  // Add the new callSid to the history
  history.unshift(localCallSid);

  // Trim the history to the max length
  history = history.slice(0, MAX_HISTORY);
  

  // Save the updated history
  localStorage.setItem('callSidHistory', JSON.stringify(history));
}
  


const UseCreditButton = ({ useCreditReason="", postPath='/api/twilio/geminiApi/', postData={}, onsuccess=()=>{} })  => {
    const [isLoading, setIsLoading] = useState(false);

    const handleButtonClick = async () => {
        setIsLoading(true);
        try {
            // Replace 'your-api-endpoint' with your actual API endpoint
            const response = await axios.post(postPath,
              postData
            );
            console.log('creditData TYG', response?.data);
              // Process your data here
              onsuccess(response?.data);
        } catch (error) {
            console.error('creditData TYG Error fetching data:', error);
        }
        setIsLoading(false);
    };

    return (
        <button
            onClick={handleButtonClick}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            disabled={isLoading}
        >
            {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.313 1.344 6.315 3.514 8.485l2.486-2.194z"></path>
                </svg>
            ) : (
                <Sparkles size={24} />
            )}
            {isLoading ? 'Loading...' : 'Use Credit' + useCreditReason}
        </button>
    );
};



export function Loader() {
  const [loadingText, setLoadingText] = useState('Loading...');
  const loadingTexts = ['Loading...', 'Still loading...', 'Almost there...'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingTexts.indexOf(prev);
        return loadingTexts[(currentIndex + 1) % loadingTexts.length];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div role="status">
      <style jsx>{`
        @keyframes swipeUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }
      }`}</style>
      <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="transition-all duration-1500 ease-in-out transform translate-y-0 ml-4">{loadingText}</span>
    </div>
  );
}


const AiEval = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { fromCallerId, setCallerId, phoneNumber, setPhoneNumber, setMarketKey, powerDialNumbers, setPowerDialNumbers } = useContactStore();

  const { setSelectedContact } = useSelectedContact();




  const [markdownContent, setMarkdownContent] = useState('');
  const [markdownContentKey, setMarkdownContentKey] = useState('');
  const [markdownContentScore, setMarkdownContentScore] = useState('');

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


const imageButtons = [
  { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/7ac376db-a5ca-49d8-2253-3e60a7e40b00/public', alt: 'Image 1', data: { voice: 'voice 1',  } },
  { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/c446b5a0-12a3-4862-8fe3-0ae619609c00/public', alt: 'Image 2', data: { voice: 'voice 2' } },
  { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/3b7cedaf-d9f1-4844-83a1-4ab7f5537200/public', alt: 'Image 3', data: { voice: 'voice 3' }  },
  { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/0cb2f044-13e0-40ba-1c70-fdecefab9000/public', alt: 'Image 5', data: { voice: 'voice 4' }  }

];

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

const PreviewCard = ({key, keyword, score, comment, onClick=()=>{} }) => {
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
      key={key}
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


const ImageButtonRow = ({ buttons }) => {
  const handleClick = async (buttonData) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("authorization", "Bearer ");
        myHeaders.append("content-type", "application/json");
        myHeaders.append("dnt", "1");
        myHeaders.append("origin", "https://dashboard.vapi.ai");
        myHeaders.append("priority", "u=1, i");
        myHeaders.append("referer", "https://dashboard.vapi.ai/");
        myHeaders.append("sec-ch-ua", "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
        myHeaders.append("sec-fetch-dest", "empty");
        myHeaders.append("sec-fetch-mode", "cors");
        myHeaders.append("sec-fetch-site", "same-site");
        myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
        myHeaders.append("Cookie", "_cfuvid=chGVgmTl9Ifighx.IYWJM87K3tTlOVGZThkOXMysu8w-1716146982942-0.0.1.1-604800000; _cfuvid=qqGgV56KlVDivctIbZTccrV8jR653jCyB_NO91v2qGg-1716151594204-0.0.1.1-604800000");
 
        const raw = "{\"assistantId\":\"9a910528-2101-45b6-a6fe-314a5afcf9a2\",\n\"assistantOverrides\": {\n     \"voice\": {\n        \"voiceId\": \"3gsg3cxXyFLcGIfNbM6C\",\n        \"provider\": \"11labs\",\n        \"stability\": 0.6,\n        \"similarityBoost\": 0.75,\n        \"useSpeakerBoost\": true,\n        \"optimizeStreamingLatency\": 4\n    },\n     \"model\": {\n      \"messages\": [\n        {\n          \"role\": \"assistant\",\n          \"content\": \"You are a lead, it is your responsibility to talk to someone on the leasing office.  Keep on asking that question until you hear a yes? Once you do hear a real person introducing themselves and property, ask relevant questions as a lead. Ask the question one at a time. Start with the question: 'what are their availibities for the 1 bedroom and studios' and go from there. Followup on questions make it feel logical for a lead.\\\\n\\\\nFeel free to make up relevant information that might be relevant that a real human student might ask.\\\\n\\\\nIf they ask you for your phone number it is 5862588588 and your email is amulya@umich.edu. Be a little hesitant to offer it at first. Make them give you a good reason to share both pieces of information. If they ask you for email or name, say it once and then spell it out the email before @ , ie; P like Peter, A like Alpha etc... but just say the domain (ie: at gmail.com ) and only spell that specific part if requested.\\\\n\\\\nand your name is Amulya\\\\n\\\\n\\\\n\\\\nNO matter what do not transfer the call even if they say\"\n        }\n      ],\n      \"provider\": \"openai\",\n      \"model\": \"gpt-4o\",\n      \"fallbackModels\": [\n        \"gpt-4-turbo\",\n        \"gpt-3.5-turbo-1106\"\n      ],\n      \"semanticCachingEnabled\": true,\n      \"numFastTurns\": 4,\n      \"temperature\": 0,\n      \"maxTokens\": 525,\n      \"emotionRecognitionEnabled\": true\n    },\n    \"silenceTimeoutSeconds\": 50,\n    \"responseDelaySeconds\": 0.4,\n    \"llmRequestDelaySeconds\": 0.2,\n    \"numWordsToInterruptAssistant\": 7,\n    \"dialKeypadFunctionEnabled\": false,\n    \"serverUrl\": \"https://markets.leasemagnets.com/api/twilio/template\",\n    \"endCallFunctionEnabled\": true\n    },\n\"customer\":{\"number\":\"+4077018683\"},\"phoneNumberId\":\"77539553-69fa-431f-b490-455ba6c16288\"}";
 
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
 
        fetch("https://api.vapi.ai/call/phone", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
 
 
 
      const result = await response.json();
      console.log('API call success:', result);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };
 
  return (
    <div className="flex justify-center space-x-4 my-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => handleClick(button)}
          className="focus:outline-none"
        >
          <img
            src={button.src}
            alt={button.alt}
            className="h-16 w-16 rounded-full border-2 border-gray-300 hover:border-blue-500 transition duration-300"
          />
        </button>
      ))}
    </div>
  );
};

  const [callSid, setCallSid] = useState('');
  const [callSidHistory, setCallSidHistory] = useState([]);

  const [callLog, setCallLog] = useState({});

  const searchParams = useSearchParams()

  useEffect(() => {
    setCallSid(searchParams.get('callSid') || '');
  }, []);


  
  useEffect(() => {
    // Get the existing history
    let history = JSON.parse(localStorage.getItem('callSidHistory')) || [];
    setCallSidHistory(history);
  }, []);
  
  
  useEffect(() => {
    
    if (callSid) {
      // fetch supabase
      const fetchCallLog = async () => {
        const { data, error } = await supabase
          .from("calls")
          .select('*')
          .eq('callId', callSid)
          .single();

        if (error) {
          console.error('Error fetching call log:', error);
          toast.error('Error fetching call log. Invalid link')
          setCallSid(null)
        } else {
          console.log('Call log TYG: ', data);
          setCallLog(data);

          saveCallHistoryLogs(callSid);
        }
      };
      fetchCallLog();
  
    }



  }, [callSid]);


  
  useEffect(() => {
    const callObjEventSubscriptionChannel = supabase
    .channel('custom-contact-update-channel')
      .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: "calls",
            filter: `callId=eq.${callSid}`,
        },
          (payload) => {
            console.log('callid payloadUpdateTYG: ', payload);
            if ((payload.eventType) == "UPDATE") {
                console.log("UPDATE messageReceivedTYG convoEventSubscriptionChannelTYG: ", payload)
                setCallLog(payload?.new);
                // updateActiveConvoList(payload?.new || {})
            } 
        }
      )
      .subscribe();



      // add return right here!
      return () => {
        callObjEventSubscriptionChannel.unsubscribe()
      }
    
    
    }, [callSid]);



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
      
      <div className="bg-white w-full max-w-4xl shadow-lg rounded-lg p-8 mb-5 ">
          <h1 className="text-4xl font-bold text-gray-900 mb-4"> Evaluate Your Conversation</h1>
          <p className="text-lg text-gray-700 mb-8">
              <strong><span className="circle-number">1</span> Initiate Mystery Phone Shop or Ai Sales Trainer:</strong> Dial your property's number to start your mystery phone shop. <br />
          </p>


          Current Call Id: {callSid}

          <div className="overflow-wrap break-word w-full flex flex-wrap font-xs">

          <span className="mr-2">Recent CallSids:  </span><br /> 

  {callSidHistory.map((callSid, index) => (
    <><a key={index} className="opacity-50  hover:opacity-100" 
     href={`/eval?callSid=${callSid}`}
    >{callSid}</a><span className="mr-3">,</span></>
  ))}
</div>
        
          {/* <input type="text" placeholder="Ask a question..."
                 className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" /> */}

      </div>
      

      <div className="bg-white w-full max-w-4xl shadow-lg rounded-lg p-8 mb-5">
          <strong><span className="circle-number">2</span> Review the Call:</strong>  Click on the Overview Score Card, for the summary. <br />

            {!callLog || !callSid ? 
              <div className="mt-6"><Loader /></div>
                :
                <>
              <PlayerAndTranscript audio={callLog?.supabase_recording_url} preformatTranscript={callLog?.transcript_json} summary={callLog?.summary} />
           
            
              <div className="mt-3">
              <UseCreditButton useCreditReason=" to generate Transcript" postPath="/api/twilio/deepgramApi" postData={{
                  "audioUrl":callLog?.supabase_recording_url,
                  "callSid":  callSid
              }} onsuccess={(deepgramTranscripts)=> {
                toast.success('Deepgram API call success')
                console.log('deepgram transcripts TYG', deepgramTranscripts)
                let transcript_json = transformDeepgramParagraphsToUnifiedStructure(deepgramTranscripts?.data?.results?.channels?.[0]?.alternatives?.[0]?.paragraphs?.paragraphs)
                setCallLog(prev => ({
                  ...prev,
                  transcript :  deepgramTranscripts?.data?.results?.channels?.[0]?.alternatives?.[0]?.paragraphs?.transcript,
                  transcript_json :  transcript_json,
                  summary: deepgramTranscripts?.data.results.summary.short
                }))
                handleCallUpdates({
                  callId : callSid,
                  transcript :  deepgramTranscripts?.data?.results?.channels?.[0]?.alternatives?.[0]?.paragraphs?.transcript,
                  transcript_json :  transcript_json,
                  summary: deepgramTranscripts?.data.results.summary.short
                })
                
              }} />
              </div>
              </>
            }
            </div>
    
      {(callLog?.evaluations && callSid) ? 
      <div className="max-w-4xl ">
      <div className=" mb-5 flex-start items-start">
           <strong><span className="circle-number">3</span> Explore AI Feedback :</strong> Click on the different cards to explore your strength and weakness report. Use the AI Credit button below to generate the feedback to get you started. <br />
      </div>
     
      {markdownContent && <div className="mt-5 bg-white p-4 w-full max-w-6xl my-5">
          <button className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
              setMarkdownContent(null);
              setMarkdownContentKey(null);
          }}>
              Back
          </button>
          <br />
          <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">{markdownContentKey}</h2>
                  <p className="text-2xl font-medium text-gray-900 border border-2 mb-5 rounded-lg p-5" >{markdownContentKey ? <>Score: {markdownContentScore} </> : <></>}</p>
          </div>
          <Markdown className="text-lg">
              {markdownContent}
          </Markdown>
      </div>}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.isArray(callLog?.evaluations) && callLog?.evaluations?.map(item => (
          <PreviewCard
            key={item.keyword}
            keyword={item.keyword}
            score={item.score}
            comment={item.comments[0]} // assuming you only want the first comment
            onClick={() => {
              
              // if item.comments[0] is a string then convert string of arrays of items?.comment into one big string
              if (typeof item?.comments?.[0] === 'string') {
                setMarkdownContentKey(formatTitle(item.keyword))
                setMarkdownContentScore(item?.score)
                setMarkdownContent( "-" + item?.comments.map(comment => comment).join('<br/><br/> -'));
              }
              else if (typeof item?.comments?.[0] === 'object') {
                setMarkdownContentKey(formatTitle(item.keyword))
                setMarkdownContentScore(item?.score)

                setMarkdownContent(item?.comments.map(comment => {
                  return  "**Question**: " +  comment?.question + 
                   // if score is 0 then No in bold, if score is between 1-2 then Kind Of in bold, if score is 3-5 then Yes in bold and italic
                   "<br/> **Comments:** " + (comment?.score === 0 ? "**No:** " : comment?.score > 0 && comment?.score < 3 ? "**Kind Of:** " : "**Yes:** ") + comment?.comments + '<br/>**Score:** ' + comment?.score + "/5 <br/>";
                }).join('<br/><br/> '));

              }
                
            }}
          />
        ))}
      </div>
      </div> : <></>}
      
      {callSid && callLog && <div className="flex my-5 max-w-4xl w-full">
        <UseCreditButton postPath="/api/twilio/geminiApi" postData={ callLog?.transcript ? {
              "audioTranscript": callLog?.transcript,
              "callSid": callSid
          } : {
            "audioUrl":callLog?.supabase_recording_url,
            "callSid": callSid
          }} 
          onsuccess={(geminiData)=> {
            console.log('geminiData TYG', geminiData)
            setCallLog(prev => ({
              ...prev,
              evaluations: geminiData?.data
            }))
            
            handleCallUpdates({
              callId : callSid,
              evaluations : geminiData?.data
            })
          }}
          useCreditReason=" to generate AI Feedback"
        />
      </div>}


      {callSid && <div className={`max-w-4xl mb-5 bg-white p-5 rounded  shadow-lg`}>
        <strong><span className="circle-number">4</span> Update your Phone Shop Notes</strong> (Optional) Create a helpful reference to remember this phone shop by ie: 'You x Landmark May 12 - Good Call'.  <br />
        <input type="text" 
        onChange={(e) => {
          // update callLog object
          setCallLog(prev => ({
            ...prev,
            subtitle: e.target.value
          }));
        }}
        value={callLog?.subtitle }
         placeholder="Name your Phone Shop..." className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" /
        >
          <textarea 
            onChange={(e) => {
              // update callLog object
              setCallLog(prev => ({
                ...prev,
                notes: e.target.value
              }));
            }}
            value={callLog?.notes}
            placeholder="Enter your notes here..., like cues you used, key questions missed/room for improvement, or any other feedback details you want to remember about the call."
            className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
          onClick={()=> {
            if (callSid) {
              handleCallUpdates({
                ...callLog, 
                callId: callSid,
                notes: callLog?.notes,
                subtitle: callLog?.subtitle
                
              });
              toast.success('Updated mystery shop with notes!')
            } else {
              toast.error('No active call found')
            }
          }}
           className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white mt-4 min-w-[150px] rounded-lg">Save</button>
      </div> }
  </div>

    }

    </>
  );
};

export default AiEval;
