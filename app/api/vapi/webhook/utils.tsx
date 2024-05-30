export const converttranscriptStructure = (messages :any) => {
    const result: any[] = [];

  
    messages.forEach((message:any) => {
      const { role, message: text, time, endTime } = message;
      const speaker = role === 'user' ? 1 : 0;
      const start = time / 1000; // convert milliseconds to seconds
      const end = endTime / 1000; // convert milliseconds to seconds
      const numWords = text.split(' ').length;
      const sentences = text.split('. ').map((sentence:any, i:any) => {
        const sentenceStart = i === 0 ? start : undefined; // Use undefined to calculate later
        return {
          text: sentence + (i < text.split('. ').length - 1 ? '.' : ''),
          start: sentenceStart,
          end: undefined // Use undefined to calculate later
        };
      });
  
      result.push({ start, end, speaker, num_words: numWords, sentences });
    });
  
    // Calculate start and end times for sentences
    result.forEach(conversation => {
      const sentenceCount = conversation.sentences.length;
      const durationPerSentence = (conversation.end - conversation.start) / sentenceCount;
      conversation.sentences.forEach((sentence:any, i:any) => {
        sentence.start = conversation.start + (i * durationPerSentence);
        sentence.end = sentence.start + durationPerSentence;
      });
    });
  
    return result;
  };