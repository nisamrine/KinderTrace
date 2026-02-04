
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

  try {
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

    const pages: StoryPage[] = JSON.parse(response.text || "[]");
    return pages.slice(0, 5);
  } catch (e) {
    console.error("Failed to generate storybook text", e);
    // Fallback content in case of error
    return [
      { text: `Today was a magical start for ${childName}.`, imagePrompt: "A happy child playing with blocks" },
      { text: `${childName} discovered the joy of sharing.`, imagePrompt: "Children sharing toys" },
      { text: "Naps were filled with sweet dreams.", imagePrompt: "A child sleeping peacefully" },
      { text: "The garden was full of wonders.", imagePrompt: "A child exploring flowers" },
      { text: "We can't wait for next month's adventures!", imagePrompt: "A group of happy children waving" },
    ];
  }
};

// Helper to fetch local image and convert to Base64
async function getBase64FromUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch image at ${url}: ${response.statusText}`);
      return null;
    }
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Error converting image to base64, proceeding without reference image:", error);
    return null;
  }
}

export const generateStoryImage = async (prompt: string, referenceImageUrl?: string, visualDescription?: string) => {
  const ai = getAI();
  const parts: any[] = [];

  // If a reference image is provided (the child's avatar), include it to guide the character generation
  if (referenceImageUrl) {
    const base64Data = await getBase64FromUrl(referenceImageUrl);
    if (base64Data) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', 
          data: base64Data
        }
      });
    } else {
        console.warn("Proceeding with image generation without reference image due to fetch failure.");
    }
  }

  // Add the text prompt
  const characterPrompt = visualDescription 
    ? `The main character is ${visualDescription}. Ensure the character in the illustration closely resembles this description and the provided reference image.`
    : `The main character should look like the child in the provided reference image.`;

  parts.push({
    text: `Generate a high-quality Manga-style illustration for a children's book.
    ${characterPrompt}
    Scene: ${prompt}. 
    Style: Soft watercolor textures, whimsical, professional digital art, expressive, magical atmosphere, consistent character design.`
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Leveraging Gemini 3 Pro for high-quality image generation with reference
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e: any) {
    console.error("Image generation failed", e);
    // If it's a permission denied error, log a specific message about billing/API key
    if (e.message?.includes('403') || e.status === 'PERMISSION_DENIED') {
        console.error("CRITICAL: 403 Permission Denied. Please ensure you have selected a valid API Key with billing enabled.");
    }
  }
  return null;
};
