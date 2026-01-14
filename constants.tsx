
import React from 'react';
import { 
  Plane, 
  Hotel, 
  MapPin, 
  Calendar, 
  Users, 
  Utensils, 
  Wallet, 
  Compass, 
  Heart, 
  Camera, 
  Music, 
  Palmtree, 
  Wine, 
  Coffee 
} from 'lucide-react';

export const INTEREST_OPTIONS = [
  { id: 'museums', label: 'Museums & Galleries', icon: <Compass className="w-4 h-4" /> },
  { id: 'history', label: 'Historical Sites', icon: <MapPin className="w-4 h-4" /> },
  { id: 'food', label: 'Fine Dining', icon: <Utensils className="w-4 h-4" /> },
  { id: 'nature', label: 'Parks & Nature', icon: <Palmtree className="w-4 h-4" /> },
  { id: 'shopping', label: 'Shopping', icon: <Wallet className="w-4 h-4" /> },
  { id: 'nightlife', label: 'Nightlife', icon: <Music className="w-4 h-4" /> },
  { id: 'romantic', label: 'Romantic Spots', icon: <Heart className="w-4 h-4" /> },
  { id: 'photography', label: 'Photography', icon: <Camera className="w-4 h-4" /> },
  { id: 'wine', label: 'Wine Tasting', icon: <Wine className="w-4 h-4" /> },
  { id: 'cafe', label: 'Café Culture', icon: <Coffee className="w-4 h-4" /> },
];

export const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'No restrictions'
];

export const STEPS = [
  'Destination', 'Dates', 'Companions', 'Style', 'Interests', 'Dining', 'Budget'
];
