import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// import { PhoneAuth } from './components/auth/PhoneAuth';
import { ChatInterface } from './components/chat/ChatInterface';
import { TranslationTools } from './components/translation/TranslationTools';
import { CulturalGuide } from './components/cultural/CulturalGuide';
import { UserProfile } from './components/profile/UserProfile';
import { BottomNav } from './components/navigation/BottomNav';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ChatMessage } from './types';
import { motion } from 'framer-motion';
import { TravelForm } from './components/travelForm/travelForm';
import AuthWrapper from "./auth/AuthWrapper";
const MainApp = () => {
  // const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Welcome to your Travelingo! I can help you with translations, cultural tips, local recommendations, and more. How can I assist you today?',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const isOnline = useOnlineStatus();

  const handleSendMessage = (text: string, type: 'text' | 'image' | 'location' = 'text') => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'I can help you with that! Let me provide some cultural context and recommendations.',
        'That\'s a great question about local customs. Here\'s what you should know...',
        'I\'ve translated that for you and included some cultural notes to help you navigate the situation.',
        'Based on your location, here are some authentic local experiences I\'d recommend...'
      ];
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  // if (!currentUser) {
  //   return <PhoneAuth />;
  // }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        );
      case 'translate':
        return <TranslationTools />;
      case 'culture':
        return <CulturalGuide />;
      case 'travelForm':
        return <TravelForm />;
      case 'profile':
        return <UserProfile />;
      default:
        return <ChatInterface messages={messages} onSendMessage={handleSendMessage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 safe-area-inset-top"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TC</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Travelingo</h1>
              <p className="text-xs text-gray-600">
                {activeTab === 'chat' && 'AI Assistant'}
                {activeTab === 'translate' && 'Translation Tools'}
                {activeTab === 'culture' && 'Cultural Guide'}
                {activeTab === 'profile' && 'Your Profile'}
              </p>
            </div>
          </div>
          
          {/* Online Status */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pb-20">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-8rem)]"
        >
          {renderActiveTab()}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOffline={!isOnline}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthWrapper>
          <MainApp />
        </AuthWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;