export interface User {
  uid: string;
  phoneNumber: string;
  displayName?: string;
  photoURL?: string;
  preferredLanguages: string[];
  currentLocation?: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language?: string;
  translation?: string;
  type?: 'text' | 'image' | 'location' | 'recommendation';
  metadata?: any;
}

export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context: 'general' | 'food' | 'transportation' | 'accommodation' | 'cultural';
  confidence: number;
}

export interface CulturalTip {
  id: string;
  country: string;
  category: 'greeting' | 'dining' | 'shopping' | 'transportation' | 'customs';
  title: string;
  description: string;
  doAndDont: {
    do: string[];
    dont: string[];
  };
  urgency: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  type: 'restaurant' | 'attraction' | 'activity' | 'accommodation';
  name: string;
  description: string;
  location: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$';
  culturalNotes: string;
  imageUrl?: string;
}