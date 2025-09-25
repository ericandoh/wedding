export type Language = 'en' | 'vi';

export interface Translations {
  // Common
  home: string;
  rsvp: string;
  schedule: string;
  aboutTheCouple: string;
  venue: string;
  thingsToDo: string;
  registry: string;
  qa: string;
  chatbot: string;
  petCats: string;
  
  // Login page
  hangAndEric: string;
  may232026: string;
  daNangVietnam: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  secretKeyphrase: string;
  hint: string;
  verifying: string;
  accessWebsite: string;
  invalidKeyphrase: string;
  somethingWentWrong: string;
  
  // Main page
  hangAndEricMain: string;
  may23rd2026: string;
  fusionResortsDaNang: string;

  // Schedule page
  scheduleTitle: string;
  joinUsForCelebrations: string;
  teaCeremony: string;
  hangsFamilialHome: string;
  saDecVietnam: string;
  may20th2026: string;
  groomProcession: string;
  exchangeOfGifts: string;
  lunch: string;
  westernWedding: string;
  fusionResortsAndSpa: string;
  may23rd2026Schedule: string;
  ceremony: string;
  dinner: string;
  afterparty: string;
  postWeddingBrunch: string;
  moreDetailsComing: string;

  // Our Story page
  aboutTheCoupleTitle: string;
  hangAndEricsLoveStory: string;
  ourEngagement: string;
  engagementStory: string;
  photoGallery: string;
  clickToView: string;

  // Venue page
  venueTitle: string;
  venueInformation: string;
  fusionResortsDaNangVenue: string;
  venueDetailsComing: string;

  // Things to Do page
  thingsToDoTitle: string;
  activitiesAndRecommendations: string;
  whatToDoInDaNang: string;
  localAttractionsComing: string;

  // Q&A page
  qaTitle: string;
  frequentlyAskedQuestions: string;
  weddingDetails: string;
  whenAndWhereWedding: string;
  weddingDetailsAnswer: string;
  whatShouldIWear: string;
  dressCodeAnswer: string;
  weatherInDaNang: string;
  weatherAnswer: string;
  travelAndAccommodation: string;
  doINeedVisa: string;
  visaAnswer: string;
  whereShouldIStay: string;
  accommodationAnswer: string;
  howToGetFromAirport: string;
  airportTransportAnswer: string;
  additionalQuestions: string;
  contactUs: string;
  contactUsAnswer: string;
  rsvpAndGifts: string;
  rsvpDeadline: string;
  rsvpDeadlineAnswer: string;
  giftRegistry: string;
  giftRegistryAnswer: string;
  canIBringPlusOne: string;
  plusOneAnswer: string;
  ceremonyAndReception: string;
  ceremonyIndoorsOrOutdoors: string;
  ceremonyLocationAnswer: string;
  whatTimeShouldIArrive: string;
  arrivalTimeAnswer: string;
  willThereBeFoodAndDrinks: string;
  foodAndDrinksAnswer: string;
  stillHaveQuestions: string;
  contactUsMessage: string;
  contactEmail: string;
  askChatbotButton: string;

  // Chatbot page
  chatbotTitle: string;
  askQuestionsAboutWedding: string;
  startConversation: string;
  askMeAnything: string;
  tryAsking: string;
  whatShouldIWearToWedding: string;
  whenAndWhereIsWedding: string;
  doINeedVisaForVietnam: string;
  askMeAnythingPlaceholder: string;
  sending: string;
  send: string;
  thinking: string;

  // Pet Cats page
  petCatsTitle: string;
  clickOnCatsToPet: string;
  updatingLeaderboard: string;
  playingAs: string;
  clearIdentity: string;
  tapCatsToPet: string;
  clickCatsToPet: string;
  theyLoveAttention: string;
  aspen: string;
  cypress: string;
  fiona: string;
  leaderboard: string;
  refresh: string;
  syncing: string;
  loadingLeaderboard: string;
  noLeaderboardData: string;
  yourStats: string;
  total: string;
  allCatsTotal: string;
  welcomeToPetCats: string;
  enterNameToJoin: string;
  yourName: string;
  joinLeaderboard: string;
  skip: string;
  loadingYourCatScores: string;

  // RSVP page
  rsvpTitle: string;
  rsvpSubtitle: string;
  rsvpLoading: string;
  rsvpEmailPrompt: string;
  emailAddress: string;
  emailPlaceholder: string;
  clear: string;
  rsvpButton: string;
  lookingUp: string;
  rsvpFormTitle: string;
  updateRsvpDetails: string;
  fillRsvpDetails: string;
  rsvpNote: string;
  editResponseNote: string;
  usingEmail: string;
  useDifferentEmail: string;
  yourNamePlaceholder: string;
  plusOneName: string;
  plusOneNamePlaceholder: string;
  canYouAttend: string;
  yes: string;
  no: string;
  email: string;
  phoneOptional: string;
  phonePlaceholder: string;
  whichEventCanYouJoin: string;
  selectEvent: string;
  westernWeddingMay23: string;
  teaCeremonyMay21: string;
  bothEvents: string;
  accommodationDetails: string;
  accommodationDetailsNote: string;
  transportationDetails: string;
  transportationDetailsNote: string;
  dietaryRestrictions: string;
  dietaryRestrictionsPlaceholder: string;
  accessibilityRestrictions: string;
  accessibilityRestrictionsPlaceholder: string;
  notificationPreferences: string;
  howWouldYouLikeToBeNotified: string;
  instagram: string;
  instagramHandlePlaceholder: string;
  emailNotification: string;
  sms: string;
  messenger: string;
  other: string;
  pleaseSpecify: string;
  submitRsvp: string;
  updateRsvp: string;
  submitting: string;
  updating: string;
  thankYouForResponse: string;
  thankYouMessage: string;
  editResponseAnytime: string;
  submitAnotherRsvp: string;
  pleaseFillRequiredFields: string;
  failedToLookupRsvp: string;
  failedToSubmitRsvp: string;
  pleaseEnterEmail: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    home: 'Home',
    rsvp: 'RSVP',
    schedule: 'Schedule',
    aboutTheCouple: 'About the Couple',
    venue: 'Venue',
    thingsToDo: 'Things to do',
    registry: 'Registry',
    qa: 'Q&A',
    chatbot: 'Chatbot',
    petCats: 'Pet Cats',
    
    // Login page
    hangAndEric: 'Hang and Eric',
    may232026: 'May 23, 2026',
    daNangVietnam: 'Da Nang, Vietnam',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    secretKeyphrase: 'Secret Keyphrase',
    hint: 'hint: cypress, aspen, fiona...',
    verifying: 'Verifying...',
    accessWebsite: 'Access Website',
    invalidKeyphrase: 'Invalid keyphrase. Please try again.',
    somethingWentWrong: 'Something went wrong. Please try again.',
    
    // Main page
    hangAndEricMain: 'Hang & Eric',
    may23rd2026: 'May 23rd, 2026',
    fusionResortsDaNang: 'Fusion Resorts Da Nang',

    // Schedule page
    scheduleTitle: 'Schedule',
    joinUsForCelebrations: 'Join us for our wedding celebrations',
    teaCeremony: 'Tea Ceremony',
    hangsFamilialHome: "Hang's Familial Home",
    saDecVietnam: 'Sa Dec, Vietnam',
    may20th2026: 'May 20th, 2026',
    groomProcession: 'Groom procession',
    exchangeOfGifts: 'Exchange of gifts',
    lunch: 'Lunch',
    westernWedding: 'Western Wedding',
    fusionResortsAndSpa: 'Fusion Resorts & Spa',
    may23rd2026Schedule: 'May 23rd, 2026',
    ceremony: 'Ceremony',
    dinner: 'Dinner',
    afterparty: 'Afterparty',
    postWeddingBrunch: '(optional) Post Wedding Brunch',
    moreDetailsComing: 'More details about timing and logistics will be shared closer to the events.',

    // Our Story page
    aboutTheCoupleTitle: 'About the Couple',
    hangAndEricsLoveStory: "Hang & Eric's Love Story",
    ourEngagement: 'Our Engagement',
    engagementStory: "Hang and Eric got engaged on March 3rd, 2025, at Hakone Gardens! But they actually first met on Hinge early 2022 (started talking together on Valentine's Day!)",
    photoGallery: 'Photo Gallery',
    clickToView: 'Click to view',

    // Venue page
    venueTitle: 'Venue',
    venueInformation: 'Information about our wedding venue',
    fusionResortsDaNangVenue: 'Fusion Resorts Da Nang',
    venueDetailsComing: 'Venue details and directions will be added here',

    // Things to Do page
    thingsToDoTitle: 'Things to Do',
    activitiesAndRecommendations: 'Activities and recommendations for our guests',
    whatToDoInDaNang: 'What to do in Da Nang',
    localAttractionsComing: 'Local attractions and activities will be added here',

    // Q&A page
    qaTitle: 'Q&A',
    frequentlyAskedQuestions: 'Frequently asked questions about our wedding',
    weddingDetails: 'Wedding Details',
    whenAndWhereWedding: 'When and where is the wedding?',
    weddingDetailsAnswer: "Our wedding will be held on May 23rd, 2026 at Fusion Resorts Da Nang, Vietnam. The ceremony will begin at TODO PM, followed by cocktail hour and reception. There is an optional tea ceremony in Sa Dec, Vietnam at Hang's familial home on May 20th, 2026.",
    whatShouldIWear: 'What should I wear?',
    dressCodeAnswer: "We'd love to see you dressed up! The dress code is TODO attire. For women: TODO dresses. For men: TODO suits.",
    weatherInDaNang: "What's the weather like in Da Nang in May?",
    weatherAnswer: "May is typically warm and sunny in Da Nang with temperatures around 25-30°C (77-86°F). It's the beginning of the dry season, so rain is less likely. We recommend bringing light, breathable clothing and sunscreen.",
    travelAndAccommodation: 'Travel & Accommodation',
    doINeedVisa: 'Do I need a visa to visit Vietnam?',
    visaAnswer: 'Most visitors need a visa to enter Vietnam. You can apply for an e-visa online and apply well in advance of your travel dates. https://evisa.gov.vn/. Please check the latest requirements for your country',
    whereShouldIStay: 'Where should I stay?',
    accommodationAnswer: 'We recommend staying at Fusion Resorts Da Nang or nearby hotels in the Da Nang area. The resort offers special rates for wedding guests - please contact us for details. There are also many beautiful beachfront hotels in the area.',
    howToGetFromAirport: 'How do I get from the airport to the venue?',
    airportTransportAnswer: 'Da Nang International Airport is about 20-30 minutes from Fusion Resorts. You can take a taxi, Grab (ride-sharing app), or arrange airport transfer through the resort. We can help coordinate group transportation if needed - see RSVP for details.',
    additionalQuestions: 'Additional Questions',
    contactUs: 'How can I contact you with questions?',
    contactUsAnswer: 'Feel free to reach out to us with any questions! You can contact Hang at TODO or Eric at TODO. We are here to help make your trip and our celebration as wonderful as possible!',
    rsvpAndGifts: 'RSVP & Gifts',
    rsvpDeadline: 'What is the RSVP deadline?',
    rsvpDeadlineAnswer: 'Please RSVP by TODO date. You can RSVP online through our website or contact us directly.',
    giftRegistry: 'Do you have a gift registry?',
    giftRegistryAnswer: 'Your presence at our wedding is the greatest gift of all! However, if you wish to give us a gift, we have created a registry with items we would love to have in our new home together.',
    canIBringPlusOne: 'Can I bring a plus one?',
    plusOneAnswer: 'TODO but yes.',
    ceremonyAndReception: 'Ceremony & Reception',
    ceremonyIndoorsOrOutdoors: 'Will the ceremony be indoors or outdoors?',
    ceremonyLocationAnswer: 'Our ceremony will be held outdoors on the beach at Fusion Resorts, weather permitting. In case of rain, we have a beautiful indoor backup location at the resort.',
    whatTimeShouldIArrive: 'What time should I arrive?',
    arrivalTimeAnswer: 'Please arrive by TODO PM to ensure you\'re seated before the ceremony begins at TODO PM. There will be a welcome reception area where you can enjoy refreshments before the ceremony.',
    willThereBeFoodAndDrinks: 'Will there be food and drinks?',
    foodAndDrinksAnswer: 'Absolutely! We\'ll have a cocktail hour with appetizers and drinks after the ceremony, followed by a full dinner reception. We\'ll accommodate dietary restrictions - please let us know when you RSVP.',
    stillHaveQuestions: 'Still Have Questions?',
    contactUsMessage: 'If you have any other questions or concerns, please don\'t hesitate to reach out to us!',
    contactEmail: 'You can contact us at:',
    askChatbotButton: 'Ask a chatbot!',

    // Chatbot page
    chatbotTitle: 'Chatbot',
    askQuestionsAboutWedding: 'Ask questions about our wedding',
    startConversation: 'Start a conversation...',
    askMeAnything: 'Ask me anything about the wedding!',
    tryAsking: 'Try asking:',
    whatShouldIWearToWedding: '"What should I wear to the wedding?"',
    whenAndWhereIsWedding: '"When and where is the wedding?"',
    doINeedVisaForVietnam: '"Do I need a visa for Vietnam?"',
    askMeAnythingPlaceholder: 'Ask me anything about the wedding...',
    sending: 'Sending...',
    send: 'Send',
    thinking: 'Thinking...',

    // Pet Cats page
    petCatsTitle: 'Pet Cats',
    clickOnCatsToPet: 'Click on the cats to pet them! You can also drag them around the house',
    updatingLeaderboard: 'Updating leaderboard...',
    playingAs: 'Playing as:',
    clearIdentity: 'Clear Identity',
    tapCatsToPet: 'Tap the cats to pet them or drag them around!',
    clickCatsToPet: 'Click on the cats to pet them! You can also drag them around the house',
    theyLoveAttention: 'They love attention and will show hearts when petted.',
    aspen: 'Aspen',
    cypress: 'Cypress',
    fiona: 'Fiona',
    leaderboard: '🏆 Leaderboard',
    refresh: 'Refresh',
    syncing: 'Syncing...',
    loadingLeaderboard: 'Loading leaderboard...',
    noLeaderboardData: 'No leaderboard data yet. Start petting cats to see the leaderboard!',
    yourStats: 'Your Stats',
    total: 'Total',
    allCatsTotal: '📊 All Cats Total',
    welcomeToPetCats: '🐱 Welcome to Pet Cats!',
    enterNameToJoin: 'Enter your name to join the leaderboard:',
    yourName: 'Your name',
    joinLeaderboard: 'Join Leaderboard',
    skip: 'Skip',
    loadingYourCatScores: 'Loading your cat scores...',

    // RSVP page
    rsvpTitle: 'RSVP',
    rsvpSubtitle: 'Please enter your email to get started',
    rsvpLoading: 'Loading your RSVP...',
    rsvpEmailPrompt: 'Please enter your email to get started',
    emailAddress: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    clear: 'Clear',
    rsvpButton: 'RSVP',
    lookingUp: 'Looking up...',
    rsvpFormTitle: 'RSVP',
    updateRsvpDetails: 'Update your RSVP details',
    fillRsvpDetails: 'Please fill out your RSVP details',
    rsvpNote: 'Note: We are still finalizing the details of the wedding. At this point, we only really need your RSVP + (+1) count and for you to save the date! We will keep you posted once we have accomodation / transportation / other details! (See notification preferences below).',
    editResponseNote: 'You can come back here anytime to edit your response!',
    usingEmail: 'Using email:',
    useDifferentEmail: 'Use different email',
    yourNamePlaceholder: 'Enter your full name',
    plusOneName: '+1 Name',
    plusOneNamePlaceholder: "Enter your +1's name (if applicable)",
    canYouAttend: 'Can you attend?',
    yes: 'Yes',
    no: 'No',
    email: 'Email',
    phoneOptional: 'Phone # (optional)',
    phonePlaceholder: 'Enter your phone number',
    whichEventCanYouJoin: 'Which event can you join?',
    selectEvent: 'Select an event',
    westernWeddingMay23: 'Western Wedding, May 23, Da Nang',
    teaCeremonyMay21: 'Tea Ceremony, May 21, Sa Dec',
    bothEvents: 'Both events',
    accommodationDetails: "I'd like details about accommodation at the venue directly",
    accommodationDetailsNote: '(This is being finalized)',
    transportationDetails: "I'd like details about transportation to the venue",
    transportationDetailsNote: '(This is being finalized)',
    dietaryRestrictions: 'Dietary Restrictions',
    dietaryRestrictionsPlaceholder: 'Please let us know about any dietary restrictions or allergies',
    accessibilityRestrictions: 'Accessibility Restrictions',
    accessibilityRestrictionsPlaceholder: 'Please let us know about any accessibility needs',
    notificationPreferences: 'How would you like to be notified?',
    howWouldYouLikeToBeNotified: 'How would you like to be notified?',
    instagram: 'Instagram (IG)',
    instagramHandlePlaceholder: 'Enter your Instagram handle (e.g., @username)',
    emailNotification: 'Email',
    sms: 'SMS',
    messenger: 'Messenger',
    other: 'Other',
    pleaseSpecify: 'Please specify...',
    submitRsvp: 'Submit RSVP',
    updateRsvp: 'Update RSVP',
    submitting: 'Submitting...',
    updating: 'Updating...',
    thankYouForResponse: 'Thank you for your response!',
    thankYouMessage: "Thank you, {name}! We've received your RSVP and can't wait to celebrate with you!",
    editResponseAnytime: 'You can come back here anytime to edit your response!',
    submitAnotherRsvp: 'Submit Another RSVP',
    pleaseFillRequiredFields: 'Please fill in all required fields (Name, Can you attend?, and Email)',
    failedToLookupRsvp: 'Failed to lookup RSVP. Please try again.',
    failedToSubmitRsvp: 'Failed to submit RSVP. Please try again.',
    pleaseEnterEmail: 'Please enter your email address',
  },
  vi: {
    // Common
    home: 'Trang chủ',
    rsvp: 'Xác nhận tham dự',
    schedule: 'Lịch trình',
    aboutTheCouple: 'Về cặp đôi',
    venue: 'Địa điểm',
    thingsToDo: 'Hoạt động',
    registry: 'Quà cưới',
    qa: 'Hỏi đáp',
    chatbot: 'Trò chuyện',
    petCats: 'Thú cưng',
    
    // Login page
    hangAndEric: 'Hang và Eric',
    may232026: '23 tháng 5, 2026',
    daNangVietnam: 'Đà Nẵng, Việt Nam',
    days: 'ngày',
    hours: 'giờ',
    minutes: 'phút',
    seconds: 'giây',
    secretKeyphrase: 'Mật khẩu bí mật',
    hint: 'gợi ý: cypress, aspen, fiona...',
    verifying: 'Đang xác thực...',
    accessWebsite: 'Truy cập trang web',
    invalidKeyphrase: 'Mật khẩu không hợp lệ. Vui lòng thử lại.',
    somethingWentWrong: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    
    // Main page
    hangAndEricMain: 'Hang & Eric',
    may23rd2026: '23 tháng 5, 2026',
    fusionResortsDaNang: 'Fusion Resorts Đà Nẵng',

    // Schedule page
    scheduleTitle: 'Lịch trình',
    joinUsForCelebrations: 'Tham gia cùng chúng tôi trong lễ cưới',
    teaCeremony: 'Lễ Trà',
    hangsFamilialHome: 'Nhà Gia Đình Hang',
    saDecVietnam: 'Sa Đéc, Việt Nam',
    may20th2026: '20 tháng 5, 2026',
    groomProcession: 'Đoàn rước chú rể',
    exchangeOfGifts: 'Trao đổi quà cưới',
    lunch: 'Tiệc trưa',
    westernWedding: 'Lễ Cưới Phương Tây',
    fusionResortsAndSpa: 'Fusion Resorts & Spa',
    may23rd2026Schedule: '23 tháng 5, 2026',
    ceremony: 'Lễ cưới',
    dinner: 'Tiệc tối',
    afterparty: 'Tiệc sau cưới',
    postWeddingBrunch: '(tùy chọn) Tiệc sáng sau cưới',
    moreDetailsComing: 'Thông tin chi tiết về thời gian và logistics sẽ được chia sẻ gần hơn với các sự kiện.',

    // Our Story page
    aboutTheCoupleTitle: 'Về Cặp Đôi',
    hangAndEricsLoveStory: 'Câu Chuyện Tình Yêu Của Hang & Eric',
    ourEngagement: 'Lễ Đính Hôn Của Chúng Tôi',
    engagementStory: 'Hang và Eric đính hôn vào ngày 3 tháng 3, 2025, tại Hakone Gardens! Nhưng thực ra họ gặp nhau lần đầu trên Hinge vào đầu năm 2022 (bắt đầu nói chuyện cùng nhau vào Ngày Lễ Tình Nhân!)',
    photoGallery: 'Thư Viện Ảnh',
    clickToView: 'Nhấp để xem',

    // Venue page
    venueTitle: 'Địa Điểm',
    venueInformation: 'Thông tin về địa điểm cưới của chúng tôi',
    fusionResortsDaNangVenue: 'Fusion Resorts Đà Nẵng',
    venueDetailsComing: 'Chi tiết địa điểm và chỉ đường sẽ được thêm vào đây',

    // Things to Do page
    thingsToDoTitle: 'Hoạt Động',
    activitiesAndRecommendations: 'Các hoạt động và gợi ý cho khách mời của chúng tôi',
    whatToDoInDaNang: 'Những việc cần làm ở Đà Nẵng',
    localAttractionsComing: 'Các điểm tham quan và hoạt động địa phương sẽ được thêm vào đây',

    // Q&A page
    qaTitle: 'Hỏi Đáp',
    frequentlyAskedQuestions: 'Những câu hỏi thường gặp về lễ cưới của chúng tôi',
    weddingDetails: 'Chi Tiết Lễ Cưới',
    whenAndWhereWedding: 'Khi nào và ở đâu sẽ tổ chức lễ cưới?',
    weddingDetailsAnswer: 'Lễ cưới của chúng tôi sẽ được tổ chức vào ngày 23 tháng 5, 2026 tại Fusion Resorts Đà Nẵng, Việt Nam. Lễ cưới sẽ bắt đầu lúc TODO PM, tiếp theo là tiệc cocktail và tiệc cưới. Có một buổi lễ trà tùy chọn tại Sa Đéc, Việt Nam tại nhà gia đình Hang vào ngày 20 tháng 5, 2026.',
    whatShouldIWear: 'Tôi nên mặc gì?',
    dressCodeAnswer: 'Chúng tôi rất muốn thấy bạn ăn mặc đẹp! Mã trang phục là TODO. Đối với phụ nữ: TODO váy. Đối với nam giới: TODO vest.',
    weatherInDaNang: 'Thời tiết ở Đà Nẵng vào tháng 5 như thế nào?',
    weatherAnswer: 'Tháng 5 thường ấm và nắng ở Đà Nẵng với nhiệt độ khoảng 25-30°C (77-86°F). Đây là đầu mùa khô, nên ít có khả năng mưa. Chúng tôi khuyên bạn nên mang quần áo nhẹ, thoáng khí và kem chống nắng.',
    travelAndAccommodation: 'Du Lịch & Chỗ Ở',
    doINeedVisa: 'Tôi có cần visa để thăm Việt Nam không?',
    visaAnswer: 'Hầu hết du khách cần visa để vào Việt Nam. Bạn có thể nộp đơn xin visa điện tử trực tuyến và nộp đơn trước ngày đi du lịch. https://evisa.gov.vn/. Vui lòng kiểm tra yêu cầu mới nhất cho quốc gia của bạn',
    whereShouldIStay: 'Tôi nên ở đâu?',
    accommodationAnswer: 'Chúng tôi khuyên bạn nên ở tại Fusion Resorts Đà Nẵng hoặc các khách sạn gần đó trong khu vực Đà Nẵng. Khu nghỉ dưỡng cung cấp giá đặc biệt cho khách mời đám cưới - vui lòng liên hệ với chúng tôi để biết chi tiết. Cũng có nhiều khách sạn đẹp ven biển trong khu vực.',
    howToGetFromAirport: 'Làm sao để đi từ sân bay đến địa điểm?',
    airportTransportAnswer: 'Sân bay Quốc tế Đà Nẵng cách Fusion Resorts khoảng 20-30 phút. Bạn có thể đi taxi, Grab (ứng dụng đi chung xe), hoặc sắp xếp đưa đón sân bay thông qua khu nghỉ dưỡng. Chúng tôi có thể giúp điều phối vận chuyển nhóm nếu cần - xem RSVP để biết chi tiết.',
    additionalQuestions: 'Câu Hỏi Bổ Sung',
    contactUs: 'Làm sao tôi có thể liên hệ với bạn để đặt câu hỏi?',
    contactUsAnswer: 'Đừng ngại liên hệ với chúng tôi với bất kỳ câu hỏi nào! Bạn có thể liên hệ Hang tại TODO hoặc Eric tại TODO. Chúng tôi ở đây để giúp làm cho chuyến đi và lễ kỷ niệm của chúng tôi trở nên tuyệt vời nhất có thể!',
    rsvpAndGifts: 'RSVP & Quà Tặng',
    rsvpDeadline: 'Hạn chót RSVP là khi nào?',
    rsvpDeadlineAnswer: 'Vui lòng RSVP trước ngày TODO. Bạn có thể RSVP trực tuyến thông qua trang web của chúng tôi hoặc liên hệ trực tiếp với chúng tôi.',
    giftRegistry: 'Bạn có danh sách quà tặng không?',
    giftRegistryAnswer: 'Sự có mặt của bạn tại lễ cưới của chúng tôi là món quà tuyệt vời nhất! Tuy nhiên, nếu bạn muốn tặng chúng tôi một món quà, chúng tôi đã tạo một danh sách quà tặng với những món đồ chúng tôi muốn có trong ngôi nhà mới của chúng tôi.',
    canIBringPlusOne: 'Tôi có thể mang người đi cùng không?',
    plusOneAnswer: 'TODO nhưng có.',
    ceremonyAndReception: 'Lễ Cưới & Tiệc Cưới',
    ceremonyIndoorsOrOutdoors: 'Lễ cưới sẽ được tổ chức trong nhà hay ngoài trời?',
    ceremonyLocationAnswer: 'Lễ cưới của chúng tôi sẽ được tổ chức ngoài trời trên bãi biển tại Fusion Resorts, tùy thuộc vào thời tiết. Trong trường hợp mưa, chúng tôi có một địa điểm dự phòng trong nhà đẹp tại khu nghỉ dưỡng.',
    whatTimeShouldIArrive: 'Tôi nên đến lúc mấy giờ?',
    arrivalTimeAnswer: 'Vui lòng đến trước TODO PM để đảm bảo bạn được ngồi trước khi lễ cưới bắt đầu lúc TODO PM. Sẽ có khu vực tiếp đón chào mừng nơi bạn có thể thưởng thức đồ uống trước lễ cưới.',
    willThereBeFoodAndDrinks: 'Sẽ có thức ăn và đồ uống không?',
    foodAndDrinksAnswer: 'Tất nhiên! Chúng tôi sẽ có giờ cocktail với món khai vị và đồ uống sau lễ cưới, tiếp theo là tiệc tối đầy đủ. Chúng tôi sẽ đáp ứng các hạn chế về ăn uống - vui lòng cho chúng tôi biết khi bạn RSVP.',
    stillHaveQuestions: 'Vẫn Còn Câu Hỏi?',
    contactUsMessage: 'Nếu bạn có bất kỳ câu hỏi hoặc lo ngại nào khác, đừng ngại liên hệ với chúng tôi!',
    contactEmail: 'Bạn có thể liên hệ với chúng tôi tại:',
    askChatbotButton: 'Hỏi chatbot!',

    // Chatbot page
    chatbotTitle: 'Trò Chuyện',
    askQuestionsAboutWedding: 'Đặt câu hỏi về lễ cưới của chúng tôi',
    startConversation: 'Bắt đầu cuộc trò chuyện...',
    askMeAnything: 'Hỏi tôi bất cứ điều gì về lễ cưới!',
    tryAsking: 'Thử hỏi:',
    whatShouldIWearToWedding: '"Tôi nên mặc gì đến lễ cưới?"',
    whenAndWhereIsWedding: '"Khi nào và ở đâu sẽ tổ chức lễ cưới?"',
    doINeedVisaForVietnam: '"Tôi có cần visa cho Việt Nam không?"',
    askMeAnythingPlaceholder: 'Hỏi tôi bất cứ điều gì về lễ cưới...',
    sending: 'Đang gửi...',
    send: 'Gửi',
    thinking: 'Đang suy nghĩ...',

    // Pet Cats page
    petCatsTitle: 'Thú Cưng',
    clickOnCatsToPet: 'Nhấp vào những chú mèo để vuốt ve chúng! Bạn cũng có thể kéo chúng đi khắp nhà',
    updatingLeaderboard: 'Đang cập nhật bảng xếp hạng...',
    playingAs: 'Đang chơi với tên:',
    clearIdentity: 'Xóa Danh Tính',
    tapCatsToPet: 'Chạm vào những chú mèo để vuốt ve hoặc kéo chúng xung quanh!',
    clickCatsToPet: 'Nhấp vào những chú mèo để vuốt ve chúng! Bạn cũng có thể kéo chúng đi khắp nhà',
    theyLoveAttention: 'Chúng thích được chú ý và sẽ hiển thị trái tim khi được vuốt ve.',
    aspen: 'Aspen',
    cypress: 'Cypress',
    fiona: 'Fiona',
    leaderboard: '🏆 Bảng Xếp Hạng',
    refresh: 'Làm Mới',
    syncing: 'Đang đồng bộ...',
    loadingLeaderboard: 'Đang tải bảng xếp hạng...',
    noLeaderboardData: 'Chưa có dữ liệu bảng xếp hạng. Hãy bắt đầu vuốt ve mèo để xem bảng xếp hạng!',
    yourStats: 'Thống Kê Của Bạn',
    total: 'Tổng',
    allCatsTotal: '📊 Tổng Tất Cả Mèo',
    welcomeToPetCats: '🐱 Chào mừng đến với Thú Cưng!',
    enterNameToJoin: 'Nhập tên của bạn để tham gia bảng xếp hạng:',
    yourName: 'Tên của bạn',
    joinLeaderboard: 'Tham Gia Bảng Xếp Hạng',
    skip: 'Bỏ Qua',
    loadingYourCatScores: 'Đang tải điểm mèo của bạn...',

    // RSVP page
    rsvpTitle: 'Xác Nhận Tham Dự',
    rsvpSubtitle: 'Vui lòng nhập email của bạn để bắt đầu',
    rsvpLoading: 'Đang tải RSVP của bạn...',
    rsvpEmailPrompt: 'Vui lòng nhập email của bạn để bắt đầu',
    emailAddress: 'Địa Chỉ Email',
    emailPlaceholder: 'Nhập địa chỉ email của bạn',
    clear: 'Xóa',
    rsvpButton: 'Xác Nhận Tham Dự',
    lookingUp: 'Đang tìm kiếm...',
    rsvpFormTitle: 'Xác Nhận Tham Dự',
    updateRsvpDetails: 'Cập nhật thông tin RSVP của bạn',
    fillRsvpDetails: 'Vui lòng điền thông tin RSVP của bạn',
    rsvpNote: 'Lưu ý: Chúng tôi vẫn đang hoàn thiện các chi tiết của lễ cưới. Tại thời điểm này, chúng tôi chỉ cần số lượng RSVP + (+1) của bạn và để bạn lưu ngày! Chúng tôi sẽ thông báo cho bạn khi có thông tin về chỗ ở / phương tiện di chuyển / các chi tiết khác! (Xem tùy chọn thông báo bên dưới).',
    editResponseNote: 'Bạn có thể quay lại đây bất cứ lúc nào để chỉnh sửa phản hồi của mình!',
    usingEmail: 'Đang sử dụng email:',
    useDifferentEmail: 'Sử dụng email khác',
    yourNamePlaceholder: 'Nhập họ tên đầy đủ của bạn',
    plusOneName: 'Tên Người Đi Cùng',
    plusOneNamePlaceholder: 'Nhập tên người đi cùng (nếu có)',
    canYouAttend: 'Bạn có thể tham dự không?',
    yes: 'Có',
    no: 'Không',
    email: 'Email',
    phoneOptional: 'Số Điện Thoại (tùy chọn)',
    phonePlaceholder: 'Nhập số điện thoại của bạn',
    whichEventCanYouJoin: 'Bạn có thể tham dự sự kiện nào?',
    selectEvent: 'Chọn một sự kiện',
    westernWeddingMay23: 'Lễ Cưới Phương Tây, 23 tháng 5, Đà Nẵng',
    teaCeremonyMay21: 'Lễ Trà, 21 tháng 5, Sa Đéc',
    bothEvents: 'Cả hai sự kiện',
    accommodationDetails: 'Tôi muốn biết chi tiết về chỗ ở tại địa điểm trực tiếp',
    accommodationDetailsNote: '(Đang được hoàn thiện)',
    transportationDetails: 'Tôi muốn biết chi tiết về phương tiện di chuyển đến địa điểm',
    transportationDetailsNote: '(Đang được hoàn thiện)',
    dietaryRestrictions: 'Hạn Chế Về Ăn Uống',
    dietaryRestrictionsPlaceholder: 'Vui lòng cho chúng tôi biết về bất kỳ hạn chế ăn uống hoặc dị ứng nào',
    accessibilityRestrictions: 'Hạn Chế Về Khả Năng Tiếp Cận',
    accessibilityRestrictionsPlaceholder: 'Vui lòng cho chúng tôi biết về bất kỳ nhu cầu tiếp cận nào',
    notificationPreferences: 'Bạn muốn được thông báo như thế nào?',
    howWouldYouLikeToBeNotified: 'Bạn muốn được thông báo như thế nào?',
    instagram: 'Instagram (IG)',
    instagramHandlePlaceholder: 'Nhập tên Instagram của bạn (ví dụ: @username)',
    emailNotification: 'Email',
    sms: 'SMS',
    messenger: 'Messenger',
    other: 'Khác',
    pleaseSpecify: 'Vui lòng chỉ rõ...',
    submitRsvp: 'Gửi RSVP',
    updateRsvp: 'Cập Nhật RSVP',
    submitting: 'Đang gửi...',
    updating: 'Đang cập nhật...',
    thankYouForResponse: 'Cảm ơn bạn đã phản hồi!',
    thankYouMessage: 'Cảm ơn bạn, {name}! Chúng tôi đã nhận được RSVP của bạn và không thể chờ đợi để ăn mừng cùng bạn!',
    editResponseAnytime: 'Bạn có thể quay lại đây bất cứ lúc nào để chỉnh sửa phản hồi của mình!',
    submitAnotherRsvp: 'Gửi RSVP Khác',
    pleaseFillRequiredFields: 'Vui lòng điền tất cả các trường bắt buộc (Tên, Bạn có thể tham dự?, và Email)',
    failedToLookupRsvp: 'Không thể tìm kiếm RSVP. Vui lòng thử lại.',
    failedToSubmitRsvp: 'Không thể gửi RSVP. Vui lòng thử lại.',
    pleaseEnterEmail: 'Vui lòng nhập địa chỉ email của bạn',
  },
};
