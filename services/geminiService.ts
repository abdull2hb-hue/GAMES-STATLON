import { GoogleGenAI, Type } from "@google/genai";
import { Article, CATEGORIES } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate an ID
const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Generates structured gaming news using Gemini
 */
export const generateGamingNews = async (topic: string = "أحدث أخبار ألعاب الفيديو"): Promise<Article[]> => {
  try {
    const categoriesString = CATEGORIES.join(", ");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `قم بتوليد 4 مقالات إخبارية واقعية عن ${topic}.
      يجب أن تكون الأخبار باللغة العربية ومثيرة للاهتمام للاعبين.
      اختر التصنيف الأنسب لكل خبر من هذه القائمة بدقة: [${categoriesString}].`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING },
              source: { type: Type.STRING },
              imageUrlKeyword: { type: Type.STRING, description: "A specific english prompt for an image generator. E.g. 'Cyberpunk city neon', 'Mario running', 'Playstation 5 console'" }
            },
            required: ["title", "summary", "category", "source", "imageUrlKeyword"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Map to Article type and use Pollinations.ai for gaming specific images
    return rawData.map((item: any) => {
        const encodedPrompt = encodeURIComponent(item.imageUrlKeyword + " gaming high quality 4k");
        return {
          id: generateId(),
          title: item.title,
          summary: item.summary,
          category: item.category,
          source: item.source,
          date: new Date().toLocaleDateString('ar-SA'),
          // Using Pollinations for consistent gaming images
          imageUrl: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000)}`,
        };
    });

  } catch (error) {
    console.error("Error generating news:", error);
    return [];
  }
};

/**
 * Uses Google Search Grounding to find REAL latest news links and summaries
 */
export const searchLatestNews = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `ابحث عن آخر أخبار ${query} اليوم. لخص أهم الأحداث.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error searching news:", error);
    throw error;
  }
};

/**
 * Fetches latest tweets from a specific user and converts them into news articles
 */
export const fetchTweetsAsNews = async (username: string): Promise<Article[]> => {
  try {
    const categoriesString = CATEGORIES.join(", ");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the latest tweets from the user @${username} on X (Twitter).
      Select the 3 most recent tweets that are relevant to gaming or news updates.
      Convert them into news articles.
      Translate/Summarize the content into Arabic for the 'summary' and create a catchy 'title'.
      Select the best 'category' from: [${categoriesString}].
      For 'imageUrlKeyword', provide a descriptive English prompt for an image generator based on the tweet content.
      
      IMPORTANT: Return the result strictly as a valid JSON array. 
      Do not wrap it in markdown code blocks.
      Example format:
      [
        {
          "title": "Example Title",
          "summary": "Example Summary",
          "category": "Action",
          "imageUrlKeyword": "Example Image Prompt"
        }
      ]`,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema are incompatible with tools in some contexts or models, 
        // so we parse manually.
      }
    });

    let jsonString = response.text || "[]";
    // Clean up if the model wraps in markdown
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const rawData = JSON.parse(jsonString);
    
    return rawData.map((item: any) => {
      const encodedPrompt = encodeURIComponent(item.imageUrlKeyword + " video game aesthetic");
      return {
        id: generateId(),
        title: item.title,
        summary: item.summary,
        category: item.category,
        source: `@${username}`,
        date: new Date().toLocaleDateString('ar-SA'),
        imageUrl: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true`,
        url: `https://x.com/${username}`
      };
    });
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return [];
  }
};

/**
 * Structures user notes into a professional game review
 */
export const structureReviewWithAI = async (gameTitle: string, notes: string): Promise<{summary: string, rating: number, title: string}> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a professional gaming journalist (Arabic).
            I will provide a Game Title and some raw notes (or empty notes).
            Your task is to:
            1. Write a professional, concise review summary in Arabic based on the notes (or general knowledge if notes are sparse).
            2. Suggest a fair rating out of 10 based on the sentiment of the notes.
            3. Suggest a catchy title for the review.
            
            Game Title: ${gameTitle}
            User Notes: ${notes}
            
            Return strictly JSON:
            {
                "title": "string",
                "summary": "string",
                "rating": number (e.g. 8.5)
            }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        rating: { type: Type.NUMBER }
                    },
                    required: ["title", "summary", "rating"]
                }
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Error structuring review:", error);
        throw error;
    }
};