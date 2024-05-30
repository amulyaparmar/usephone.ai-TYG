// components/PopupWithList.js
// @ts-nocheck
// TYG Outerbase

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { usePopup } from "@/utils/store/conversationStore";

const CallStatsPopup = () => {
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
                <iframe src="https://app.outerbase.com/embed/chart?apiKey=a8769aeb-f14a-43c3-8acc-0e6e91fd97d9&chartID=723aa212-4d0b-4081-b68b-85f83c316028&sourceID=c68486a9-3a95-4fcd-9250-81dc7e5a3c86&baseID=e0a14b9d-0b75-48b5-9249-a616e8ac4d25&height=370" width="100%" height="370" frameBorder="0"></iframe>
              </div>
            </div>
          </div>
      </div>
    );

};

export default CallStatsPopup;
