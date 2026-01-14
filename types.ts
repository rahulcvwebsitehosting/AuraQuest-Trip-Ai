
export enum TravelType {
  SOLO = 'Solo adventure',
  COUPLE = 'Couple/Romantic getaway',
  FAMILY = 'Family trip',
  FRIENDS = 'Friends group',
  BUSINESS = 'Business + leisure'
}

export enum PaceType {
  RELAXED = 'Relaxed (2-3 activities/day)',
  BALANCED = 'Balanced (3-4 activities/day)',
  PACKED = 'Packed (5+ activities/day)'
}

export interface UserPreferences {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  travelType: TravelType;
  luxuryLevel: number; // 1-5
  pace: PaceType;
  interests: string[];
  dietary: string[];
  budget: number;
  email: string;
  additionalRequests: string;
}

export interface FlightOption {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  layovers: string;
}

export interface HotelRecommendation {
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  features: string[];
  description: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  cost: number;
  isTip?: boolean;
}

export interface DayItinerary {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
}

export interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

export interface CompleteItinerary {
  tripTitle: string;
  destination: string;
  dates: string;
  outboundFlight: FlightOption;
  returnFlight: FlightOption;
  hotel: HotelRecommendation;
  days: DayItinerary[];
  diningRecommendations: Array<{
    name: string;
    type: string;
    cuisine: string;
    priceLevel: string;
    reason: string;
  }>;
  travelTips: string[];
  budgetCategories: BudgetCategory[];
  totalEstimate: number;
}
