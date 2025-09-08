import { GoogleGenAI, Modality, Part, GenerateContentResponse } from "@google/genai";
import { fileToBase64 } from '../utils/fileUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `Role: Virtual photographer.

Goal: Create one cohesive, photorealistic family portrait.

Inputs:
- Several photos of individuals or small groups.
- One background (text description or image).

Instructions:
- Extract every person from all source photos. Do not omit anyone.
- Do not copy the original poses.
- Create new, natural poses so they look together and comfortable, interacting like a real family portrait.
- Arrange the group in a balanced composition; consider heights and relationships.
- Blend everyone into the chosen background with consistent lighting, shadows, color, and perspective.
- Preserve each person’s face and clothing from the source photos.
- Output: one high-resolution image.`;

export type BackgroundInput = { type: 'text'; value: string } | { type: 'image'; value: File };

export const generateFamilyPortrait = async (
  personFiles: File[],
  background: BackgroundInput
): Promise<{ image: string | null; text: string | null }> => {
  if (personFiles.length === 0) {
    throw new Error("No person photos provided for generation.");
  }

  const personImagePartsPromises: Promise<Part>[] = personFiles.map(async (file) => {
    const base64Data = await fileToBase64(file);
    return {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    };
  });

  const personImageParts = await Promise.all(personImagePartsPromises);

  const finalParts: Part[] = [...personImageParts];

  const instructionText = `Combine all people from the ${personFiles.length} preceding images into a single, cohesive family portrait.`;

  if (background.type === 'text') {
    finalParts.push({
      text: `${instructionText} The background should be: ${background.value}`,
    });
  } else {
    const base64Data = await fileToBase64(background.value);
    const backgroundImagePart: Part = {
      inlineData: {
        data: base64Data,
        mimeType: background.value.type,
      },
    };
    finalParts.push(backgroundImagePart);
    finalParts.push({
      text: `${instructionText} Place them naturally into this final image, which serves as the background.`,
    });
  }
  
  const contents = {
    parts: finalParts,
  };

  const config = {
    systemInstruction,
    responseModalities: [Modality.IMAGE, Modality.TEXT],
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents,
      config
    });

    let image: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          image = part.inlineData.data;
        } else if (part.text) {
          text = part.text;
        }
      }
    }
    
    if (!image) {
      console.warn("API response did not contain an image part.", response);
    }

    return { image, text };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate portrait. Please check your prompt and images and try again.");
  }
};