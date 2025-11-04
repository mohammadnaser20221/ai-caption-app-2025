import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash';

/**
 * Generates a caption for a given image.
 * @param base64Image The base64 encoded image string.
 * @param mimeType The MIME type of the image.
 * @param userPrompt The user-provided prompt.
 * @returns The generated caption as a string.
 */
export async function generateCaptionForImage(base64Image: string, mimeType: string, userPrompt: string): Promise<string> {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };

  const textPart = {
    text: `You are an expert social media caption writer. Based on the user's request and the image, generate a creative, fun, or descriptive caption.
    User request: "${userPrompt}". 
    Generate a single, ready-to-use caption. Include relevant hashtags at the end. Make it engaging.`,
  };

  try {
    const response = await ai.models.generateContent({
        model: visionModel,
        contents: { parts: [imagePart, textPart] }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating caption for image:", error);
    throw new Error("Failed to generate caption from the image. Please try again.");
  }
}


/**
 * Generates a caption for a given video.
 * @param base64Video The base64 encoded video string.
 * @param mimeType The MIME type of the video.
 * @param userPrompt The user-provided prompt.
 * @returns The generated caption as a string.
 */
export async function generateCaptionForVideo(base64Video: string, mimeType: string, userPrompt: string): Promise<string> {
    const videoPart = {
        inlineData: {
            data: base64Video,
            mimeType,
        },
    };

    const textPart = {
        text: `You are an expert social media caption writer. Analyze this video and the user's request to generate a compelling caption. The caption should be creative, engaging, and relevant to the video content.
        User request: "${userPrompt}". 
        Generate a single, ready-to-use caption. Include relevant hashtags at the end.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: visionModel,
            contents: { parts: [videoPart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating caption for video:", error);
        throw new Error("Failed to generate caption. The video may be too long or in an unsupported format. Please try a shorter clip.");
    }
}


/**
 * Generates a caption for a given text.
 * @param inputText The text to generate a caption for.
 * @returns The generated caption as a string.
 */
export async function generateCaptionForText(inputText: string): Promise<string> {
  const prompt = `You are an expert social media caption writer. Analyze the following text and generate a smart, creative, or funny caption. Suggest relevant hashtags.
  
  Input Text: "${inputText}"
  
  Generate a single, ready-to-use caption.`;

  try {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating caption for text:", error);
    throw new Error("Failed to generate caption from the text. Please try again.");
  }
}