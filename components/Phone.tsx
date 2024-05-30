// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { Device } from "@twilio/voice-sdk";

import {
  useConvoStore,
  useContactStore,
  useCallLogsPopup
} from "@/utils/store/conversationStore";

import toast from "react-hot-toast";
import moment from "moment";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { supabase } from "@/utils/supabase/supabase";
import { ArrowDownIcon, ArrowUp, RefreshCcw, Rocket,BookText } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@radix-ui/react-hover-card';
import { supabase as supabase_usePhoneAi_db } from "@/utils/supabase/supabase_usePhoneAi_db";
import CallLogsPopup from '../components/CallLogsPopup'

//Types
enum USER_STATE {
  CONNECTING = "Connecting",
  READY = "Ready",
  ON_CALL = "On call",
  INCOMING = "Incoming",
  OFFLINE = "Offline",
}

const numberList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "0", "#"];

const stateColor = {
  [USER_STATE.CONNECTING]: "#B7AC44",
  [USER_STATE.INCOMING]: "#B7AC44",
  [USER_STATE.READY]: "#DAD870",
  [USER_STATE.ON_CALL]: "#FF5C4D",
  [USER_STATE.OFFLINE]: "#FFB52E",
};

const updateCallsSupabase = async (
  callSid: string,
  phoneNumber: string,
  marketKey: string,
) => {
  console.log("updateCallsSupabase TYG :", { callSid, phoneNumber, marketKey });
  const { data, error } = await supabase
    .from("Calls")
    .upsert({ callSid, phoneNumber, marketKey })
    .select();
};

export function formatTime(timeInSeconds, simplify) {
  const formattedTime ="00:00:00";

  return formattedTime;
}

export async function addConvoHistory(convo_id: string, historyObj: any) {
  try {
   
    return "History added successfully"; // You can return a more meaningful response
  } catch (error) {
    return error.message; // Handle any errors
  }
}

//Helpers
const Timer = ({textColor="black"}) => {
  const [timer, setTimer] = useState({ mins: 0, sec: 0 });
  const getTime = () => {
    setTimer((state) => ({
      mins: state.sec === 60 ? state.mins + 1 : state.mins,
      sec: state.sec === 60 ? 0 : state.sec + 1,
    }));
  };
  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`timer text-${textColor}`} >
      {`${timer.mins < 9 ? "0" + timer.mins : timer.mins} : ${
        timer.sec < 9 ? "0" + timer.sec : timer.sec
      }`}
    </div>
  );
};

//Components
const Phone = ({
  token,
  isHighlightedSequence,
  isHighlightedContact,
  isHighlightedContactList,
  sendSequence,
}) => {
  const { activeCallSid, setActiveCallSid, phoneNumber, setPhoneNumber, marketKey, powerDialNumbers:phoneNumbers } = useContactStore();
  console.log("phoneNumberList TYG: ", phoneNumbers);
  //State
  
  //Helpers
  const init = async () => {
    console.log("Phone component initialized");
  };

  function handleIncomingCall(call) {
    console.log(`Incoming call from ${call.parameters.From}`);
    setIncomingCall(call); // Set the incoming call state

    //show incoming call div and incoming phone number

    // add event listener to call object
    call.on("cancel", handleDisconnectedIncomingCall);
    call.on("disconnect", handleDisconnectedIncomingCall);
    call.on("reject", handleDisconnectedIncomingCall);
  }

  // ACCEPT INCOMING CALL
  function acceptIncomingCall(call) {
    if (call) {
      call.accept();
      setIsCallActive(true); // Set call as active
      if (call?.parameters?.CallSid && activeConvoId) {
      
      }

      // Rest of the code...
    }
  }


async function handleCallUpdates(obj) {
  console.log("objjj",obj)
  const { data, error } = await supabase_usePhoneAi_db
  .from("calls")
  .upsert(obj)
  .select();
}


  // HANG UP INCOMING CALL
  function hangupIncomingCall(call) {
    if (call) {
    }
  }

  // HANDLE CANCELLED INCOMING CALL

  function handleDisconnectedIncomingCall() {
    console.log("Incoming call ended.");
    resetIncomingCallUI();
  }

  function resetIncomingCallUI() {
  }

  const [currentIndex, setCurrentIndex] = useState(0);

 
  const handlePowerDial = async () => {
    // Check if we are within the bounds of the phoneNumbers array
    if (currentIndex < phoneNumbers.length) {
   
    } else {
      console.log("All numbers have been dialed.");
    }
  };
  

  
  const handleCall = async (phoneNumberToCall = phoneNumber, powerDial=false) => {
    
    setPhoneNumber(phoneNumberToCall);


    if (userState === USER_STATE.ON_CALL) {
      callDevice?.disconnectAll();
      if (!powerDial) return;
    }

    
    const params: Record<string, string> = {
      To: phoneNumberToCall,
      statusCallback:
        "https://webhook.site/db064b5d-ae03-4b35-9234-f9c4fae2764b",
      statusCallbackEvent: "initiated ringing answered completed",
      recordingStatusCallback : "https://webhook.site/db064b5d-ae03-4b35-9234-f9c4fae2764b"
    };
    callDevice?.emit("connect");
    callDevice
      ?.connect({
        params: params,
        rtcConstraints: {
          audio: true,
        },
      })
      .then((call) => {
        call.on("accept", (connection) => {
          console.log("CallSid", call?.parameters?.CallSid);
          // update call status to supabse
          if (call?.parameters?.CallSid) {
            const historyObj = {
              id: `outbound-call-${call.parameters?.CallSid}-${activeConvoId}`,
              timeStarted: new Date().toISOString(),
              stage: "outbound_started",
            };
            setActiveCallSid(call.parameters?.CallSid);
            //addConvoHistory(activeConvoId, historyObj);
            // updateCallsSupabase(
            //   call.parameters?.CallSid,
            //   phoneNumberToCall,
            //   marketKey,
            // );
              handleCallUpdates({
                callId : call?.parameters?.CallSid,
                category : 'outbound',
                phone_number : phoneNumber 
              })
          }
          setConnection(connection);
          setUserState(USER_STATE.ON_CALL);
          console.log("call accepted");
        });
        
        call.on("disconnect", (connection) => {
          console.log("The call has been disconnected.");
          console.log("disconnected", connection);
          console.log('disconnected | phone number, currentIndex', phoneNumber, currentIndex, phoneNumbers.length, phoneNumbers[currentIndex+1])
          
          setUserState(USER_STATE.READY);
          setConnection(null);

          // if (powerDial && currentIndex + 1 < phoneNumbers.length) {
            // setCurrentIndex(currentIndex + 1);
            // setPhoneNumber(phoneNumbers[currentIndex+1]);
            // console.log("disconnected, Powerdialling next number TYG", currentIndex+1, phoneNumbers[currentIndex+1])
            // handlePowerDial();
          // }
          
          if (call?.parameters?.CallSid) {
            // updateCallsSupabase(12,call.parameters?.CallSid,)
            let id = `outbound-call-${call.parameters?.CallSid}-${activeConvoId}`;
            const historyObj = {
              timeEnded: new Date().toISOString(),
              stage: "outbound_completed",
            };
            // updateConvoHistory(activeConvoId, id, historyObj);

            
          }
            
        });
        call.on("reject", () => {
          console.log("The call was rejected.");
        });
      });
  };

  function isEmpty(value) {
    for (let prop in value) {
      if (value.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  const sequenceHandlerRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = () => {
    if (connection) {
      if (isMuted) {
        connection.mute(false); // Unmute the call if it is currently muted
      } else {
        connection.mute(true); // Mute the call if it is currently unmuted
      }
      setIsMuted(!isMuted); // Toggle the mute state
    }
  };

  //Render Element
  return (
<div className="pl-2 pt-2">

<div className="flex ml-2">
  <div className="flex items-start space-x-2">

  {rerenderBool ? 
    <div className="flex flex-row">


    <div className="phone flex" style={{ color: "white" }}>
      {/* <div className="user-state text-xs	">
        <i style={{ color: stateColor[userState] }} className="fas fa-stop"></i>{" "}
        {`Status - > ${userState}`}
      </div> */}
      <style jsx={true}>{`
        .phone-box {
          margin: 0 39%;
          margin-top: 20px;
        }
        .gird {
          display: grid;
          grid-template-columns: 30% 30% 30%;
          justify-items: center;
          column-gap: 10px;
          row-gap: 15px;
        }
      `}</style>

   

      <div className="flex">
        <div className="relative">
          <input
            className="number-input outline-none focus:ring-0 rounded-md"
            value={phoneNumber}
            placeholder="+1 Phone Number"
            style={{ color: "black", fontSize: "22px" }}
            onChange={(event) => {
              setPhoneNumber(event.target.value.replace(/[^\d+]/g, ""));
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCall();
              }
            }}
          />

         
        </div>



      


      </div>
      
    </div>


  </div>
  : <></>}


  </div>

  <div className="flex items-center space-x-2">
          {/* <button className="p-2 rounded-full text-purple-700 hover:bg-gray-100">
            <Rocket size={20} />
            <span className="sr-only">Message</span>
          </button> */}

          <button
            onClick={() => {
              forceRerender();
            }}
            className="p-2 rounded-full text-purple-700 hover:bg-gray-100"
          >
            <RefreshCcw size={20} />
            <span className="sr-only">Refresh</span>
          </button>
{/* 
          <button 
          onClick={() => {
            setShowCallLogs(true)
          }}
          className="p-2 rounded-full text-purple-700 hover:bg-gray-100">
            <BookText size={20} />
            <span className="sr-only">Calls logs</span>
          </button> */}

  </div>

  </div>

  <div className="flex flex-row overflow-x-scroll w-full p-1" style={{overflowX:"scroll", maxWidth:"85vw"}}>
  {/* {phoneNumbers.map((contact, index) => (
    <HoverCard>
      <HoverCardTrigger>
        <div 
          key={index} 
          onClick={() => {
            handleCall(contact?.phone, true);
          }}
          className={`m-1 px-2 py-1 inline-block rounded ${contact?.phone === phoneNumber ? 'bg-blue-500 text-white' : ' border border-black/20 text-black/40 cursor-pointer hover:bg-blue-500/20 hover:text-white'}`}
        >
          {contact?.phone}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        side="bottom" 
        align="center" 
        className="bg-black text-white rounded p-2"
      >
        Property Name: <br/>
        {contact?.name}
      </HoverCardContent>
    </HoverCard>
  ))} */}
</div>



</div>
    
  );
};

export default Phone;
