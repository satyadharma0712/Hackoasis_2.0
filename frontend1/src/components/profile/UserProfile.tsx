import { useState } from 'react';
import { Settings, LogOut, Globe, Bell, Shield, HelpCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
];

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const [selectedLanguages, setSelectedLanguages] = useState(['en', 'es']);
  const [notifications, setNotifications] = useState(true);

  const handleLanguageToggle = (langCode: string) => {
    setSelectedLanguages(prev => 
      prev.includes(langCode)
        ? prev.filter(code => code !== langCode)
        : [...prev, langCode]
    );
  };

  const menuItems = [
    { icon: Globe, label: 'Language Preferences', action: 'languages' },
    { icon: Bell, label: 'Notifications', action: 'notifications', hasToggle: true },
    { icon: Shield, label: 'Privacy & Security', action: 'privacy' },
    { icon: HelpCircle, label: 'Help & Support', action: 'help' },
    { icon: Star, label: 'Rate the App', action: 'rate' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 pb-24">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user?.name?.[0] || user?.phone?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {user?.name || 'Traveler'}
            </h2>
            <p className="opacity-90">{user?.phone}</p>
            <div className="flex items-center gap-2 mt-2">
              <Globe className="w-4 h-4" />
              <span className="text-sm">
                {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Language Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Preferred Languages
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageToggle(lang.code)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 ${
                selectedLanguages.includes(lang.code)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Settings Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            whileHover={{ backgroundColor: 'rgb(249, 250, 251)' }}
            onClick={() => {
              if (item.action === 'notifications') {
                setNotifications(!notifications);
              }
            }}
            className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 last:border-b-0 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            
            {item.hasToggle ? (
              <motion.div
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                  notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: notifications ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-4 h-4 bg-white rounded-full"
                />
              </motion.div>
            ) : (
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-4 px-6 rounded-2xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </motion.button>
    </div>
  );
};