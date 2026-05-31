import { GoogleGenAI } from "@google/genai";

// Lazy Initializer for GoogleGenAI to ensure no crashes during empty key states
let aiInstance: GoogleGenAI | null = null;

export function getAI() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    // Set up Google GenAI
    aiInstance = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_IF_EMPTY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

/**
 * Uses Gemini 3.5 Flash to automatically rewrite a rental or sale listing
 * into a highly professional, engaging Real Estate description, highlighting
 * features, security, amenities, and Kenyan market highlights.
 */
export async function optimizeListingDescription(
  name: string,
  type: string,
  county: string,
  town: string,
  bedrooms: number,
  originalDescription: string,
  amenities: string[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return `${originalDescription}\n\n[Optimized description generator is available when a Gemini API Key is configured in Settings]`;
  }

  try {
    const ai = getAI();
    const prompt = `
      You are an expert real estate copywriter in Kenya.
      Rewrite the following raw property listing into a highly engaging, professional, and alluring description for Makao Realtors (makaorealtors.co.ke).
      Make it appeal to Kenyan buyers or renters by using warm, trustworthy, and classy language. Incorporate the location, bedrooms, and amenities creatively. Mention why living/working in ${town}, ${county} is amazing. Make sure to stay accurate and retain his original points.

      Property Details:
      - Title of property: ${name}
      - Property Type: ${type}
      - Location: ${town}, ${county} County
      - Bedrooms: ${bedrooms === 0 ? "Bedsitter/Studio" : bedrooms + " Bedrooms"}
      - Amenities selected: ${amenities.join(", ") || "Standard amenities"}
      - Landlord's original description: "${originalDescription}"

      Please structure the output with:
      - A catchy, modern highlight sentence.
      - A flowing, premium description paragraph (2-3 sentences).
      - Bullet points under "Highlights & Amenities" if relevant.
      Return purely the rewritten text, formatted in clean Markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    if (response && response.text) {
      return response.text.trim();
    }
    return originalDescription;
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return originalDescription + "\n\n(AI Optimization currently unavailable)";
  }
}

/**
 * Handle conversational inquiries from users about different locations, counties, pricing, 
 * or general real estate advice in Kenya, referencing our active listings.
 */
export async function discussRealEstate(
  userInput: string,
  availableListingsSummary: string,
  chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] = []
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return `Jambo! I am MR Assistant. I can help search and advise you. (Configure a Gemini API Key in the Settings secrets to activate real-time Gemini recommendations!) \n\nHere is a local finder: Based on your query, we highly recommend checking out our top options like Nairobi's Kilimani Heights or Kiambu's Ruaka studios! Let me know if you would like me to detail these for you.`;
  }

  try {
    const ai = getAI();
    
    const formattedHistory = chatHistory.map(itm => ({
      role: itm.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: itm.parts[0].text }]
    }));

    const systemInstruction = `
      You are "MR Assistant" (makaorealtors.co.ke), an approachable, highly knowledgeable Kenyan housing brokerage helper powered by Gemini.
      Your goal is to friendly recommend, search, and answer user queries regarding Kenyan properties, locations (Nairobi, Kiambu, Machakos, Mombasa, etc.), and investment/rental advice.
      
      Below is a list of ACTIVE listings on the Makao Realtors platform for reference:
      ${availableListingsSummary}
      
      Guidelines:
      - Always communicate in English, but naturally sprinkle welcoming corporate Kenyan greetings like "Jambo!" or "Karibu!" to make users feel at home.
      - Recommend matching listings from the active dataset whenever a user asks about houses, location, bedrooms, budget, or type.
      - Be objective, transparent, and encouraging. Never invent property sizes or pricing numbers that contradict our dataset.
      - If no exact matches exist, politely offer alternative suggestions inside nearby counties (e.g., recommend Kiambu if Nairobi is expensive, or suggest Bungalow in Syokimau if they seek spacious family lots).
    `;

    const nextPrompt = `
      User prompt: "${userInput}"
      Provide a concise, helpful response. Emphasize matching property names beautifully if they exist.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: nextPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text?.trim() || "I am here to help you find your dream home on Makao Realtors.";
  } catch (error) {
    console.error("Gemini talk error:", error);
    return "Jambo! I'm currently running on standby mode. How can I help you find property listings in Nairobi or Kiambu today?";
  }
}
