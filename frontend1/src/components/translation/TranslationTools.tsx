import { useState } from 'react';
import { ArrowRightLeft, Camera, Volume2, Copy, Check, Globe, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

const CONTEXTS = [
  { id: 'general', name: 'General', icon: Globe },
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'accommodation', name: 'Hotels', icon: '🏨' },
  { id: 'emergency', name: 'Emergency', icon: '🚨' },
];

export const TranslationTools = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [context, setContext] = useState('general');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation API call
    setTimeout(() => {
      setTranslatedText(`[${context.toUpperCase()}] Translated: ${sourceText}`);
      setIsTranslating(false);
    }, 1500);
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText('');
  };

  const handleCopy = async () => {
    if (translatedText) {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Translation Tools</h1>
        <p className="text-gray-600">Context-aware translations for travelers</p>
      </div>

      {/* Context Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Translation Context
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CONTEXTS.map((ctx) => (
            <motion.button
              key={ctx.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setContext(ctx.id)}
              className={`p-3 rounded-xl text-center transition-all duration-200 ${
                context === ctx.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="text-lg mb-1">
                {typeof ctx.icon === 'string' ? ctx.icon : <ctx.icon className="w-5 h-5 mx-auto" />}
              </div>
              <div className="text-xs font-medium">{ctx.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Translation Interface */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Language Selector */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSwapLanguages}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <ArrowRightLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
          
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Translation Area */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Input */}
          <div className="p-6 border-r border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Original Text</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => speakText(sourceText, sourceLang)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  disabled={!sourceText}
                >
                  <Volume2 className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Output */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Translation</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => speakText(translatedText, targetLang)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  disabled={!translatedText}
                >
                  <Volume2 className="w-4 h-4 text-gray-600" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  disabled={!translatedText}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </motion.button>
              </div>
            </div>
            <div className="w-full h-40 p-4 bg-gray-50 border border-gray-300 rounded-xl overflow-y-auto">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 leading-relaxed">{translatedText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Translate Button */}
        <div className="p-4 bg-gray-50 border-t">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};