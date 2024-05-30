// components/PopupWithList.js
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase_usePhoneAi_db";
import { useCallLogsPopup } from "@/utils/store/conversationStore";
import moment from "moment";
import { FileAudio, Clipboard, FileText } from "lucide-react";
// import { CopyToClipboard } from 'react-copy-to-clipboard';



const TranscriptPopup = ({ transcript, onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white p-4 md:p-8 rounded-lg w-full md:w-3/4 max-w-5xl"
      >
        <button
          className="absolute top-2 right-2 text-lg font-semibold p-2"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Transcript</h2>
        <div className="overflow-auto max-h-96">
          <p className="text-sm">{transcript}</p>
        </div>
      </div>
    </div>
  );
};
const CallLogPopupWithList = ({setactiveCallTranscript}) => {
  const [callLogList, setCallLogList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const { showCallLogs: isOpen, setShowCallLogs: setIsOpen } = useCallLogsPopup();
  const [selectedTranscript, setSelectedTranscript] = useState(null);

  async function getCallLogList(loadMore = false) {
    setLoading(true);
    const newIndex = loadMore ? offset : 0;
    const { data: callLogData, error } = await supabase
      .from("calls")
      .select("*")
      .order('created_at', { ascending: false })
      .range(newIndex, newIndex + 29);

    if (error) {
      console.error("Error fetching call logs:", error);
    } else {
      if (loadMore) {
        setCallLogList([...callLogList, ...callLogData]);
      } else {
        setCallLogList(callLogData);
      }
      setOffset(newIndex + 30);
    }
    setLoading(false);
  }

  useEffect(() => {
    getCallLogList();
    setIsOpen(true);
  }, []);

  const togglePopup = () => setIsOpen(!isOpen);

  return (
    <div className="container">
     
       
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-4 md:p-8 rounded-lg w-full "
          >
            <button
              className="absolute top-2 right-2 text-lg font-semibold p-2"
              onClick={togglePopup}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4">Call Logs</h2>
           
            <div className="overflow-auto h-96">
              <table className="min-w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Call ID</th>
                    <th className="px-6 py-3">Created At</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Phone Number</th>
                    <th className="px-6 py-3">Recording</th>
                    <th className="px-6 py-3">Transcript</th>
                  </tr>
                </thead>
                <tbody>
                  {callLogList.map((item, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4">{index+1}</td>
                      <td className="px-6 py-4">
                        {item.callId.slice(0, 8)}...
                        {/* <CopyToClipboard text={item.callId}> */}
                          <button className="ml-2">
                            <Clipboard size={16} />
                          </button>
                        {/* </CopyToClipboard> */}
                      </td>
                      <td className="px-6 py-4">{moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
                      <td className="px-6 py-4">{item.duration}</td>
                      <td className="px-6 py-4">{item.category}</td>
                      <td className="px-6 py-4">{item.phone_number}</td>
                      <td className="px-6 py-4">
                        <a href={item.supabase_recording_url} target="_blank" rel="noopener noreferrer">
                            <FileAudio size={20} />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setactiveCallTranscript({audio : item.supabase_recording_url,preformatTranscript :  item.transcript_json})}>
                          <FileText size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && (
              <div className="flex justify-center mt-4">
                <button onClick={() => getCallLogList(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Load More
                </button>
              </div>
            )}
            {loading && (
              <div className="flex justify-center mt-4">
                <p>Loading...</p>
              </div>
            )}
          </div>
      {selectedTranscript && (
        <TranscriptPopup transcript={selectedTranscript} onClose={() => setSelectedTranscript(null)} />
      )}
    </div>
  );
};

export default CallLogPopupWithList;
