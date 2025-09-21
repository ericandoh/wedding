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
  rsvpAndGifts: string;
  rsvpDeadline: string;
  rsvpDeadlineAnswer: string;
  giftRegistry: string;
  giftRegistryAnswer: string;
  additionalQuestions: string;
  contactUs: string;
  contactUsAnswer: string;

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
    rsvpAndGifts: 'RSVP & Gifts',
    rsvpDeadline: 'What is the RSVP deadline?',
    rsvpDeadlineAnswer: 'Please RSVP by TODO date. You can RSVP online through our website or contact us directly.',
    giftRegistry: 'Do you have a gift registry?',
    giftRegistryAnswer: 'Your presence at our wedding is the greatest gift of all! However, if you wish to give us a gift, we have created a registry with items we would love to have in our new home together.',
    additionalQuestions: 'Additional Questions',
    contactUs: 'How can I contact you with questions?',
    contactUsAnswer: 'Feel free to reach out to us with any questions! You can contact Hang at TODO or Eric at TODO. We are here to help make your trip and our celebration as wonderful as possible!',

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
    clickOnCatsToPet: 'Click on the cats to pet them!',
    updatingLeaderboard: 'Updating leaderboard...',
    playingAs: 'Playing as:',
    clearIdentity: 'Clear Identity',
    tapCatsToPet: 'Tap the cats to pet them or drag them around!',
    clickCatsToPet: 'Click on the cats to pet them or drag them around!',
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
    rsvpAndGifts: 'RSVP & Quà Tặng',
    rsvpDeadline: 'Hạn chót RSVP là khi nào?',
    rsvpDeadlineAnswer: 'Vui lòng RSVP trước ngày TODO. Bạn có thể RSVP trực tuyến thông qua trang web của chúng tôi hoặc liên hệ trực tiếp với chúng tôi.',
    giftRegistry: 'Bạn có danh sách quà tặng không?',
    giftRegistryAnswer: 'Sự có mặt của bạn tại lễ cưới của chúng tôi là món quà tuyệt vời nhất! Tuy nhiên, nếu bạn muốn tặng chúng tôi một món quà, chúng tôi đã tạo một danh sách quà tặng với những món đồ chúng tôi muốn có trong ngôi nhà mới của chúng tôi.',
    additionalQuestions: 'Câu Hỏi Bổ Sung',
    contactUs: 'Làm sao tôi có thể liên hệ với bạn để đặt câu hỏi?',
    contactUsAnswer: 'Đừng ngại liên hệ với chúng tôi với bất kỳ câu hỏi nào! Bạn có thể liên hệ Hang tại TODO hoặc Eric tại TODO. Chúng tôi ở đây để giúp làm cho chuyến đi và lễ kỷ niệm của chúng tôi trở nên tuyệt vời nhất có thể!',

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
    clickOnCatsToPet: 'Nhấp vào những chú mèo để vuốt ve chúng!',
    updatingLeaderboard: 'Đang cập nhật bảng xếp hạng...',
    playingAs: 'Đang chơi với tên:',
    clearIdentity: 'Xóa Danh Tính',
    tapCatsToPet: 'Chạm vào những chú mèo để vuốt ve hoặc kéo chúng xung quanh!',
    clickCatsToPet: 'Nhấp vào những chú mèo để vuốt ve hoặc kéo chúng xung quanh!',
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
  },
};
