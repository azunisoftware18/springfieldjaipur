"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Globe } from "lucide-react";
 
const faqData = {
    en: {
        title: "Frequently Asked Questions",
        subtitle: "Support Center",
        legalLabel: "© 2026 Jaipur Heritage Reserves Portal. All Rights Reserved.",
        questions: [
            {
                q: "Do I need to print the physical ticket after booking?",
                a: "No, printing is not mandatory. You can simply show the downloaded digital PDF copy of your E-Ticket on your smartphone at the official monument entry gate pass checkpoint."
            },
            {
                q: "Can I modify the date or session timing slot of my pass?",
                a: "According to our strict compliance policies, once a ticket is confirmed and the treasury ledger ledger is generated, dates or timing adjustments cannot be modified."
            },
            {
                q: "What are the registration rules for international tourists?",
                a: "International visitors must select the Foreigner category during visitor configurations. A valid passport identity confirmation must be presented at the gate."
            },
            {
                q: "Is a guide automatically included with the ticket?",
                a: "No, a guide is an voluntary add-on. You can choose to add a certified heritage guide while filling out the Visitor Form layout, or explore the trails independently."
            }
        ]
    },
    hi: {
        title: "अक्सर पूछे जाने वाले प्रश्न",
        subtitle: "सहायता केंद्र",
        legalLabel: "© 2026 जयपुर हेरिटेज रिजर्व पोर्टल। सर्वाधिकार सुरक्षित।",
        questions: [
            {
                q: "क्या बुकिंग के बाद मुझे भौतिक (प्रिंटेड) टिकट की आवश्यकता होगी?",
                a: "नहीं, प्रिंट करना अनिवार्य नहीं है। आप प्रवेश द्वार पर अपने स्मार्टफोन में डाउनलोड की गई डिजिटल ई-टिकट की पीडीएफ कॉपी दिखाकर सीधे प्रवेश ले सकते हैं।"
            },
            {
                q: "क्या मैं अपने पास की तारीख या समय के स्लॉट को बदल सकता हूँ?",
                a: "हमारी सख्त नीतियों के अनुसार, एक बार टिकट कन्फर्म होने और भुगतान पूरा होने के बाद, यात्रा की तारीख या समय में कोई बदलाव नहीं किया जा सकता।"
            },
            {
                q: "अंतरराष्ट्रीय पर्यटकों के लिए पंजीकरण के क्या नियम हैं?",
                a: "अंतरराष्ट्रीय आगंतुकों को बुकिंग के समय फॉरेनर (विदेशी) श्रेणी का चयन करना होगा। प्रवेश द्वार पर एक वैध पासपोर्ट पहचान पत्र दिखाना आवश्यक है।"
            },
            {
                q: "क्या टिकट के साथ गाइड अपने आप शामिल होता है?",
                a: "नहीं, गाइड एक वैकल्पिक सेवा है। आप विज़िटर फ़ॉर्म भरते समय प्रमाणित हेरिटेज गाइड जोड़ना चुन सकते हैं, या स्वतंत्र रूप से घूम सकते हैं।"
            }
        ]
    }
};

export default function FAQPage() {
    const [lang, setLang] = useState("en");  
    const [openIndex, setOpenIndex] = useState(null); 

    const currentContent = faqData[lang];

    return (
        <div className="min-h-screen bg-sandstone/20 py-12 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-mandala pointer-events-none scale-105" />
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 lg:right-12 z-50">
                <div className="relative inline-flex items-center gap-1 bg-white border border-gold/30 rounded-xl p-1 shadow-md shrink-0">
                    <Globe size={13} className="text-royal-blue/60 ml-1.5 hidden xs:block" />
                    <button
                        onClick={() => setLang("en")}
                        className={`text-[11px] sm:text-xs font-sans font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${lang === "en" ? "bg-royal-blue text-white shadow-sm" : "text-royal-blue/70 hover:bg-sandstone/40"}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLang("hi")}
                        className={`text-[11px] sm:text-xs font-sans font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${lang === "hi" ? "bg-royal-blue text-white shadow-sm" : "text-royal-blue/70 hover:bg-sandstone/40"}`}
                    >
                        हिन्दी
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto z-10 relative space-y-6">
                <div className="text-center space-y-1 pt-3 sm:pt-4">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 rounded-full bg-royal-blue/5 border border-gold/20 flex items-center justify-center text-royal-blue shadow-inner">
                            <HelpCircle size={24} className="text-royal-blue/80" />
                        </div>
                    </div>
                    <p className="text-[10px] tracking-[5px] text-jaipur-dark uppercase font-extrabold font-sans leading-relaxed">
                        {currentContent.subtitle}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-serif text-royal-blue font-bold tracking-wide mt-1">
                        {currentContent.title}
                    </h1>
                    <div className="h-[1px] w-16 bg-gold/30 mx-auto mt-3.5" />
                </div>
 
                <div className="space-y-3 pt-6">
                    {currentContent.questions.map((item, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl border border-gold/15 shadow-[0_4px_20px_rgba(11,33,73,0.02)] overflow-hidden transition-all duration-300"
                            > 
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full p-5 flex items-center justify-between gap-4 text-left font-serif font-bold text-royal-blue text-base sm:text-lg hover:bg-sandstone/10 transition-colors cursor-pointer group"
                                >
                                    <span className="group-hover:text-jaipur-dark transition-colors leading-snug">{item.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gold shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
 
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                        >
                                            <div className="px-5 pb-5 pt-1 text-sm leading-[1.7] text-gray-600 font-sans font-normal border-t border-dashed border-gold/10">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
 
                <div className="text-center font-serif italic text-[11px] text-royal-blue/40 pt-8">
                    {currentContent.legalLabel}
                </div>
            </div>
        </div>
    );
}