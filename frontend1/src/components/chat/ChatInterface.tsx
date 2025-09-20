import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Camera, MapPin, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../../types';
import VoiceAssistant from "../voice assistance/voice assistance";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, type?: 'text' | 'image' | 'location') => void;
  isLoading?: boolean;
}

export const ChatInterface = ({ messages, onSendMessage, isLoading }: ChatInterfaceProps) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording implementation would go here
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Image processing would go here
      onSendMessage(`Uploaded image: ${file.name}`, 'image');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      {/* <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-white shadow-md border border-gray-100 text-gray-800'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.translation && (
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <div className="flex items-center gap-1 mb-1">
                      <Languages className="w-3 h-3 opacity-70" />
                      <span className="text-xs opacity-70">Translation:</span>
                    </div>
                    <p className="text-xs opacity-90">{message.translation}</p>
                  </div>
                )}
                <span className="text-xs opacity-70 block mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white shadow-md border border-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">Assistant is typing...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area }
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about local customs, translate text, or get recommendations..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 min-h-[3rem]"
                rows={1}
              />
            </div>
          </div>
          
          {/* Action Buttons }
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleImageUpload}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
              title="Upload image for translation"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-colors duration-200 ${
                isRecording 
                  ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={isRecording ? 'Stop recording' : 'Start voice recording'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div> */}

      <div className="p-6 bg-white rounded-xl shadow-md mt-6 space-y-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🌍 Travelingo - Multilingual Virtual Travel Concierge
        </h2>

        <p className="text-gray-700 text-lg leading-relaxed">
          <strong className="text-blue-600">Travelingo</strong> is a cutting-edge multilingual virtual travel concierge designed to break down language barriers and provide culturally-aware assistance to travelers worldwide. Built with <span className="font-medium text-purple-600">React</span>, <span className="font-medium text-purple-600">TypeScript</span>, and <span className="font-medium text-purple-600">Tailwind CSS</span>, this progressive web application offers a comprehensive suite of travel tools that work seamlessly across devices and languages.
        </p>

        <div className="text-gray-700 text-lg leading-relaxed space-y-2">
          <h3 className="text-2xl font-semibold text-gray-800 mt-4">🌟 Key Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Intelligent Authentication:</strong> OTP login, phone validation, secure sessions</li>
            <li><strong>Multilingual Support:</strong> English 🇺🇸, Spanish 🇪🇸, French 🇫🇷, Mandarin 🇨🇳, Arabic 🇸🇦</li>
            <li><strong>Conversational AI:</strong> Smart travel chatbot with voice and cultural awareness</li>
            <li><strong>Translation Tools:</strong> Text, voice, camera (UI-ready) & phrasebook translations</li>
            <li><strong>Emergency Hub:</strong> Country-specific emergency contacts and help info</li>
            <li><strong>Cultural Guide:</strong> Etiquette, customs, greetings, and more by region</li>
            <li><strong>Dashboard:</strong> Personalized welcome, tips, travel history, and offline info</li>
          </ul>
        </div>

        <div className="text-gray-700 text-lg leading-relaxed space-y-1">
          <h3 className="text-2xl font-semibold text-gray-800 mt-4">🎨 Design Excellence</h3>
          <p>Modern, Apple-level UI with smooth transitions, color gradients, accessibility-first design, and micro-interactions.</p>
        </div>

        <div className="text-gray-700 text-lg leading-relaxed space-y-1">
          <h3 className="text-2xl font-semibold text-gray-800 mt-4">🛠 Tech Stack</h3>
          <p>React 18, Tailwind CSS, TypeScript, modular components, context API, Lucide icons, and PWA-ready architecture.</p>
        </div>

        <div className="text-gray-700 text-lg leading-relaxed space-y-1">
          <h3 className="text-2xl font-semibold text-gray-800 mt-4">🚀 Future Enhancements</h3>
          <p>Planned support for Django REST API, OpenAI integrations, service workers, AR translation overlays, speech-to-text, and more.</p>
        </div>

        <div className="text-gray-700 text-lg leading-relaxed space-y-1">
          <h3 className="text-2xl font-semibold text-gray-800 mt-4">💼 Business Value</h3>
          <p>Perfect for tourists, business travelers, students, and emergency personnel. Combines AI, cultural awareness, and offline tools.</p>
        </div>

        <p className="text-md text-gray-600 italic">
          Travelingo redefines the travel experience — blending AI, language support, and cultural intelligence in a beautifully crafted interface.
        </p>
      </div>

      <VoiceAssistant />
    </div>
  );
};