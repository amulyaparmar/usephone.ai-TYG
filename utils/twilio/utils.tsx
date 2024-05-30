import axios from 'axios'
import {supabase} from '../supabase/supabase_usePhoneAi_db'
import { createClient } from '@supabase/supabase-js'

export async function handleCallUpdates(obj : object) {
    console.log("handleCallUpdates",obj)
    const { data, error } = await supabase
    .from("calls")
    .upsert(obj)
    .select();
}

export async function fetchAudioFile(url : string) {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer'
    });
    return response.data;
  }
  
export async function uploadAudioToSupabase(fileName : any, fileData : any, contentType : any = 'audio/mpeg') {
    const { data, error } = await supabase.storage
      .from('twilioCallsRecordings')
      .upload(fileName, fileData, {
        contentType: contentType, // Or the correct MIME type for your audio file
      });
  
    if (error) {
      throw error;
    }
  
    return data;
}

export async function fetchAndUploadAudio(audioUrl : any, targetFileName : any) {
    try {
        const audioData = await fetchAudioFile(audioUrl);
        const uploadResult = await uploadAudioToSupabase(targetFileName, audioData);
        console.log('Upload successful:', uploadResult);
        return uploadResult?.path
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deepgram_gen_transcript(audioUrl : string) {
    const deepgramApiKey = "";

      
        const res_in_en = await fetch(
            'https://api.deepgram.com/v1/listen?model=nova-2&summarize=v2&diarize=true&smart_format=true&punctuate=true',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${deepgramApiKey}`,
                },
                body: JSON.stringify({
                    url: audioUrl,
                }),
            }
        )

        const url = "https://webhook.site/a04235d7-8cda-45e2-8f70-ed62ce52b524";

        const response = await res_in_en.json();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
        };

        fetch(url, options)
          
        return response
}


export function transformDeepgramParagraphsToUnifiedStructure(paragraphs:any) {
    return paragraphs?.map(paragraph => {
        // Concatenate all sentences into a single message
        const message = paragraph?.sentences.map(sentence => sentence?.text).join(' ');

        // Determine the type based on the speaker
        const type = paragraph.speaker === 0 ? 'bot' : 'user';

        return {
            type: type,
            message: message,
            time: paragraph.start
        };
    });
}