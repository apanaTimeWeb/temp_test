'use client';

export interface NoticeboardTemplate {
  id: string;
  category: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  body: string;
  effectiveDates: string;
  reopenTime: string;
  instructions: string[];
}

export const NOTICEBOARD_PRESET_TEMPLATES: NoticeboardTemplate[] = [
  {
    id: 'diwali_holiday',
    category: 'HOLIDAY NOTICE / अवकाश सूचना',
    badgeColor: 'border-amber-600 text-amber-800 bg-amber-50',
    title: 'दीपावली अवकाश सूचना / Diwali Vacation Notice',
    subtitle: 'पुस्तकालय अध्ययन कक्ष बंद रहने की आधिकारिक सूचना',
    body: 'समस्त विद्यार्थियों एवं सदस्यों को सूचित किया जाता है कि दीपावली एवं गोवर्धन पूजा के पावन पर्व के उपलक्ष्य में पुस्तकालय के सभी अध्ययन कक्ष (Study Halls) एवं शिफ्ट्स बंद रहेंगी।',
    effectiveDates: '31 अक्टूबर 2026 से 03 नवंबर 2026 तक',
    reopenTime: '04 नवंबर 2026 (सुबह 06:00 AM से सभी शिफ्ट्स सामान्य रूप से संचालित होंगी)',
    instructions: [
      'अवकाश अवधि के दौरान अपनी बहुमूल्य वस्तुएं अथवा लैपटॉप डेस्क पर न छोड़ें।',
      'लॉकर सुविधा एवं ऑनलाइन सीट रिन्यूअल मोबाइल पोर्टल पर 24 घंटे उपलब्ध रहेगा।',
      'अवकाश के बाद सभी छात्र अपनी निर्धारित शिफ्ट में समय पर पधारें।',
    ],
  },
  {
    id: 'maintenance_notice',
    category: 'MAINTENANCE DOWNTIME / रखरखाव सूचना',
    badgeColor: 'border-rose-600 text-rose-800 bg-rose-50',
    title: 'विद्युत व AC रखरखाव सूचना / AC & Power Maintenance',
    subtitle: 'मासिक तकनीकी सर्विसिंग एवं डीप क्लीनिंग सूचना',
    body: 'पुस्तकालय के हॉल-A एवं हॉल-B में एयर कंडीशनिंग डक्ट्स, इलेक्ट्रिकल बैकअप तथा कीटनाशक छिड़काव (Pest Control) का कार्य निर्धारित है।',
    effectiveDates: 'रविवार, 22 नवंबर 2026 (प्रातः 08:00 AM से दोपहर 02:00 PM)',
    reopenTime: 'रविवार दोपहर 02:30 PM (Evening Shift समय पर शुरू होगी)',
    instructions: [
      'रखरखाव कार्य के समय अध्ययन हॉल में प्रवेश प्रतिबंधित रहेगा।',
      'मॉर्निंग शिफ्ट के छात्र अपनी पढ़ाई हेतु सामान्य डिस्कशन कैबिन का उपयोग कर सकते हैं।',
      'किसी भी असुविधा के लिए रिसेप्शन डेस्क पर संपर्क करें।',
    ],
  },
  {
    id: 'discipline_silence',
    category: 'CODE OF CONDUCT / अनुशासन व शांत क्षेत्र',
    badgeColor: 'border-indigo-600 text-indigo-800 bg-indigo-50',
    title: 'शांत क्षेत्र नियम व अनुशासन निर्देशिका / Silent Zone Protocol',
    subtitle: 'गंभीर प्रतियोगी परीक्षाओं की तैयारी हेतु अनिवार्य नियम',
    body: 'पुस्तकालय पूर्णतः शांत अध्ययन क्षेत्र (Strict Silent Study Zone) है। सभी सदस्यों से अनुशासन एवं मर्यादा बनाए रखने का विनम्र अनुरोध है।',
    effectiveDates: 'तत्काल प्रभाव से सभी शिफ्ट्स में लागू',
    reopenTime: 'नियमित संचालन (06:00 AM - 10:00 PM)',
    instructions: [
      'हॉल के अंदर मोबाइल फ़ोन पूर्ण रूप से Silent / Vibrate मोड पर रखें।',
      'फ़ोन पर बातचीत केवल रिसेप्शन लॉबी अथवा सीढ़ियों पर ही अनुमत है।',
      'डेस्क पर ग्रुप डिस्कशन, कानाफूसी अथवा शोर मचाने पर सदस्यता निलंबित की जा सकती है।',
      'अपनी सीट की सफाई स्वयं बनाए रखें एवं कचरा डस्टबिन में ही डालें।',
    ],
  },
  {
    id: 'exam_special_hours',
    category: 'EXAM SPECIAL / परीक्षा विशेष संचालन',
    badgeColor: 'border-emerald-600 text-emerald-800 bg-emerald-50',
    title: 'आगामी परीक्षाओं हेतु 24x7 अध्ययन सुविधा / 24x7 Exam Study Hours',
    subtitle: 'UPSC / SSC / Banking मुख्य परीक्षाओं हेतु विशेष व्यवस्था',
    body: 'छात्रों की मांग एवं आगामी प्रतियोगी परीक्षाओं को ध्यान में रखते हुए पुस्तकालय में 24 घंटे विशेष अध्ययन सत्र उपलब्ध कराया जा रहा है।',
    effectiveDates: '15 दिसंबर 2026 से 15 जनवरी 2027 तक',
    reopenTime: 'निरंतर 24 घंटे खुला रहेगा (Dedicated Night Shift Pass Holder)',
    instructions: [
      'नाइट शिफ्ट में अध्ययन करने वाले छात्रों के पास वैध बायोमेट्रिक / QR एक्सेस पास अनिवार्य है।',
      'रात के समय गरम चाय, कॉफ़ी एवं RO पेयजल व्यवस्था पैंट्री में उपलब्ध रहेगी।',
      'अतिरिक्त सहायता हेतु नाइट केयरटेकर से संपर्क करें।',
    ],
  },
];
