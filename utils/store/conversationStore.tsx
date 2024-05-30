// @ts-nocheck
import { create } from "zustand";

const useStatsStore = create((set) => ({
  totalConversations: 0,
  responseRate: 0,
  aiCallsCount: 0,
  // ... other stats

  // Fetch and calculate stats for conversations
  fetchAndUpdateConversationsStats: async () => {
    // Fetch data and calculate stats
    const { data, error } = await supabase.from("conversations").select("*");
    if (error) {
      console.error("Error fetching conversations:", error);
    } else {
      const totalCount = data.length;
      // ... perform other calculations as needed
      set({ totalConversations: totalCount });
    }
  },

  // Fetch and calculate stats for AI Calls
  fetchAndUpdateAiCallsStats: async () => {
    // Fetch AI Calls and calculate stats
    // set({ aiCallsCount: calculatedCount });
  },

  // ... other stats fetching and updating functions
}));

export const useConversationStore = create((set) => ({
  conversation: [
    {
      role: "user",
      content: "hi",
    },
    {
      role: "assistant",
      content:
        "Hey there, thank you for taking our virtual tour at [[propertyName]]. We know some parts of the tour can be difficult to navigate for the first time so wanted to check in with you real quick. What part of the tour do you think needs the most improvement?",
    },
  ],
  setConversation: (newConversation) => set({ conversation: newConversation }),
  addToConversation: (message) =>
    set((state) => ({ conversation: [...state.conversation, message] })),
  addArrToConversation: (messageArr) =>
    set((state) => ({ conversation: [...state.conversation, ...messageArr] })),
}));

export const useQueuedJobsDataStore = create((set) => ({
  queuedJobs: [],
  setQueuedJobs: (queuedJobs) => set({ queuedJobs }),
  updateQueuedJobsList: (queuedJobsToUpdate) => {
    set((state) => {
      const updatedQueuedJobsList = [...state.notifications];
      const queuedJobsIndex = updatedQueuedJobsList.findIndex(
        (queuedJobs) => queuedJobsToUpdate.id === queuedJobs.id,
      );

      if (queuedJobsIndex !== -1) {
        updatedQueuedJobsList[queuedJobsIndex] = queuedJobsToUpdate;
      }

      return { queuedJobs: updatedQueuedJobsList };
    });
  },
}));

export const useNotificationDataStore = create((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  updateNotificationsList: (notificationToUpdate) => {
    set((state) => {
      const updatedNotificationsList = [...state.notifications];
      const notificationIndex = updatedNotificationsList.findIndex(
        (notification) => notificationToUpdate.id === notification.id,
      );

      if (notificationIndex !== -1) {
        updatedNotificationsList[notificationIndex] = notificationToUpdate;
      }

      return { notifications: updatedNotificationsList };
    });
  },
}));

export const useContactDataStore = create((set) => ({
  contacts: [],
  activeContact: {},
  setActiveContact: (activeContact) => set({ activeContact }),
  setContacts: (contacts) => set({ contacts }),
  updateContactsList: (contactToUpdate) => {
    set((state) => {
      const updatedContactsList = [...state.contacts];
      const contactIndex = updatedContactsList.findIndex(
        (contact) => contactToUpdate.id === contact.id,
      );

      console.log("contactIndex from updateContactsList: ", contactIndex);

      if (contactIndex !== -1) {
        updatedContactsList[contactIndex] = contactToUpdate;
      }
      console.log(
        "contactIndex list from updateContactsList: ",
        updatedContactsList,
      );

      return { contacts: updatedContactsList };
    });
  },
  deleteFromContactsList: (contactToDelete) => {
    set((state) => {
      const updatedContactsList = [...state.contacts];
      const contactIndex = updatedContactsList.findIndex(
        (contact) => contactToDelete.id === contact.id,
      );

      if (contactIndex !== -1) {
        updatedContactsList.splice(contactIndex, 1);
      }

      return { contacts: updatedContactsList };
    });
  },
  appendToContactsList: () => {
    set((state) => {
      const updatedContactsList = [...state.contacts, state.activeContact];
      return { contacts: updatedContactsList };
    });
  },
}));

export const useMessageStore = create((set) => ({
  newMessage: "",
  setNewMessage: (newMessage) => set({ newMessage }),
}));
export const useSubjectStore = create((set) => ({
  subject: "",
  setSubject: (subject) => set({ subject }),
}));

export const usePopupVisibleStore = create((set) => ({
  popupVisible: true,
  setPopupVisible: (popupVisible) => set({ popupVisible }),
}));

export const useTransferCallsStore = create((set) => ({
  transferCalls: [],
  setTransferCalls: (transferCalls) => set({ transferCalls }),
}));

export const useOngoingCallStore = create((set) => ({
  ongoingCalls: {}, //{"fdf63148-fdfd-43ea-83d7-9b98c5b1dfcd": {name: "Ivory", number: "16503347681", transcript:[{"assistant":"hii"},{ "user": "hey"}]}},
  setOngoingCalls: (ongoingCalls) => set({ ongoingCalls }),
}));

export const useVoiceStore = create((set) => ({
  sortByVoice: "steve-11labs",
  setSortByVoice: (sortByVoice) => set({ sortByVoice }),
}));

export const useModelStore = create((set) => ({
  sortByModel: "gpt-4",
  setSortByModel: (sortByModel) => set({ sortByModel }),
}));

export const usePreferenceStore = create((set) => ({
  transferPhone: "",
  setTransferPhone: (transferPhone) => set({ transferPhone }),
}));

export const usePromptDataStore = create((set) => ({
  promptData: {},
  setPromptData: (promptData) => set({ promptData }),
}));

export const useLoginStore = create((set) => ({
  login: false,
  setLogin: (login) => set({ login }),
}));

export const useMarketListPopup = create((set) => ({
  showMarketList: true,
  setShowMarketList: (showMarketList) => set({ showMarketList }),
}));

export const usePopup = create((set) => ({
  popup: '',
  setPopup: (popup) => set({ popup }),
}));


export const useCallLogsPopup = create((set) => ({
  showCallLogs: false,
  setShowCallLogs: (showCallLogs) => set({ showCallLogs }),
}));

export const useContactStore = create((set) => ({
  activeCallSid: "",
  fromCallerId: "+17604630314",
  phoneNumber: "",
  marketKey: '',
  powerDialNumbers: [],
  setActiveCallSid: (activeCallSid) => set({ activeCallSid }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setFromCallerId: (fromCallerId) => set({ fromCallerId }),
  setMarketKey: (marketKey) => set({ marketKey }),
  setPowerDialNumbers: (powerDialNumbers) => set({ powerDialNumbers }),
}));

export const useVapiStore = create((set) => ({
  initObj: "",
  setInitObj: (initObj) => set({ initObj }),
}));

export const useFunctionsStore = create((set) => ({
  functions: "",
  setFunctions: (functions) => set({ functions }),
}));

export const useCorpusStore = create((set) => ({
  corpus: "",
  setFunctions: (corpus) => set({ corpus }),
}));

export const useShowSequences = create((set) => ({
  showSequences: false,
  setShowSequences: (showSequences) => set({ showSequences }),
}));

export const useCurrStep = create((set) => ({
  currStep: 0,
  setCurrStep: (currStep) => set({ currStep }),
}));

export const useBuildState = create((set) => ({
  buildState: true,
  setBuildState: (buildState) => set({ buildState }),
}));

export const useContactsState = create((set) => ({
  contactsState: [],
  setContactsState: (contactsState) => set({ contactsState }),
}));

export const useSearchFilterState = create((set) => ({
  searchFilterState: [
    { name: "Ivory", email: "ivoryttang@gmail.com", number: "16503347681" },
    { name: "Agape", email: "parmar.amulya@gmail.com", number: "15862588588" },
  ],
  setSearchFilterState: (searchFilterState) => set({ searchFilterState }),
}));

export const useTemplateStore = create((set) => ({
  template: {
    template_id: "",
    name: "EXAMPLE (please select one of your sequences to begin editing...)",
    created_at: "",
    updated_at: "",
    sequence: [
      {
        waitTime: "1",
        className: "Call",
        loop: false,
        messages: [],
        prompt:
          "OPENING LINE: \n Hey Sam, it's Daniel from Ivy Row at Troy here. I saw that you took a virtual tour with us of Ivy Row at Troy recently and wanted to offer my help in getting you started on the next step which is the application? Do you have any questions at this point I can help answer or would you want help getting connected with the team? \n\n CONVERSATION INTENT: \n /* Pause and wait for customer to respond. After customer responds with their intent, transfer them to the team if they ask for that. Otherwise, answer their question and then ask the prospect, is there anything about our property or leasing process you didn't understand?  **/ You must answer questions, in sentence format, only with this context provided below for the apartment Ivy Row at Troy. You are a helpful leasing assistant. Do not answer questions not related to our apartment. If the answer is not provided by context, please say you dont have that answer, ensure to note that you suggest talking to a team on our phone number (334) 249-7106 , send an email to  ivyrowtroy@caliberliving.com, or requesting a call back.",
      },
      {
        waitTime: "1",
        className: "Email",
        loop: false,
        messages: [],
        prompt:
          "SUBJECT: \n Virtual Tour: Next Steps \n BODY: \n Thanks for taking a virtual tour at Ivy Row at Troy. Would you like any help with the application process? \n",
      },
      {
        waitTime: "1",
        className: "Text",
        loop: false,
        messages: [],
        prompt:
          "FIRST TEXT: \n Hi Sam, Daniel from Ivy Row at Troy here. Thanks for taking our virtual tour! Feel free to ask me any questions you may have :)  \n INTENT: \n Your are a virtual leasing concierge. Your only job is to answer quesitons the prospect has given the information you know. \n",
      },
    ],
    variables: {
      name: "",
      email: "",
      number: "",
      teamNumber: "",
      teamEmails: [],
    },
    functions: [],
    goals: [],
    enrich: {
      addCorpus:
        "Ivy Row at Troy is Troy Alabama's only off-campus student living that offers houses and townhomes with porches, well-manicured yards and resident + guest parking in front of your residence. Living at this pet-friendly community means you have the privacy of no neighbors above or below you and a yard for your furry friend. The Ivy at Troy features over 12,000 square-feet of customized amenities and includes two- to four -bedroom houses and townhomes, each bedroom with its own bathroom with an additional 1/2 guest bath in select floor plans. The property is a short private shuttle ride to shops, restaurants, entertainment or campus, and has shuttles that arrive every ~15 minutes.\n \nOur 24x7 access gym as well as regular friends who meet in our ping pong table, pool table or clubhouse, we are confident you will find a home away from home. \n\nBusiness hours are Mon - Fri:  10 AM - 6 PM, Sat (12PM - 5 PM) and Sun: Closed.   If prospect asks about business hours, also provide phone number (334) 249-7106 and suggest call back or schedule tour below.\n \nWe lease by the bedroom and currently have the following selection of homes available. Here is our availability for the August 6, 2023 to July 19, 2024 term:\n \n[Currently Sold out ] 2 Bedroom Townhomes : Approximately $825/bed/mo\n[Few Available] 3 Bedroom Townhomes (Mckinley or Hampton)  Approximately $699/bed/mo\n[Couple Available ] 4 Bedroom Townhomes  Approximately $610/bed/mo\n \nAll our units are unfurnished, so you can make this place your own. So yes you do need to bring your own furniture.\n\nWe have a $15 dollar pet policy, per pet.\n \nYou can match roommates within a townhome, and we do allow for double occupancy in a room!\n \nOur best current special is: Please request a callback below for new special information. \n \nResident parking is included with rent.\n \nWe primarily offer only 12 month lease terms. However, if you are potentially looking to move-in sooner, we sometimes can sign for immediate move-ins till the end of the term. I recommend scheduling a call back to have a team member talk about the specifics for you.\n \nAmenities include:\n- Townhomes & Cottage style living\n- Patios and balconies available in select floor plans\n- Pet-friendly\n- Spacious, neighborhood living\n- Open green space\n- Ample resident parking\n- Resort-style pool with sundeck\n- Outdoor grilling stations + fire pit\n- 24 hour indoor fitness center\n- 1 private study lounges\n- Free coffee bar\n- Community Rewards loyalty program\n- On-site courtesy patrol\n- 24 hour emergency maintenance\n- Roommate matching available\n \n2-4 Bedroom Student Apartments Amenities include:\n- 2- 4 Private bedroom suites with bathrooms\n- Free high-speed Wi-Fi\n- Free water, sewage and trash included\n- Additional 1/2 bath in select units\n- Hardwood-style floors\n- Spacious closets\n- Full size washer and dryer\n- Patios and balconies in select units\n \nWe don't have an elevator because all our units are townhomes, and several of our units are available at the ground level of the Townhome and ADA compliant.\n \nYour address is: 826 S 3 Notch St, Troy, AL 36081\n \nSome great nearby restaurants Flo's Kitchen, B Graves, Mama Goldberg's Deli, and Rodeo Mexican Restaraunt . We are right next door to the bus stop, and have a campus shuttle that picks up from our property every ~15 minutes. so we are literally a couple minutes to campus, the nearby grocery locations  Publix and Piggly Wiggly, about 5 minutes away from Troy Campus.\n'",
    },
  },

  setVariables: (newVariables) => {
    set((state) => ({
      template: {
        ...state.template,
        variables: newVariables,
      },
    }));
  },
  setFunctions: (newFunctions) => {
    set((state) => ({
      template: {
        ...state.template,
        functions: newFunctions,
      },
    }));
  },
  setTemplate: (template) => {
    set((state) => ({
      template: template,
    }));
  },
}));

export const useConvoStore = create((set, get) => ({
  convo: {
    template_id: "",
    number: "",
    email: "",
    name: "",
    liveTransferNumber: "",
    created_at: "",
    updated_at: "",
    sequence: [
      {
        waitTime: "1",
        className: "Call",
        loop: false,
        messages: [],
        prompt:
          "OPENING LINE: \n Hey Sam, it's Daniel from Ivy Row at Troy here. I saw that you took a virtual tour with us of Ivy Row at Troy recently and wanted to offer my help in getting you started on the next step which is the application? Do you have any questions at this point I can help answer or would you want help getting connected with the team? \n\n CONVERSATION INTENT: \n /* Pause and wait for customer to respond. After customer responds with their intent, transfer them to the team if they ask for that. Otherwise, answer their question and then ask the prospect, is there anything about our property or leasing process you didn't understand?  **/ You must answer questions, in sentence format, only with this context provided below for the apartment Ivy Row at Troy. You are a helpful leasing assistant. Do not answer questions not related to our apartment. If the answer is not provided by context, please say you dont have that answer, ensure to note that you suggest talking to a team on our phone number (334) 249-7106 , send an email to  ivyrowtroy@caliberliving.com, or requesting a call back.",
      },
      {
        waitTime: "1",
        className: "Email",
        loop: false,
        messages: [],
        prompt:
          "SUBJECT: \n Virtual Tour: Next Steps \n BODY: \n Thanks for taking a virtual tour at Ivy Row at Troy. Would you like any help with the application process? \n",
      },
      {
        waitTime: "1",
        className: "Text",
        loop: false,
        messages: [],
        prompt:
          "FIRST TEXT: \n Hi Sam, Daniel from Ivy Row at Troy here. Thanks for taking our virtual tour! Feel free to ask me any questions you may have :)  \n INTENT: \n Your are a virtual leasing concierge. Your only job is to answer quesitons the prospect has given the information you know. \n",
      },
    ],
    variables: {
      name: "",
      email: "",
      number: "",
      teamNumber: "",
      teamEmails: [],
    },
    functions: [],
    goals: [],
    enrich: {
      addCorpus:
        "Ivy Row at Troy is Troy Alabama's only off-campus student living that offers houses and townhomes with porches, well-manicured yards and resident + guest parking in front of your residence. Living at this pet-friendly community means you have the privacy of no neighbors above or below you and a yard for your furry friend. The Ivy at Troy features over 12,000 square-feet of customized amenities and includes two- to four -bedroom houses and townhomes, each bedroom with its own bathroom with an additional 1/2 guest bath in select floor plans. The property is a short private shuttle ride to shops, restaurants, entertainment or campus, and has shuttles that arrive every ~15 minutes.\n \nOur 24x7 access gym as well as regular friends who meet in our ping pong table, pool table or clubhouse, we are confident you will find a home away from home. \n\nBusiness hours are Mon - Fri:  10 AM - 6 PM, Sat (12PM - 5 PM) and Sun: Closed.   If prospect asks about business hours, also provide phone number (334) 249-7106 and suggest call back or schedule tour below.\n \nWe lease by the bedroom and currently have the following selection of homes available. Here is our availability for the August 6, 2023 to July 19, 2024 term:\n \n[Currently Sold out ] 2 Bedroom Townhomes : Approximately $825/bed/mo\n[Few Available] 3 Bedroom Townhomes (Mckinley or Hampton)  Approximately $699/bed/mo\n[Couple Available ] 4 Bedroom Townhomes  Approximately $610/bed/mo\n \nAll our units are unfurnished, so you can make this place your own. So yes you do need to bring your own furniture.\n\nWe have a $15 dollar pet policy, per pet.\n \nYou can match roommates within a townhome, and we do allow for double occupancy in a room!\n \nOur best current special is: Please request a callback below for new special information. \n \nResident parking is included with rent.\n \nWe primarily offer only 12 month lease terms. However, if you are potentially looking to move-in sooner, we sometimes can sign for immediate move-ins till the end of the term. I recommend scheduling a call back to have a team member talk about the specifics for you.\n \nAmenities include:\n- Townhomes & Cottage style living\n- Patios and balconies available in select floor plans\n- Pet-friendly\n- Spacious, neighborhood living\n- Open green space\n- Ample resident parking\n- Resort-style pool with sundeck\n- Outdoor grilling stations + fire pit\n- 24 hour indoor fitness center\n- 1 private study lounges\n- Free coffee bar\n- Community Rewards loyalty program\n- On-site courtesy patrol\n- 24 hour emergency maintenance\n- Roommate matching available\n \n2-4 Bedroom Student Apartments Amenities include:\n- 2- 4 Private bedroom suites with bathrooms\n- Free high-speed Wi-Fi\n- Free water, sewage and trash included\n- Additional 1/2 bath in select units\n- Hardwood-style floors\n- Spacious closets\n- Full size washer and dryer\n- Patios and balconies in select units\n \nWe don't have an elevator because all our units are townhomes, and several of our units are available at the ground level of the Townhome and ADA compliant.\n \nYour address is: 826 S 3 Notch St, Troy, AL 36081\n \nSome great nearby restaurants Flo's Kitchen, B Graves, Mama Goldberg's Deli, and Rodeo Mexican Restaraunt . We are right next door to the bus stop, and have a campus shuttle that picks up from our property every ~15 minutes. so we are literally a couple minutes to campus, the nearby grocery locations  Publix and Piggly Wiggly, about 5 minutes away from Troy Campus.\n'",
    },
    apiUser: "",
  },
  activeConvoId: "",
  activeConvoList: [],
  setConvo: (convo) => set({ convo }),
  clearSequenceMessages: (index) => {
    set((state) => {
      // Clone the current state to avoid mutating it directly
      const updatedConvo = { ...state.convo };

      // Check if the sequence at the specified index exists
      if (updatedConvo?.sequence?.[index]) {
        // Concatenate the new messages with the existing messages
        updatedConvo.sequence[index].messages = [];
      }

      return { convo: updatedConvo };
    });
  },
  appendToSequenceMessages: (index, messagesToAppend) => {
    set((state) => {
      // Clone the current state to avoid mutating it directly
      const updatedConvo = { ...state.convo };

      // Check if the sequence at the specified index exists
      if (updatedConvo?.sequence?.[index]) {
        // Concatenate the new messages with the existing messages
        updatedConvo.sequence[index].messages = [
          ...updatedConvo?.sequence?.[index]?.messages,
          ...messagesToAppend,
        ];
      }

      return { convo: updatedConvo };
    });
  },

  fillConvoFromSupabase: async (supa_id = "demo") => {
    let { data: convo } = await supabase
      .from("conversations")
      .select("*")
      .eq("template_id", supa_id);
    set({ convo });
  },
  setActiveConvoId: (activeConvoId) => set({ activeConvoId }),
  setActiveConvoList: (activeConvoList) => set({ activeConvoList }),
  updateActiveConvoList: (convo) => {
    set((state) => {
      const updatedActiveConvoList = [...state.activeConvoList];
      const convoIndex = updatedActiveConvoList.findIndex(
        (activeConvo) => activeConvo.activeConvoId === convo.activeConvoId,
      );

      if (convoIndex !== -1) {
        updatedActiveConvoList[convoIndex] = {
          ...updatedActiveConvoList[convoIndex],
          ...convo,
        };
      }

      return { activeConvoList: updatedActiveConvoList };
    });
  },
  deleteFromActiveConvoList: (activeConvoId) => {
    set((state) => {
      const updatedActiveConvoList = [...state.activeConvoList];
      const convoIndex = updatedActiveConvoList.findIndex(
        (activeConvo) => activeConvo.activeConvoId === activeConvoId,
      );

      if (convoIndex !== -1) {
        updatedActiveConvoList.splice(convoIndex, 1);
      }

      return { activeConvoList: updatedActiveConvoList };
    });
  },
  appendToActiveConvoList: (convo) => {
    set((state) => {
      const updatedActiveConvoList = [convo, ...state.activeConvoList];
      return { activeConvoList: updatedActiveConvoList };
    });
  },
  getActiveConvo: (activeConvoId, activeConvoList) => {
    if (!activeConvoId) {
      console.log("no convo id here!");
      return false;
    }
    let activeConvoObj = activeConvoList.filter(
      (item) => item?.convo_id === activeConvoId,
    )[0];

    // Use convo_id to get convo from activeConvoList
    //console.log("activeConvoId TYG: ", activeConvoId, activeConvoObj)

    return activeConvoObj;
  },
  getConvosByContactId: (contactId) => {
    if (!contactId) {
      console.log("no contact id here!");
      return [];
    }

    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    search_params.set("contact_id", contactId);
    history.replaceState({}, "", url.toString());

    const state = get();
    const activeConvoList = state.activeConvoList;

    let activeConvoListFiltered = activeConvoList.filter(
      (item) => item?.contactId === contactId,
    );
    // console.log("activeConvoId TYG: ", activeConvoListFiltered, activeConvoList, contactId)

    return activeConvoListFiltered;
  },
}));

// ANALYTICS STORE
export const useAnalyticsStore = create((set) => ({
  sortByTime: "24",
  setSortByTime: (sortByTime) => set({ sortByTime }),
  totalConversations: "--",
  setTotalConversations: (totalConversations) => set({ totalConversations }),
  responseRate: "--",
  setResponseRate: (responseRate) => set({ responseRate }),
  convosCreated: "--",
  setConvosCreated: (convosCreated) => set({ convosCreated }),
  responsesReceived: "--",
  setResponsesReceived: (responsesReceived) => set({ responsesReceived }),
  humanCalls: "--",
  setHumanCalls: (humanCalls) => set({ humanCalls }),
  aiCalls: "--",
  setAiCalls: (aiCalls) => set({ aiCalls }),
  totalConversationsDelta: "--",
  setTotalConversationsDelta: (totalConversationsDelta) =>
    set({ totalConversationsDelta }),
  responseRateDelta: "--",
  setResponseRateDelta: (responseRateDelta) => set({ responseRateDelta }),
  convosCreatedDelta: "--",
  setConvosCreatedDelta: (convosCreatedDelta) => set({ convosCreatedDelta }),
  responsesReceivedDelta: "--",
  setResponsesReceivedDelta: (responsesReceivedDelta) =>
    set({ responsesReceivedDelta }),
  humanCallsDelta: "--",
  setHumanCallsDelta: (humanCallsDelta) => set({ humanCallsDelta }),
  aiCallsDelta: "--",
  setAiCallsDelta: (aiCallsDelta) => set({ aiCallsDelta }),
  chartDataConvosCreated: [],
  setChartDataConvosCreated: (chartDataConvosCreated) =>
    set({ chartDataConvosCreated }),
  chartDataConvosCreated: [],
  setChartDataTotalConversations: (chartDataConvosCreated) =>
    set({ chartDataConvosCreated }),
  chartDataResponseRate: [],
  setChartDataResponseRate: (chartDataResponseRate) =>
    set({ chartDataResponseRate }),
  chartDataResponsesReceived: [],
  setChartDataResponsesReceived: (chartDataResponsesReceived) =>
    set({ chartDataResponsesReceived }),
  chartDataAiCalls: [],
  setChartDataAiCalls: (chartDataAiCalls) => set({ chartDataAiCalls }),
  chartDataHumanCalls: [],
  setChartDataHumanCalls: (chartDataHumanCalls) => set({ chartDataHumanCalls }),
}));

export const useVocabStore = create((set) => ({
  wordBank: [
    {
      word: "aberration",
      definition: "a departure from what is normal, usual, or expected",
    },
    { word: "benevolent", definition: "kindly, charitable" },
    { word: "cacophony", definition: "a harsh, discordant mixture of sounds" },
    { word: "debilitate", definition: "to weaken, to make feeble" },
    {
      word: "ebullient",
      definition: "overflowing with enthusiasm or excitement",
    },
    {
      word: "facetious",
      definition:
        "treating serious issues with deliberately inappropriate humor",
    },
    { word: "gregarious", definition: "fond of company, sociable" },
    { word: "harangue", definition: "a lengthy and aggressive speech" },
    {
      word: "iconoclast",
      definition:
        "a person who attacks or criticizes cherished beliefs or institutions",
    },
    {
      word: "juxtapose",
      definition: "to place or deal with close together for contrasting effect",
    },
    {
      word: "kowtow",
      definition: "to act in an excessively subservient manner",
    },
    {
      word: "languid",
      definition:
        "displaying or having a disinclination for physical exertion or effort",
    },
    { word: "mellifluous", definition: "sweet or musical; pleasant to hear" },
    {
      word: "nadir",
      definition:
        "the lowest point in the fortunes of a person or organization",
    },
    {
      word: "obfuscate",
      definition: "to deliberately make something difficult to understand",
    },
    {
      word: "panacea",
      definition: "a solution or remedy for all difficulties or diseases",
    },
    {
      word: "quixotic",
      definition: "extremely idealistic; unrealistic and impractical",
    },
    {
      word: "recalcitrant",
      definition:
        "having an obstinately uncooperative attitude towards authority or discipline",
    },
    {
      word: "sycophant",
      definition:
        "a person who acts obsequiously towards someone important in order to gain advantage",
    },
    {
      word: "ubiquitous",
      definition: "present, appearing, or found everywhere",
    },
  ],
}));

export default useConversationStore;
