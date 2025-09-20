import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Languages, MessageSquare } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [recognition, setRecognition] = useState<any>(null);

  const languages = [
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳' }
  ];

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = selectedLanguage;
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
        };

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
          handleVoiceCommand(transcript);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }

    // Load Omnidimension widget
    const script = document.createElement('script');
    script.id = 'omnidimension-web-widget';
    script.async = true;
    script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=d3ffe7c042e93fe3c5d0c9530bf106f4';
    script.onload = () => setIsWidgetLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.getElementById('omnidimension-web-widget')) {
        document.head.removeChild(script);
      }
    };
  }, [selectedLanguage]);

  const handleVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Handle navigation commands
    if (lowerText.includes('home') || lowerText.includes('गृह') || lowerText.includes('घर')) {
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navigating to home section');
    } else if (lowerText.includes('services') || lowerText.includes('सेवाएं') || lowerText.includes('सेवा')) {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      speak('Showing our services');
    } else if (lowerText.includes('contact') || lowerText.includes('संपर्क') || lowerText.includes('फ़ोन')) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      speak('Opening contact information');
    } else {
      // For other queries, you can integrate with the Omnidimension widget
      speak(`I heard: ${text}. Let me help you with that.`);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition) {
      recognition.lang = selectedLanguage;
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speak('Travelingo is ready. How can I help you today?');
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Language Selector */}
      <div className="mb-4">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Voice Controls */}
      <div className="flex flex-col space-y-3">
        {/* Main Voice Button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {isListening ? (
            <MicOff className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </button>

        {/* Speaker Toggle */}
        <button
          onClick={toggleSpeech}
          className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
            isSpeaking
              ? 'bg-green-500 hover:bg-green-600 animate-pulse'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="h-6 w-6 text-white" />
          ) : (
            <VolumeX className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Language Indicator */}
        <button className="w-12 h-12 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
          <Languages className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-xl p-4 max-w-xs transform transition-all duration-300">
          <div className="flex items-start space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">You said:</p>
              <p className="text-sm text-gray-600">{transcript}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${
        isWidgetLoaded ? 'bg-green-500' : 'bg-yellow-500'
      } shadow-lg`}></div>
    </div>
  );
}