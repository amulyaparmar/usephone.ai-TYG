// components/PopupWithList.js
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { usePopup } from "@/utils/store/conversationStore";

const LiveWebinarPopup = () => {
  // const [isOpen, setIsOpen] = useState(true);
  const {popup, setPopup} = usePopup();
  
  useEffect(() => {
  }, []);

  const closePopup = () => setPopup("");

  return (
    <div className="container ">
        <div
          onClick={() => {
            closePopup();
          }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="relative bg-white p-4 md:p-8 rounded-lg w-3/4 max-w-4xl"
          >
            <button
              className="absolute top-2 right-2 text-lg font-semibold p-2"
              onClick={closePopup}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4">AI Rubric</h2>
            
            <div className="overflow-y-auto h-96 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <img src="https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/09ae78a4-27ed-4c7b-e6f1-5cb5f56f4d00/big" className="w-full" />
            </div>
          </div>
        </div>
    </div>
  );
};

export default LiveWebinarPopup;
