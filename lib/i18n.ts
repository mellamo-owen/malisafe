// lib/i18n.ts - Translation Dictionary

export type Language = 'sw' | 'en'

export type Translations = {
  [key: string]: {
    sw: string
    en: string
  }
}

export const translations: Translations = {
  appName: { sw: 'MaliSafe', en: 'MaliSafe' },
  appTagline: { sw: 'Kinga vifaa vyako vya elektroniki', en: 'Protect your electronics' },
  phoneNumber: { sw: 'Namba ya Simu', en: 'Phone Number' },
  sendOTP: { sw: 'Tuma OTP', en: 'Send OTP' },
  enterOTP: { sw: 'Weka OTP', en: 'Enter OTP' },
  login: { sw: 'Ingia', en: 'Login' },
  backToPhone: { sw: 'Rudi kwa namba ya simu', en: 'Back to phone number' },
  otpSent: { sw: 'OTP imetumwa kwa simu yako', en: 'OTP sent to your phone' },
  welcome: { sw: 'Karibu! Unaelekezwa kwa ukurasa wa usajili', en: 'Welcome! Redirecting to registration' },
  invalidOTP: { sw: 'OTP si sahihi. Jaribu tena.', en: 'Invalid OTP. Please try again.' },
  registerItem: { sw: 'Sajili Bidhaa Mpya', en: 'Register New Item' },
  fillDetails: { sw: 'Jaza taarifa zote hapa chini', en: 'Fill all details below' },
  customerName: { sw: 'Jina la Mteja', en: 'Customer Name' },
  customerPhone: { sw: 'Namba ya Simu ya Mteja', en: 'Customer Phone Number' },
  itemName: { sw: 'Jina la Bidhaa', en: 'Item Name' },
  serialNumber: { sw: 'Namba ya Serial', en: 'Serial Number' },
  priceKES: { sw: 'Bei (KES)', en: 'Price (KES)' },
  takePhoto: { sw: 'Piga Picha ya Bidhaa', en: 'Take Photo of Item' },
  takePhotoButton: { sw: 'Chukua Picha', en: 'Take Photo' },
  photoUploaded: { sw: '✓ Picha imepakiwa', en: '✓ Photo uploaded' },
  registerButton: { sw: 'Sajili Bidhaa', en: 'Register Item' },
  clearButton: { sw: 'Safisha', en: 'Clear' },
  adminPanel: { sw: 'Angalia Admin Panel', en: 'View Admin Panel' },
  itemRegistered: { sw: 'Bidhaa imesajiliwa!', en: 'Item registered!' },
  viewItem: { sw: 'Unataka kuiona bidhaa sasa?', en: 'Do you want to view the item now?' },
  itemDetails: { sw: 'Taarifa za Bidhaa', en: 'Item Details' },
  shopName: { sw: 'Duka', en: 'Shop' },
  registrationDate: { sw: 'Tarehe ya Usajili', en: 'Registration Date' },
  claimButton: { sw: 'Item Imeibiwa? Lipa KES 100 Upate PDF', en: 'Item Stolen? Pay KES 100 Get PDF' },
  claimInfo: { sw: 'Bidhaa imeibiwa? Malipo ya KES 100 itakusaidia kupata Fomu ya Polisi na Hati ya Madai', en: 'Item stolen? Pay KES 100 to get Police Abstract and Insurance Claim Form' },
  claimSubmitted: { sw: 'Ombi la madai limewasilishwa! Unapokea PDF kwa SMS.', en: 'Claim submitted! You will receive PDF via SMS.' },
  claimFailed: { sw: 'Hitilafu katika kuchakata madai', en: 'Error processing claim' },
  itemNotFound: { sw: 'Bidhaa Haijapatikana', en: 'Item Not Found' },
  itemNotFoundDesc: { sw: 'MaliSafe ID hii haipo kwenye mfumo wetu.', en: 'This MaliSafe ID does not exist in our system.' },
  adminTitle: { sw: 'Admin Panel', en: 'Admin Panel' },
  itemsToday: { sw: 'Bidhaa Leo', en: 'Items Today' },
  itemsRegisteredToday: { sw: 'Bidhaa zilizosajiliwa leo', en: 'Items registered today' },
  revenueToday: { sw: 'Mapato Leo', en: 'Revenue Today' },
  fromRegistrations: { sw: 'Kutoka kwa usajili na madai', en: 'From registrations and claims' },
  allItems: { sw: 'Bidhaa Zote', en: 'All Items' },
  noItems: { sw: 'Hakuna bidhaa zilizosajiliwa bado', en: 'No items registered yet' },
  goToRegister: { sw: 'Nenda kwa ukurasa wa usajili kuongeza bidhaa', en: 'Go to registration page to add items' },
  loading: { sw: 'Inapakia...', en: 'Loading...' },
  actions: { sw: 'Kitendo', en: 'Action' },
  exportCSV: { sw: 'Export CSV', en: 'Export CSV' },
  csvDownloaded: { sw: 'CSV imepakuliwa', en: 'CSV downloaded' },
  networkError: { sw: 'Hitilafu ya mtandao. Tafadhali jaribu tena.', en: 'Network error. Please try again.' },
  requiredFields: { sw: 'Tafadhali jaza sehemu zote muhimu', en: 'Please fill in all required fields' },
  enterValidPhone: { sw: 'Tafadhali ingiza namba sahihi ya simu', en: 'Please enter a valid phone number' },
  enterValidPrice: { sw: 'Tafadhali ingiza bei sahihi', en: 'Please enter a valid price' },
  photoRequired: { sw: 'Tafadhali piga picha ya bidhaa', en: 'Please take a photo of the item' },
  photoTooLarge: { sw: 'Picha ni kubwa sana. Chukua picha nyingine (max 5MB)', en: 'Photo is too large. Take another photo (max 5MB)' },
  otpPlaceholder: { sw: 'Weka OTP', en: 'Enter OTP' },
  language: { sw: 'Lugha', en: 'Language' },
  swahili: { sw: 'Kiswahili', en: 'Swahili' },
  english: { sw: 'English', en: 'English' },
  backToHome: { sw: 'Rudi Nyumbani', en: 'Back to Home' },
}

export function t(key: string, lang: Language): string {
  const translation = translations[key]
  if (!translation) return key
  return translation[lang] || translation.sw
}

export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'sw'
  const stored = localStorage.getItem('malisafe-language')
  if (stored === 'en' || stored === 'sw') return stored
  return 'sw'
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('malisafe-language', lang)
  }
}