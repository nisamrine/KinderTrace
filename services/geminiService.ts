
import { GoogleGenAI, Type } from "@google/genai";
import { StoryPage } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMonthlyStorybook = async (childName: string, month: string, observations: string): Promise<StoryPage[]> => {
  const ai = getAI();
  
  const prompt = `Create a 5-page whimsical children's storybook for a child named ${childName} covering their adventures in the month of ${month}. 
  Base the story on these pedagogical observations: ${observations}.
  The story should be divided into exactly 5 pages. 
  Each page should have:
  1. A "text" field: 2-3 warm, playful sentences suitable for parents.
  2. An "imagePrompt" field: A detailed description for an AI image generator to create a Manga-style illustration of this specific scene.
  
  Return the output as a JSON array of 5 objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      temperature: 0.9,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
          },
          required: ["text", "imagePrompt"],
        },
      },
    },
  });

  try {
    const pages: StoryPage[] = JSON.parse(response.text);
    return pages.slice(0, 5);
  } catch (e) {
    console.error("Failed to parse storybook JSON", e);
    return [
      { text: `Today was a magical start for ${childName}.`, imagePrompt: "A happy child playing with blocks" },
      { text: `${childName} discovered the joy of sharing.`, imagePrompt: "Children sharing toys" },
      { text: "Naps were filled with sweet dreams.", imagePrompt: "A child sleeping peacefully" },
      { text: "The garden was full of wonders.", imagePrompt: "A child exploring flowers" },
      { text: "We can't wait for next month's adventures!", imagePrompt: "A group of happy children waving" },
    ];
  }
};

export const generateStoryImage = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A vibrant, high-quality Manga-style caricature illustration for a children's book. Whimsical daycare setting. Scene: ${prompt}. Clean lines, soft watercolor textures, professional digital art, magical atmosphere.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
