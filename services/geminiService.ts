
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, CompleteItinerary } from "../types";

// Initializing the Gemini client using named parameters and process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ITINERARY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    tripTitle: { type: Type.STRING },
    destination: { type: Type.STRING },
    dates: { type: Type.STRING },
    outboundFlight: {
      type: Type.OBJECT,
      properties: {
        airline: { type: Type.STRING },
        flightNumber: { type: Type.STRING },
        departureTime: { type: Type.STRING },
        arrivalTime: { type: Type.STRING },
        duration: { type: Type.STRING },
        price: { type: Type.NUMBER },
        layovers: { type: Type.STRING },
      },
      required: ["airline", "price", "departureTime", "arrivalTime"]
    },
    returnFlight: {
      type: Type.OBJECT,
      properties: {
        airline: { type: Type.STRING },
        flightNumber: { type: Type.STRING },
        departureTime: { type: Type.STRING },
        arrivalTime: { type: Type.STRING },
        duration: { type: Type.STRING },
        price: { type: Type.NUMBER },
        layovers: { type: Type.STRING },
      },
      required: ["airline", "price"]
    },
    hotel: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        location: { type: Type.STRING },
        rating: { type: Type.NUMBER },
        pricePerNight: { type: Type.NUMBER },
        features: { type: Type.ARRAY, items: { type: Type.STRING } },
        description: { type: Type.STRING },
      },
      required: ["name", "pricePerNight", "location"]
    },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          date: { type: Type.STRING },
          title: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                isTip: { type: Type.BOOLEAN },
              },
              required: ["time", "title", "description"]
            }
          }
        },
        required: ["day", "activities"]
      }
    },
    diningRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          cuisine: { type: Type.STRING },
          priceLevel: { type: Type.STRING },
          reason: { type: Type.STRING },
        }
      }
    },
    travelTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    budgetCategories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          color: { type: Type.STRING },
        }
      }
    },
    totalEstimate: { type: Type.NUMBER }
  },
  required: ["tripTitle", "outboundFlight", "hotel", "days", "totalEstimate"]
};

export async function generateItinerary(prefs: UserPreferences): Promise<CompleteItinerary> {
  // Determine currency context
  const getCurrencyName = (dest: string) => {
    const d = dest.toLowerCase();
    if (d.includes('india') || d.includes('goa') || d.includes('chennai')) return 'Indian Rupees (INR)';
    if (d.includes('usa') || d.includes('york')) return 'US Dollars (USD)';
    if (d.includes('europe') || d.includes('france')) return 'Euros (EUR)';
    if (d.includes('uk') || d.includes('london')) return 'British Pounds (GBP)';
    if (d.includes('japan')) return 'Japanese Yen (JPY)';
    return 'Local Currency';
  };

  const currencyContext = getCurrencyName(prefs.destination);

  const prompt = `
    You are a specialized Local Travel Expert for the destination: ${prefs.destination}.
    
    CRITICAL INSTRUCTION:
    Your task is to create an itinerary that captures the AUTHENTIC essence of ${prefs.destination}. 
    For example, if the destination is GOA, you MUST include its world-famous beaches (Palolem, Baga), Portuguese heritage sites (Old Goa, Basilica of Bom Jesus), and vibrant shack culture. 
    DO NOT use generic "Museum" or "Gallery" descriptions that could be in any city. 
    Match the user's interests (below) to the SPECIFIC local versions of those activities in ${prefs.destination}.

    User Preferences:
    - Origin: ${prefs.origin}
    - Destination: ${prefs.destination}
    - Dates: ${prefs.startDate} to ${prefs.endDate}
    - Travelers: ${prefs.travelers} (${prefs.travelType})
    - Luxury Level: ${prefs.luxuryLevel}/5
    - Travel Pace: ${prefs.pace}
    - Interests: ${prefs.interests.join(', ')}
    - Dietary Needs: ${prefs.dietary.join(', ')}
    - Target Budget per person: ${prefs.budget} in ${currencyContext}
    - Custom Requests: ${prefs.additionalRequests}

    Structure the itinerary day-by-day:
    1. Identify the top 5 most iconic, non-negotiable landmarks for ${prefs.destination} and ensure they are included.
    2. Weave in the user's specific interests (${prefs.interests.join(', ')}) using only local, relevant venues.
    3. Ensure all names of restaurants, hotels, and sights are real and famous within ${prefs.destination}.
    4. All costs must be in ${currencyContext}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ITINERARY_SCHEMA as any,
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini API");
    }

    return JSON.parse(response.text.trim()) as CompleteItinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}
