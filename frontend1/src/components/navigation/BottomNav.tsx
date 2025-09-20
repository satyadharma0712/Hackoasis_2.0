import { MessageCircle, Languages, Compass, User, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';


interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOffline?: boolean;
}

const tabs = [
  { id: 'dashboard', icon: MessageCircle, label: 'dashboard' },
  { id: 'translate', icon: Languages, label: 'Translate' },
  { id: 'culture', icon: Compass, label: 'Culture' },
  { id: 'travelForm', icon: User, label: 'Connect Agency' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export const BottomNav = ({ activeTab, onTabChange, isOffline }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
      {/* Offline Indicator */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 bg-orange-100 border border-orange-200 rounded-lg px-3 py-2 flex items-center gap-2"
        >
          <WifiOff className="w-4 h-4 text-orange-600" />
          <span className="text-orange-800 text-sm font-medium">Offline Mode - Cached content available</span>
        </motion.div>
      )}

      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className={`relative ${isActive ? 'text-blue-600' : ''}`}>
                <Icon className="w-6 h-6" />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 bg-blue-100 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Online Status Indicator */}
      <div className="absolute top-2 right-4">
        {isOffline ? (
          <WifiOff className="w-4 h-4 text-orange-500" />
        ) : (
          <Wifi className="w-4 h-4 text-green-500" />
        )}
      </div>
    </div>
  );
};