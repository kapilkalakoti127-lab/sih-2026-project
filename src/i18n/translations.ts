import type { Language } from '@/types';

export const translations: Record<string, Record<Language, string>> = {
  app_name: { en: 'Kabadiwala Connect', hi: 'कबाड़ीवाला कनेक्ट', mr: 'कबाडीवाला कनेक्ट' },
  subtitle: {
    en: 'Bringing the Informal Collector into the Formal Recycling Chain',
    hi: 'अनौपचारिक कबाड़ियों को औपचारिक रीसाइक्लिंग श्रृंखला से जोड़ना',
    mr: 'अनौपचारिक कचरा वेचकांना अधिकृत पुनर्चक्रीकरण साखळीत आणणे',
  },
  namaste: { en: 'Namaste', hi: 'नमस्ते', mr: 'नमस्कार' },
  tagline: {
    en: 'Digital bridge connecting scrap collectors with authorized recyclers.',
    hi: 'कबाड़ीवालों को अधिकृत रीसाइक्लिंग चेन से जोड़ने वाला डिजिटल सेतु।',
    mr: 'कबाडीवाल्यांना अधिकृत पुनर्चक्रीकरण साखळीशी जोडणारा डिजिटल दुवा.',
  },
  sell_ewaste: { en: 'Sell E-Waste', hi: 'ई-वेस्ट बेचें', mr: 'ई-कचरा विका' },
  home: { en: 'Home', hi: 'होम', mr: 'होम' },
  my_lot: { en: 'My Lot', hi: 'मेरा लॉट', mr: 'माझा लॉट' },
  prices: { en: 'Prices', hi: 'कीमत', mr: 'किंमत' },
  earnings: { en: 'Earnings', hi: 'कमाई', mr: 'उत्पन्न' },
  todays_earnings: {
    en: "Today's Earnings",
    hi: 'आज की कमाई',
    mr: 'आजची कमाई',
  },
  active_lot: { en: 'Active Lot', hi: 'सक्रिय लॉट', mr: 'सक्रिय लॉट' },
  recent_lot: { en: 'Recent Lot', hi: 'हाल का लॉट', mr: 'अलीकडील लॉट' },
  online: { en: 'Online', hi: 'ऑनलाइन', mr: 'ऑनलाईन' },
  offline: { en: 'Offline', hi: 'ऑफलाइन', mr: 'ऑफलाईन' },
  continue: { en: 'Continue', hi: 'जारी रखें', mr: 'सुरू ठेवा' },
  confirm_material: {
    en: 'Confirm Material',
    hi: 'सामग्री की पुष्टि करें',
    mr: 'सामग्रीची पुष्टी करा',
  },
  find_recycler: {
    en: 'Find Recycler',
    hi: 'रीसायकलर खोजें',
    mr: 'रीसायकलर शोधा',
  },
  accept_offer: { en: 'Accept Offer', hi: 'ऑफर स्वीकारें', mr: 'ऑफर स्वीकारा' },
  decline: { en: 'Decline', hi: 'अस्वीकार', mr: 'नकार' },
  view_offer: { en: 'View Offer', hi: 'ऑफर देखें', mr: 'ऑफर पहा' },
  handover_confirmed: {
    en: 'Handover Confirmed',
    hi: 'हैंडओवर की पुष्टि',
    mr: 'हँडओव्हर निश्चित',
  },
  weight: {
    en: 'Approximate Weight',
    hi: 'अनुमानित वजन',
    mr: 'अंदाजे वजन',
  },
  reference_price: {
    en: 'Reference Price',
    hi: 'संदर्भ मूल्य',
    mr: 'संदर्भ किंमत',
  },
  estimated_value: {
    en: 'Estimated Value',
    hi: 'अनुमानित मूल्य',
    mr: 'अंदाजे मूल्य',
  },
  total_earnings: {
    en: 'Total Earnings',
    hi: 'कुल कमाई',
    mr: 'एकूण कमाई',
  },
  paid: { en: 'Paid', hi: 'भुगतान हुआ', mr: 'भरले' },
  pending: { en: 'Pending', hi: 'लंबित', mr: 'प्रलंबित' },
  safety_reminder: {
    en: 'Do not burn cables or open batteries/CRTs. Use safe handling and authorized recyclers.',
    hi: 'केबल न जलाएं या बैटरी/CRT न खोलें। सुरक्षित रूप से संभालें और अधिकृत रीसायकलर का उपयोग करें।',
    mr: 'केबल जाळू नका किंवा बॅटरी/CRT उघडू नका. सुरक्षित हाताळा आणि अधिकृत रीसायकलर वापरा.',
  },
  photograph: { en: 'Photograph', hi: 'फोटो', mr: 'फोटो' },
  categorize: { en: 'Categorize', hi: 'श्रेणी', mr: 'श्रेणी' },
  ai_suggestion: {
    en: 'AI Suggestion: PCB — 87% confidence',
    hi: 'एआई सुझाव: PCB — 87% विश्वास',
    mr: 'एआय सूचना: PCB — 87% विश्वास',
  },
  market_range: { en: 'Market Range', hi: 'बाजार श्रेणी', mr: 'बाजार श्रेणी' },
  match_score: { en: 'Match Score', hi: 'मैच स्कोर', mr: 'मॅच स्कोअर' },
  pickup_available: {
    en: 'Pickup Available',
    hi: 'पिकअप उपलब्ध',
    mr: 'पिकअप उपलब्ध',
  },
  verified_authorized: {
    en: 'Verified & Authorized',
    hi: 'सत्यापित और अधिकृत',
    mr: 'सत्यापित आणि अधिकृत',
  },
  send_offer: { en: 'Send Offer', hi: 'ऑफर भेजें', mr: 'ऑफर पाठवा' },
  reject: { en: 'Reject', hi: 'अस्वीकार', mr: 'नकार' },
  new_lots: { en: 'New Lots', hi: 'नए लॉट', mr: 'नवीन लॉट' },
  accepted_today: {
    en: 'Accepted Today',
    hi: 'आज स्वीकार',
    mr: 'आज स्वीकार',
  },
  pending_pickup: {
    en: 'Pending Pickup',
    hi: 'पिकअप लंबित',
    mr: 'पिकअप प्रलंबित',
  },
  completed: { en: 'Completed', hi: 'पूर्ण', mr: 'पूर्ण' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  incoming_lot: { en: 'Incoming Lot', hi: 'आने वाला लॉट', mr: 'येणारा लॉट' },
  transactions: { en: 'Transactions', hi: 'लेनदेन', mr: 'व्यवहार' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', mr: 'प्रोफाइल' },
  collector_demo: {
    en: 'Collector Demo',
    hi: 'कलेक्टर डेमो',
    mr: 'कलेक्टर डेमो',
  },
  recycler_demo: {
    en: 'Recycler Demo',
    hi: 'रीसायकलर डेमो',
    mr: 'रीसायकलर डेमो',
  },
  lot_id: { en: 'Lot ID', hi: 'लॉट आईडी', mr: 'लॉट आयडी' },
  material: { en: 'Material', hi: 'सामग्री', mr: 'सामग्री' },
  recycler: { en: 'Recycler', hi: 'रीसायकलर', mr: 'रीसायकलर' },
  location: { en: 'Location', hi: 'स्थान', mr: 'स्थान' },
  date_time: { en: 'Date & Time', hi: 'तारीख और समय', mr: 'तारीख आणि वेळ' },
  final_value: { en: 'Final Value', hi: 'अंतिम मूल्य', mr: 'अंतिम मूल्य' },
  payment_status: {
    en: 'Payment Status',
    hi: 'भुगतान स्थिति',
    mr: 'पेमेंट स्थिती',
  },
  your_lot: { en: 'Your Lot', hi: 'आपका लॉट', mr: 'तुमचा लॉट' },
  recycler_offer: {
    en: 'Recycler Offer',
    hi: 'रीसायकलर ऑफर',
    mr: 'रीसायकलर ऑफर',
  },
  offer: { en: 'Offer', hi: 'ऑफर', mr: 'ऑफर' },
  total: { en: 'Total', hi: 'कुल', mr: 'एकूण' },
  view_lot: { en: 'View Lot', hi: 'लॉट देखें', mr: 'लॉट पहा' },
  offline_msg: {
    en: 'Lot saved locally. It will sync when connectivity returns.',
    hi: 'लॉट स्थानीय रूप से सहेजा गया। कनेक्टिविटी लौटने पर यह सिंक होगा।',
    mr: 'लॉट स्थानिकरित्या जतन केला. कनेक्टिव्हिटी परत आल्यावर ते सिंक होईल.',
  },
  sample_data: { en: 'Sample / Field Data', hi: 'नमूना डेटा', mr: 'नमुना डेटा' },
  listen_price: {
    en: 'Listen to price',
    hi: 'कीमत सुनें',
    mr: 'किंमत ऐका',
  },
  step: { en: 'Step', hi: 'चरण', mr: 'पायरी' },
  of: { en: 'of', hi: '/', mr: '/' },
  camera_area: {
    en: 'Tap to take a photo of your e-waste',
    hi: 'अपने ई-वेस्ट की फोटो लेने के लिए टैप करें',
    mr: 'तुमच्या ई-कचर्याचे फोटो काढण्यासाठी टॅप करा',
  },
  example_photo: {
    en: 'Example: PCB',
    hi: 'उदाहरण: PCB',
    mr: 'उदाहरण: PCB',
  },
  select_material: {
    en: 'Select Material Category',
    hi: 'सामग्री श्रेणी चुनें',
    mr: 'सामग्री श्रेणी निवडा',
  },
  unit_economics: {
    en: 'Unit Economics',
    hi: 'इकाई अर्थशास्त्र',
    mr: 'एकक अर्थशास्त्र',
  },
  existing_value: {
    en: 'Existing estimated selling value',
    hi: 'मौजूदा अनुमानित बिक्री मूल्य',
    mr: 'सध्याचे अंदाजे विक्री मूल्य',
  },
  platform_offer: {
    en: 'Platform recycler offer',
    hi: 'प्लेटफॉर्म रीसायकलर ऑफर',
    mr: 'प्लॅटफॉर्म रीसायकलर ऑफर',
  },
  additional_earning: {
    en: 'Potential additional earning',
    hi: 'संभावित अतिरिक्त कमाई',
    mr: 'संभाव्य अतिरिक्त कमाई',
  },
  illustrative_data: {
    en: 'Illustrative Demo Data',
    hi: 'उदाहरण डेटा',
    mr: 'उदाहरण डेटा',
  },
  traceability: {
    en: 'Traceability',
    hi: 'ट्रेसेबिलिटी',
    mr: 'ट्रेसेबिलिटी',
  },
  handover_ref: {
    en: 'Handover Reference',
    hi: 'हैंडओवर संदर्भ',
    mr: 'हँडओव्हर संदर्भ',
  },
  recycler_confirmation: {
    en: 'Recycler Confirmation',
    hi: 'रीसायकलर पुष्टि',
    mr: 'रीसायकलर पुष्टी',
  },
  confirmed: { en: 'Confirmed', hi: 'पुष्टि हुई', mr: 'निश्चित' },
  materials_accepted: {
    en: 'Materials Accepted',
    hi: 'स्वीकृत सामग्री',
    mr: 'स्वीकार्य सामग्री',
  },
  why_matched: {
    en: 'Why this recycler?',
    hi: 'यह रीसायकलर क्यों?',
    mr: 'हा रीसायकलर का?',
  },
  back: { en: 'Back', hi: 'वापस', mr: 'मागे' },
  exit_demo: { en: 'Exit Demo', hi: 'डेमो बंद करें', mr: 'डेमो बंद करा' },
  language: { en: 'Language', hi: 'भाषा', mr: 'भाषा' },
  transaction_history: {
    en: 'Transaction History',
    hi: 'लेनदेन इतिहास',
    mr: 'व्यवहार इतिहास',
  },
  no_lots: {
    en: 'No lots yet. Start by selling e-waste.',
    hi: 'अभी कोई लॉट नहीं। ई-वेस्ट बेचना शुरू करें।',
    mr: 'अद्याप लॉट नाही. ई-कचरा विकून सुरुवात करा.',
  },
  all_materials: {
    en: 'All Materials',
    hi: 'सभी सामग्री',
    mr: 'सर्व साहित्य',
  },
  switch_to_recycler: {
    en: 'Switch to Recycler',
    hi: 'रीसायकलर देखें',
    mr: 'रीसायकलर पहा',
  },
  switch_to_collector: {
    en: 'Switch to Collector',
    hi: 'कलेक्टर देखें',
    mr: 'कलेक्टर पहा',
  },
  reset_demo: {
    en: 'Reset Demo',
    hi: 'डेमो रीसेट',
    mr: 'डेमो रीसेट',
  },
  filter_all: {
    en: 'All',
    hi: 'सभी',
    mr: 'सर्व',
  },
  filter_active: {
    en: 'Active',
    hi: 'सक्रिय',
    mr: 'सक्रिय',
  },
  filter_completed: {
    en: 'Completed',
    hi: 'पूर्ण',
    mr: 'पूर्ण',
  },
  weight_adjust: {
    en: 'Adjust Weight (kg)',
    hi: 'वजन बदलें (किग्रा)',
    mr: 'वजन बदला (किलो)',
  },
  epr_reg: {
    en: 'EPR Registration',
    hi: 'ईपीआर पंजीकरण',
    mr: 'ईपीआर नोंदणी',
  },
  authorized_by: {
    en: 'Authorized by CPCB / SPCB',
    hi: 'सीपीसीबी / एसपीसीबी द्वारा अधिकृत',
    mr: 'सीपीसीबी / एसपीसीबी द्वारे अधिकृत',
  },
  pickup_scheduled: {
    en: 'Free Doorstep Pickup Scheduled',
    hi: 'निःशुल्क पिकअप निर्धारित',
    mr: 'मोफत पिकअप निश्चित',
  },
  custom_offer_price: {
    en: 'Recycler Offer Rate (₹/kg)',
    hi: 'रीसायकलर दर (₹/किग्रा)',
    mr: 'रीसायकलर दर (₹/किलो)',
  },
  compliance_manifest: {
    en: 'EPR Form-6 Manifest',
    hi: 'ईपीआर प्रपत्र-६ मैनिफेस्ट',
    mr: 'ईपीआर फॉर्म-६ मॅनिफेस्ट',
  },
  choose_language: {
    en: 'Select Language / भाषा चुनें / भाषा निवडा',
    hi: 'भाषा चुनें (Select Language)',
    mr: 'भाषा निवडा (Select Language)',
  },
  select_role_prompt: {
    en: 'Choose an interface to continue:',
    hi: 'जारी रखने के लिए इंटरफ़ेस चुनें:',
    mr: 'पुढे जाण्यासाठी इंटरफेस निवडा:',
  },
  kabadiwala_sub: {
    en: 'Mobile interface for local waste collectors',
    hi: 'स्थानीय कबाड़ीवालों के लिए मोबाइल ऐप',
    mr: 'स्थानिक भंगार गोळा करणाऱ्यांसाठी मोबाईल ॲप',
  },
  recycler_sub: {
    en: 'Facility management & CPCB compliance portal',
    hi: 'फैक्ट्री प्रबंधन और सीपीसीबी कंप्लायंस पोर्टल',
    mr: 'प्रकल्प व्यवस्थापन आणि सीपीसीबी पूर्तता पोर्टल',
  },
  bridge_sub: {
    en: 'Side-by-side real-time interactive demo',
    hi: 'दोनों तरफ का लाइव रियल-टाइम प्रदर्शन',
    mr: 'दोन्ही बाजूंचे थेट रिअल-टाइम प्रात्यक्षिक',
  },
  listen: {
    en: 'Listen',
    hi: 'सुनें',
    mr: 'ऐका',
  },
  collector_id: {
    en: 'Collector ID',
    hi: 'कलेक्टर आईडी',
    mr: 'कलेक्टर आयडी',
  },
  unique_id: {
    en: 'Unique ID',
    hi: 'विशिष्ट पहचान संख्या',
    mr: 'युनिक ओळख क्रमांक',
  },
  collector_profile: {
    en: 'Scrap Collector Profile',
    hi: 'कबाड़ीवाला प्रोफ़ाइल',
    mr: 'भंगार संकलक प्रोफाइल',
  },
  contact_info: {
    en: 'Contact Details',
    hi: 'संपर्क विवरण',
    mr: 'संपर्क माहिती',
  },
  payment_upi: {
    en: 'Default Payout UPI',
    hi: 'डिफ़ॉल्ट भुगतान UPI',
    mr: 'डीफॉल्ट पेमेंट UPI',
  },
  kyc_verified: {
    en: 'KYC Verified (Authorized)',
    hi: 'केवाईसी सत्यापित (अधिकृत)',
    mr: 'केवायसी सत्यापित (अधिकृत)',
  },
  id_card: {
    en: 'Digital Collector ID Card',
    hi: 'डिजिटल कलेक्टर पहचान पत्र',
    mr: 'डिजिटल संकलक ओळखपत्र',
  },
  // Material categories
  PCB: { en: 'PCB (Circuit Board)', hi: 'सर्किट बोर्ड (PCB)', mr: 'सर्किट बोर्ड (PCB)' },
  Cable: { en: 'Cables & Wires', hi: 'केबल और तार', mr: 'केबल आणि तारा' },
  Battery: { en: 'Batteries (Lead/Lithium)', hi: 'बैटरी (लीड/लिथियम)', mr: 'बॅटरी (लीड/लिथियम)' },
  LCD: { en: 'LCD / Monitors', hi: 'एलसीडी / मॉनिटर', mr: 'एलसीडी / मॉनिटर' },
  Motor: { en: 'Electric Motors', hi: 'इलेक्ट्रिक मोटर', mr: 'इलेक्ट्रिक मोटर' },
  'Mixed Plastic': { en: 'E-Waste Mixed Plastic', hi: 'मिश्रित ई-वेस्ट प्लास्टिक', mr: 'मिश्रित ई-कचरा प्लास्टिक' },
  Metal: { en: 'Metal / Ferrous Scrap', hi: 'धातु और स्क्रैप मेटल', mr: 'धातू व लोखंडी कचरा' },
  'Chargers / Adapters': { en: 'Chargers & Adapters', hi: 'चार्जर और अडैप्टर', mr: 'चार्जर आणि अडॅप्टर' },
  'Other E-Waste': { en: 'Unknown / Other E-Waste', hi: 'अन्य / विविध ई-कचरा', mr: 'इतर / संमिश्र ई-कचरा' },
  low_confidence_warning: {
    en: 'Low confidence — please verify material manually.',
    hi: 'कम सटीकता — कृपया सामग्री की स्वयं पुष्टि करें।',
    mr: 'कमी खात्री — कृपया सामग्री स्वतः तपासा किंवा बदला.',
  },
  
  // Proximity & location terms
  near: { en: 'Near (Local)', hi: 'नजदीक (लोकल)', mr: 'जवळ (स्थानिक)' },
  mid: { en: 'Mid-Distance', hi: 'मध्यम दूरी', mr: 'मध्यम अंतर' },
  far: { en: 'Far (Regional)', hi: 'दूर (क्षेत्रीय)', mr: 'लांब (प्रादेशिक)' },
  distance: { en: 'Distance', hi: 'दूरी', mr: 'अंतर' },
  rate_per_kg: { en: 'Rate / kg', hi: 'भाव / किलो', mr: 'दर / किलो' },
  direct_legal_rate: { en: 'Direct Legal Rate', hi: 'सीधा कानूनी भाव', mr: 'थेट कायदेशीर दर' },
  drop_off_only: { en: 'Drop-off required', hi: 'ड्रॉप-ऑफ आवश्यक', mr: 'ड्रॉप-ऑफ आवश्यक' },
  free_pickup_truck: { en: 'Free Pickup Vehicle', hi: 'मुफ्त पिकअप वाहन', mr: 'मोफत पिकअप वाहन' },
  arrival_guarantee: { en: 'Fast Arrival', hi: 'शीघ्र आगमन', mr: 'जलद आगमन' },

  // AI & verification
  ai_suggestion_badge: {
    en: 'AI Material Suggestion',
    hi: 'एआई सामग्री सुझाव',
    mr: 'एआय सामग्री सूचना',
  },
  ai_confidence: {
    en: 'Confidence',
    hi: 'सटीकता',
    mr: 'अचूकता',
  },
  ai_verified_desc: {
    en: 'Verified against CPCB authorized recycling classification standards',
    hi: 'सीपीसीबी अधिकृत रीसाइक्लिंग वर्गीकरण मानकों के अनुसार सत्यापित',
    mr: 'सीपीसीबी अधिकृत पुनर्वापर वर्गीकरण मानकांनुसार सत्यापित',
  },
  tap_to_capture: {
    en: 'Tap to capture or upload',
    hi: 'फोटो खींचने या अपलोड करने के लिए टैप करें',
    mr: 'फोटो काढण्यासाठी किंवा अपलोड करण्यासाठी टॅप करा',
  },
  retake_photo: {
    en: 'Tap to retake photo',
    hi: 'दोबारा फोटो लेने के लिए टैप करें',
    mr: 'पुन्हा फोटो काढण्यासाठी टॅप करा',
  },
  legal_price_guarantee: {
    en: 'Direct legal price · Instant payment',
    hi: 'सीधा कानूनी भाव · तुरंत भुगतान',
    mr: 'थेट कायदेशीर दर · त्वरित पेमेंट',
  },
  middleman_loss_desc: {
    en: 'Direct recycler channel without middleman margin loss',
    hi: 'बिचौलियों के कमीशन नुकसान के बिना सीधा रीसायकलर माध्यम',
    mr: 'मध्यस्थांच्या कमिशन कपातीशिवाय थेट अधिकृत रीसायकलर',
  },
  fair_legal_premium: {
    en: 'Fair Legal Premium',
    hi: 'उचित कानूनी प्रीमियम',
    mr: 'योग्य कायदेशीर प्रीमियम',
  },
  doorstep_collection: {
    en: 'Doorstep collection available',
    hi: 'घरपहुंच पिकअप उपलब्ध',
    mr: 'घरोघरी पिकअप उपलब्ध',
  },
  drop_off: {
    en: 'Drop-off',
    hi: 'स्वयं डिलीवरी',
    mr: 'स्वतः डिलिव्हरी',
  },
  authorized_facility: {
    en: 'Authorized Processing Facility',
    hi: 'अधिकृत रीसाइक्लिंग प्लांट',
    mr: 'अधिकृत पुनर्प्रक्रिया प्रकल्प',
  },
  available_recyclers_label: {
    en: 'Available Authorized Recyclers',
    hi: 'उपलब्ध अधिकृत रीसायकलर कंपनियां',
    mr: 'उपलब्ध अधिकृत रीसायकलर कंपन्या',
  },
  collector_identity_badge: {
    en: 'Collector Identity',
    hi: 'कलेक्टर पहचान',
    mr: 'संकलक ओळख',
  },
  legal_immunity_notice: {
    en: 'Legal Immunity & Authorized Settlement Active',
    hi: 'कानूनी सुरक्षा और अधिकृत निपटान सक्रिय',
    mr: 'कायदेशीर संरक्षण आणि अधिकृत पूर्तता सक्रिय',
  },
  ai_average_price: {
    en: 'AI Average Market Price',
    hi: 'AI औसत बाजार मूल्य',
    mr: 'AI सरासरी बाजार भाव',
  },
  average_price_label: {
    en: 'Average Market Rate',
    hi: 'औसत बाजार दर',
    mr: 'सरासरी बाजार दर',
  },
  estimated_avg_payout: {
    en: 'Estimated Average Payout',
    hi: 'अनुमानित औसत भुगतान',
    mr: 'अंदाजे सरासरी रक्कम',
  },
  login_collector_portal: {
    en: 'Scrap Collector Login',
    hi: 'कबाड़ीवाला / स्क्रैप कलेक्टर लॉगिन',
    mr: 'स्क्रॅप संकलक / भंगारवाला लॉगिन',
  },
  login_recycler_portal: {
    en: 'Authorized Recycler Portal',
    hi: 'अधिकृत रीसायकलर पोर्टल',
    mr: 'अधिकृत पुनर्प्रक्रिया पोर्टल',
  },
  sign_in: {
    en: 'Sign In to Dashboard',
    hi: 'डैशबोर्ड में साइन इन करें',
    mr: 'डॅशबोर्डवर साइन इन करा',
  },
  back_btn: {
    en: 'Back',
    hi: 'पीछे जाएं',
    mr: 'मागे जा',
  },
  main_menu: {
    en: 'Main Menu',
    hi: 'मुख्य मेन्यू',
    mr: 'मुख्य मेन्यू',
  },
  logout_btn: {
    en: 'Logout',
    hi: 'लॉगआउट',
    mr: 'लॉगआउट',
  },
  choose_portal_prompt: {
    en: 'Select Your Work Portal',
    hi: 'अपना कार्य पोर्टल चुनें',
    mr: 'तुमचे कार्य पोर्टल निवडा',
  },
  collector_portal_desc: {
    en: 'For scrap collectors (kabadiwala) to sell e-waste & receive instant payment',
    hi: 'कबाड़ीवालों के लिए ई-कचरा बेचने और तुरंत नकद/UPI भुगतान पाने हेतु',
    mr: 'भंगार गोळा करणाऱ्यांसाठी ई-कचरा विकून त्वरित पेमेंट मिळवण्यासाठी',
  },
  recycler_portal_desc: {
    en: 'For CPCB/MPCB authorized industrial e-waste dismantling & recycling plants',
    hi: 'प्रदूषण नियंत्रण बोर्ड से अधिकृत औद्योगिक ई-वेस्ट रीसाइक्लिंग कंपनियों के लिए',
    mr: 'प्रदूषण नियंत्रण मंडळाने अधिकृत केलेल्या औद्योगिक ई-कचरा प्रकल्पांसाठी',
  },
  enter_portal: {
    en: 'Enter Portal',
    hi: 'पोर्टल खोलें',
    mr: 'पोर्टल उघडा',
  },
};

export function translate(key: string, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
