import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, MapPin, Info, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { CulturalTip, Recommendation } from '../../types';

const MOCK_CULTURAL_TIPS: CulturalTip[] = [
  {
    id: '1',
    country: 'Japan',
    category: 'greeting',
    title: 'Bowing Etiquette',
    description: 'Proper bowing is essential in Japanese culture and shows respect.',
    doAndDont: {
      do: ['Bow when meeting someone', 'Hold the bow for 2-3 seconds', 'Keep your hands at your sides'],
      dont: ['Look directly at someone while bowing', 'Bow too casually', 'Use only a head nod for formal situations']
    },
    urgency: 'high'
  },
  {
    id: '2',
    country: 'Japan',
    category: 'dining',
    title: 'Chopstick Manners',
    description: 'Using chopsticks properly is crucial in Japanese dining culture.',
    doAndDont: {
      do: ['Rest chopsticks on the holder when not eating', 'Use serving chopsticks for shared dishes'],
      dont: ['Point with chopsticks', 'Stick chopsticks upright in rice', 'Pass food chopstick to chopstick']
    },
    urgency: 'medium'
  }
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    type: 'restaurant',
    name: 'Sushi Yamamoto',
    description: 'Traditional sushi experience with omakase menu',
    location: 'Ginza, Tokyo',
    rating: 4.8,
    priceRange: '$$$',
    culturalNotes: 'Remove shoes at entrance. Sit quietly and trust the chef\'s selection.',
    imageUrl: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    type: 'attraction',
    name: 'Fushimi Inari Shrine',
    description: 'Iconic shrine with thousands of red torii gates',
    location: 'Kyoto',
    rating: 4.9,
    priceRange: '$',
    culturalNotes: 'Bow before entering shrine grounds. Cleanse hands at purification fountain.',
    imageUrl: 'https://images.pexels.com/photos/2829998/pexels-photo-2829998.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const CATEGORIES = [
  { id: 'greeting', name: 'Greetings', icon: '👋' },
  { id: 'dining', name: 'Dining', icon: '🍽️' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'transportation', name: 'Transport', icon: '🚗' },
  { id: 'customs', name: 'Customs', icon: '🏛️' }
];

export const CulturalGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry] = useState('Japan'); // In a real app, this would be dynamic
  
  const filteredTips = selectedCategory === 'all' 
    ? MOCK_CULTURAL_TIPS 
    : MOCK_CULTURAL_TIPS.filter(tip => tip.category === selectedCategory);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      default: return CheckCircle;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <MapPin className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Cultural Guide</h1>
        </motion.div>
        <p className="text-gray-600 text-lg">Essential cultural insights for {selectedCountry}</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            All Categories
          </motion.button>
          {CATEGORIES.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cultural Tips */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Cultural Tips & Etiquette</h2>
        <div className="grid gap-6">
          {filteredTips.map((tip) => {
            const UrgencyIcon = getUrgencyIcon(tip.urgency);
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full border flex items-center gap-1 ${getUrgencyColor(tip.urgency)}`}>
                    <UrgencyIcon className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">{tip.urgency}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Do</h4>
                    </div>
                    <ul className="space-y-2">
                      {tip.doAndDont.do.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-gray-900">Don't</h4>
                    </div>
                    <ul className="space-y-2">
                      {tip.doAndDont.dont.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Local Recommendations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Cultural Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {MOCK_RECOMMENDATIONS.map((rec) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={rec.imageUrl}
                  alt={rec.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{rec.name}</h3>
                    <p className="text-gray-600">{rec.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{rec.rating}</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{rec.priceRange}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{rec.description}</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Cultural Notes</h4>
                      <p className="text-blue-800 text-sm">{rec.culturalNotes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};