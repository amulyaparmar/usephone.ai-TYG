// components/MessagesList.tsx
// @ts-nocheck
import { ScrollArea } from "@/components/ui/scroll-area";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Dialog from "@radix-ui/react-dialog";

import {
  ChevronDown,
  MessageSquareText,
  PhoneOutgoing,
  Sliders,
  UserRound,
  Share2Icon,
  SearchIcon,
  Search,
  ClipboardIcon,
  Star,
  Contact,
  Facebook,
  RefreshCcw,
  Rocket
} from "lucide-react";
import { Loader } from "@/components/AiEval";
import { supabase } from "@/utils/supabase/supabase_usePhoneAi_db";

import React, { useEffect, useState } from "react";
import { useSelectedContact } from "@/lib/SelectedContactContext";
import EditableField from "./EditableField";
import Phone from "./Phone";
import {
  useConvoStore,
  useContactStore,
} from "@/utils/store/conversationStore";
import PopupWithList from './popups/MarketListPopup'
import Markdown from 'markdown-to-jsx';
import PlayerAndTranscript from "./audio/PlayerAndTranscript";
import CallLogPopupWithList from "./CallLogsPopup";
import { toast } from "sonner";
import { handleCallUpdates } from '@/utils/twilio/utils';
import { AudioRecorder } from 'react-audio-voice-recorder';

import { uuid } from 'uuidv4';

export
  type Contact = {
    id: number;
    sender: string;
    preview: string;
    date: string;
    unread: boolean;
  };

const MessagesList = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { fromCallerId, activeCallSid, setPowerDialNumbers, setActiveCallSid } = useContactStore();
  const [activeCallTranscript, setactiveCallTranscript] = useState()

  useEffect(() => {
    // Function to fetch properties

  }, []);

  useEffect(() => {
    init()
  }, [fromCallerId]);

  const { setSelectedContact } = useSelectedContact();

  // Function to get init token
  const [token, setToken] = useState("");

  // const baseURL = "https://chat.scaleconvo.com";

  // const getToken = () => {
  //   return fetch(`${baseURL}/token`, {
  //     method: "GET",
  //   }).then((response) => response.json());
  // };


  const baseURL = "";

  const getToken = () => {
    return fetch(`${baseURL}/api/twilio/generateToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fromCallerId: fromCallerId }),
    }).then((response) => response.json());
  };


  const init = async () => {
    // setToken(null)
    const token = await getToken();
    setToken(token?.token);
  };
  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const updateProperty = (
    key: number,
    fieldSubKey: string,
    newValue: string,
  ) => {
    setProperties((currentProperties) => {
      return currentProperties.map((property) => {
        if (property.key === key) {
          return { ...property, [fieldSubKey]: newValue };
        }
        return property;
      });
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [mysteryShopName, setMysteryShopName] = useState("");
  const [mysteryShopNotes, setMysteryShopNotes] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [blessedAudioUrlUuid, setBlessedAudioUrlUuid] = useState(uuid());

  const uploadAudioToSupabase = async (fileName: string, fileData: string) => {
    try {
      // Convert the base64 string to a Blob
      const base64Response = await fetch(`data:audio/webm;base64,${fileData}`);
      const blob = await base64Response.blob();

      // Upload the blob to Supabase
      const { data, error } = await supabase.storage
        .from('twilioCallsRecordings')
        .upload(`uploads/${blessedAudioUrlUuid}.webm`, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'audio/webm',
        });

      //get pubilc url
      let publicUrl = await supabase.storage
        .from('twilioCallsRecordings')
        .getPublicUrl(`uploads/${blessedAudioUrlUuid}.webm`)
      console.log("publicUrl", publicUrl?.data?.publicUrl)
      publicUrl = publicUrl?.data?.publicUrl;

      setAudioUrl(publicUrl)
      setActiveCallSid(blessedAudioUrlUuid)
      handleCallUpdates({
        callId: blessedAudioUrlUuid, supabase_recording_url: publicUrl,
        subtitle: mysteryShopName, notes: mysteryShopNotes
      });

      // call the deepgram webhook with the mp3 file and call id
      fetch(`${baseURL}/api/twilio/deepgramApi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioUrl: publicUrl, callSid: blessedAudioUrlUuid, callGeminiOnTranscript: true }),
      }).then((response) => response.json());


      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error uploading audio file:', error.message);
      return null;
    }
  };

  const handleRecordingComplete = (audioBlob) => {
    console.log('recording complete', audioBlob);
    setBlessedAudioUrlUuid(uuid() + "webm" + "TYG");
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url); // Store the URL to use in the audio tag
  };

  function audioBufferToWav(aBuffer) {
    console.log("audioBufferToWav TYG", aBuffer)
    let numOfChan = aBuffer.numberOfChannels,
      btwLength = aBuffer.length * numOfChan * 2 + 44,
      btwArrBuff = new ArrayBuffer(btwLength),
      btwView = new DataView(btwArrBuff),
      btwChnls = [],
      btwIndex,
      btwSample,
      btwOffset = 0,
      btwPos = 0;
    setUint32(0x46464952); // "RIFF"
    setUint32(btwLength - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(aBuffer.sampleRate);
    setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit
    setUint32(0x61746164); // "data" - chunk
    setUint32(btwLength - btwPos - 4); // chunk length

    for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
      btwChnls.push(aBuffer.getChannelData(btwIndex));

    while (btwPos < btwLength) {
      for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
        // interleave btwChnls
        btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
        btwSample = (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
        btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
        btwPos += 2;
      }
      btwOffset++; // next source sample
    }

    let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
    let wavSamples = new Int16Array(btwArrBuff, wavHdr.dataOffset, wavHdr.dataLen / 2);
    console.log("wavSamples TYG", wavSamples)

    wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);

    function setUint16(data) {
      btwView.setUint16(btwPos, data, true);
      btwPos += 2;
    }

    function setUint32(data) {
      btwView.setUint32(btwPos, data, true);
      btwPos += 4;
    }
  }

  function wavToMp3(channels, sampleRate, samples) {
    var buffer = [];
    var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    var remaining = samples.length;
    var samplesPerFrame = 1152;
    for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
      var mono = samples.subarray(i, i + samplesPerFrame);
      var mp3buf = mp3enc.encodeBuffer(mono);
      if (mp3buf.length > 0) {
        buffer.push(new Int8Array(mp3buf));
      }
      remaining -= samplesPerFrame;
    }
    var d = mp3enc.flush();
    if (d.length > 0) {
      buffer.push(new Int8Array(d));
    }

    var mp3Blob = new Blob(buffer, { type: 'audio/mp3' });
    let blobUrl = URL.createObjectURL(mp3Blob);
    setAudioUrl(blobUrl);
    console.log("mp3Blob TYG", mp3Blob, blobUrl)
  }

  const audioUrlToBase64 = async (audioUrl) => {
    const response = await fetch(audioUrl);
    const buffer = await response.arrayBuffer();
    // audioBufferToWav(buffer);
    const base64 = Buffer.from(buffer).toString('base64');
    return base64;
  };



  const [markdownContent, setMarkdownContent] = useState('');
  const [markdownContentKey, setMarkdownContentKey] = useState('');

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
    { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/7ac376db-a5ca-49d8-2253-3e60a7e40b00/public', alt: 'Image 1', data: { voice: 'voice 1', } },
    { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/c446b5a0-12a3-4862-8fe3-0ae619609c00/public', alt: 'Image 2', data: { voice: 'voice 2' } },
    { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/3b7cedaf-d9f1-4844-83a1-4ab7f5537200/public', alt: 'Image 3', data: { voice: 'voice 3' } },
    { src: 'https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/0cb2f044-13e0-40ba-1c70-fdecefab9000/public', alt: 'Image 5', data: { voice: 'voice 4' } }

  ];



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


    // Function to truncate text to 20 characters
    const truncateText = (text) => {
      return text.length > 20 ? text.substring(0, 250) + "..." : text;
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
        <h2 className="text-lg font-semibold text-gray-900">{keyword}</h2>
        <p className="text-gray-700 overflow-hidden relative opacity-40">
          <Markdown>
          {comment}
          </Markdown>
          <span className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/20 to-transparent"></span>
        </p>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent rounded-lg  to-white opacity-0 transition-opacity duration-300 hover:opacity-50 hover:from-blue-500 hover:to-transparent"></div>
      </div>
    );
  };
  

  const MysteryShopNameAndNotesEditor = ({ showSaveButton = true }) => {
    return <>
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
      <div className={`max-w-4xl mb-5 ${activeCallSid ? "opacity-100" : "opacity-50"}`}>
        <strong><span className="circle-number">2</span> Name your Phone Shop</strong> (Optional) Create a helpful reference to remember this phone shop by ie: 'You x Landmark May 12 - Good Call'.  <br />
        <input type="text"
          onChange={(e) => setMysteryShopName(e.target.value)}
          value={mysteryShopName}
          placeholder="Name your Phone Shop..." className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" /
        >
        <textarea
          onChange={(e) => setMysteryShopNotes(e.target.value)}
          value={mysteryShopNotes}
          style={{ minHeight: '200px' }}
          placeholder="Enter your notes here..., like cues you used, key questions missed/room for improvement, or any other feedback details you want to remember about the call."
          className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        {showSaveButton &&
          <button
            onClick={() => {
              if (activeCallSid) {
                handleCallUpdates({ callId: activeCallSid, subtitle: mysteryShopName, notes: mysteryShopNotes });

                toast.success('Updated mystery shop with notes!')
              } else {
                toast.error('No active call found')
              }
            }}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white mt-4 min-w-[150px] rounded-lg">Save Notes</button>
        }
      </div>
    </>
  }

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> Shop Your Community in 1 Click</h1>
            <p className="text-lg text-gray-700 mb-8">
              <strong><span className="circle-number">1</span> Call Your Property:</strong> Dial your property's number to start your mystery phone shop. <br />

            </p>

            {/* <input type="text" placeholder="Ask a question..."
                 className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" /> */}

            {token ? <div className=" w-full z-0 top-0 bg-white pb-2 border-b border-black/10">
              <Phone token={token} />


            </div> : <>
              <Loader />
            </>}
            {token && <div className="mt-[10px]">

              {activeCallSid ? <>
                <a href={`/eval?callSid=${activeCallSid}`} target="_blank" className="text-blue-500">View your LiveCall Shop evaluation results</a>
              </> : <>
                <span className="text-black/50 ">Need a property number to call?</span>
                <a href={`https://www.google.com/search?q=${"Apartments near University"}`} target="_blank" className="text-blue-500"> Search on Google</a> or use this <a href="https://markets.leasemagnets.com" target="_blank" className="text-blue-500">market list popular properties</a>
              </>
              }

            </div>}


            <p className="text-lg text-gray-700 mb-8 mt-5">
              <strong>Or use our AI Smart Audio Recorder:</strong> If you'd prefer to call from your phone or having trouble above <br />
              {/* <AudioRecorder2 /> */}

              {token && <AudioRecorder
                onRecordingComplete={(audioBlob) => {
                  console.log('recording complete', audioBlob)
                  handleRecordingComplete(audioBlob);
                }}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                // downloadOnSavePress={true}
                downloadFileExtension="webm"
                classes={{
                  AudioRecorderDiscardClass: "display-none"
                }}
              />}

              {audioUrl && (
                <div className="flex mt-5">
                  <audio controls src={audioUrl}>
                    Your browser does not support the audio element.
                  </audio>

                  <div className="flex gap-2">
                    <button onClick={async () => {
                      const base64 = await audioUrlToBase64(audioUrl);
                      const uploadResult = await uploadAudioToSupabase('thisIsAtest99TYG.webm', base64);
                      if (uploadResult) {
                        toast.success('Audio uploaded successfully!');

                      } else {
                        toast.error('Failed to upload audio.');
                      }
                    }} className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white ml-4 min-w-[150px] rounded-lg">Upload</button>
                    <button onClick={() => {
                      setAudioUrl(null);
                      setBlessedAudioUrlUuid(uuid());
                    }}
                      //grey bg with black text and red button next to left of text
                      className="px-5 py-2 bg-gray-300 text-black hover:bg-gray-400 min-w-[150px] rounded-lg"
                    > Rerecord</button>
                  </div>


                </div>
              )}
              <div className="flex mt-2">
                {blessedAudioUrlUuid && audioUrl?.includes("https://") && <>
                  <a href={`/eval?callSid=${blessedAudioUrlUuid}`} target="_blank" className="text-blue-500">View your Recorded Shop evaluation results</a>
                </>}
              </div>


              {/* <ConverterPage /> */}

            </p>

          </div>

          
          <MysteryShopNameAndNotesEditor />


          <div className="max-w-4xl mb-5">
            <strong><span className="circle-number">3</span> Ask your Leasing Team Questions as a Prospect </strong> Utilize the provided questions as cue cards or your own questions to better evaluate your leasing agent's performance. <br />
          </div>

          {markdownContent && <div className="mt-5 mb-5 bg-white p-4 w-full max-w-4xl">
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
      

          <div className="max-w-4xl mb-5">
            <strong><span className="circle-number">4</span> View your evaluation</strong> Once processed, your transcript from the call will be available <a href={`/eval?callSid=${activeCallSid}`} className="text-blue-500">here</a>. There you will also find a scorecard and AI review rubric for the call <br />
          </div>





        </div>

      }



    </>
  );
};

export default MessagesList;
