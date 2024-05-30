// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import WaveSurfer from 'wavesurfer.js'
import { FaLink, FaForward } from 'react-icons/fa';
import { Forward, Link, SparkleIcon } from 'lucide-react';

const PlayerAndTranscript = ({ audio="", preformatTranscript=[
    // {
    //     type: 'bot',
    //     message: 'Praise god. Okay. It goes',
    //     time: 13.344999
    //   }
    {
        type: 'bot',
        message: 'Your transcript is loading!',
        time: 13.344999
      }
], hiddenTranscript=false, summary= "" }) => {
  const containerRef = useRef();
  const waveSurferRef = useRef({
    isPlaying: () => false,
  });
  const [isPlaying, toggleIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const [hideTranscript, setHideTranscript] = useState(hiddenTranscript)
  const [hideSummary, setHideSummary] = useState(true)

const [transcript, setTranscript] = useState(preformatTranscript);
useEffect(() => {
    setTranscript(preformatTranscript)
},[preformatTranscript])

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      responsive: true,
      barWidth: 2,
      barHeight: 2,
      cursorWidth: 0,
      waveColor: '#dfe6e9',
      progressColor: '#1e80e3', //#74b9ff
    });

    
    waveSurfer.load(audio);
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
      setTotalTime(waveSurfer.getDuration());
    });

    waveSurfer.on('audioprocess', () => {
      setCurrentTime(waveSurfer.getCurrentTime());
    });

    return () => {
      waveSurfer.destroy();
    };
  }, [audio]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatTranscriptEntry = (entry) => {
    if (entry.type === 'function_call') {
      return `Function Call: ${entry.name}: ${entry.args}`;
    }
    if (entry.type === 'function_result') {
      return `Result: ${entry.result}`;
    }
    return entry.message;
  };


  // transcript code TYG
  const transcriptRef = useRef(null); // Ref for the transcript container

  // Function to find the current transcript entry index
  const findCurrentTranscriptIndex = (currentTime) => {
    
    let currentIndex = transcript?.findIndex(entry => currentTime < entry.time) - 1;
    if ( currentIndex === -1 ) {
        return 0;
    }
    // If currentTime is beyond the last transcript entry's time, set to the last index
    if (currentIndex === -2 || (currentIndex < 0 && transcript.length > 0)) {
      currentIndex = transcript.length - 1;
    }
  
    return currentIndex;
  };
  

  // Get the index of the current transcript entry
  const currentTranscriptIndex = findCurrentTranscriptIndex(currentTime);

  // Effect to scroll the current transcript entry into view
  // useEffect(() => {
  //   if (transcriptRef.current && currentTranscriptIndex >= 0) {
  //     const currentElement = transcriptRef.current.children[currentTranscriptIndex];
  //     if (currentElement) {
  //       currentElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //     }
  //   }
  // }, [currentTranscriptIndex]);

  const onTranscriptClick = (time) => {
    const waveSurfer = waveSurferRef.current;
    if (waveSurfer) {
      const duration = waveSurfer.getDuration();
      waveSurfer.seekTo(time / duration);
      setCurrentTime(time);
    }
  };

  

  useEffect(() => {
    if (!hiddenTranscript & transcriptRef?.current && currentTranscriptIndex >= 0) {
      const entries = transcriptRef?.current.children;
      let scrollPosition = 0;
  
      // Calculate the position to scroll to
      for (let i = 0; i < currentTranscriptIndex; i++) {
        scrollPosition += entries[i].offsetHeight;
      }
      if (hiddenTranscript) {
        return;
      }
      // Adjust the scroll position of the transcript container
      transcriptRef.current.scrollTop = scrollPosition - transcriptRef?.current?.offsetHeight / 2;
    } else {
  
      if (transcriptRef?.current) {
        transcriptRef.current.scrollTop = 0;

      }
    }
  }, [currentTranscriptIndex]);


  return (
    <>
      <div className="flex items-center">
      <button
          onClick={() => {
              waveSurferRef.current.playPause();
              toggleIsPlaying(waveSurferRef.current.isPlaying());
          }}
          type="button"
          className="w-10 h-10 border-none bg-transparent"
      >
          {isPlaying ? 
              <div className='bg-transparent hover:text-blue-600 flex p-2 items-center justify-center rounded-md'>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <rect width="5" height="15" fill="currentColor"/>
                      <rect width="5" height="15" fill="currentColor"/>
                      <rect x="10" width="5" height="15" fill="currentColor"/>
                      <rect x="10" width="5" height="15" fill="currentColor"/>
                  </svg>
              </div>
              : 
              <div className='bg-transparent hover:text-blue-600 flex p-2 items-center justify-center rounded-md'>
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.396 7.12266C14.0895 7.50198 14.0895 8.49802 13.396 8.87734L2.22987 14.9848C1.56347 15.3493 0.75 14.867 0.75 14.1075V1.89254C0.75 1.13297 1.56347 0.65071 2.22987 1.01521L13.396 7.12266Z" fill="currentColor"/>
                  </svg>
              </div>
          }
      </button>
        <div className="ml-4 flex gap-2 ">
          <div>{formatTime(currentTime)}</div> /
          <div>{formatTime(totalTime)}</div>
          <a href={audio} target="_blank" className="text-gray hover:text-sky-500 hover:underline mt-1"> <Link /> </a>
        </div>
      </div>
      <div ref={containerRef} />
      
      <div className='flex gap-5 mb-3 mb-2'>
        <span onClick={() => setHideTranscript(!hideTranscript)} className='text-xs  hover:text-blue-500 hover:font-extrabold cursor-pointer'>TRANSCRIPT</span>
        <span onClick={() => setHideSummary(!hideSummary)} className='text-xs hover:text-blue-500 hover:font-extrabold cursor-pointer'>SUMMARY</span>
      </div>

      {!hideSummary && <div className="bg-blue-200/20 p-4 relative text-sm">
        <div className='flex my-2 font-bold'><SparkleIcon /> AI GENERATED SUMMARY</div>
        <p>{summary}</p>
      </div>
}
      {!hideTranscript && <div className="transcript-container" ref={transcriptRef} style={{ overflowY: 'auto', maxHeight: '300px' }}>
          {transcript?.map((entry, index) => (
            <div
              key={index}
              className={`transcript-entry ${index === currentTranscriptIndex ? 'current-entry' : ''} relative group ${index === currentTranscriptIndex ? 'bg-[#f0f0f0] rounded-lg text-black' : ''}`}
              style={{ padding: '10px',  }}
              onClick={() => onTranscriptClick(entry?.time)} 
            >
              <span className=''>{formatTranscriptEntry(entry)}</span>
              <div onClick={() => onTranscriptClick(entry?.time)}  className="hidden  group-hover:block absolute bottom-2 right-[15px] p-2 rounded-md cursor-pointer  bg-gray-200 hover:bg-gray-300"> <Forward />  </div>
            </div>
          ))}
        </div>
      }
    </>
  );
};

PlayerAndTranscript.propTypes = {
  audio: PropTypes.string.isRequired,
};

export default PlayerAndTranscript;