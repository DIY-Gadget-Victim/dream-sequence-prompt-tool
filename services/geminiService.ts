import { GoogleGenAI } from "@google/genai";
import { Scene, VideoGenerationConfig } from '../types';

export const DEFAULT_PROMPT_TEMPLATE = `(Cinematic visual style defined by: {QUESTION}): {ANSWER}. 

CAMERA MOVEMENT: Continuous, slow-motion forward dolly (zoom in). The camera never stops moving forward.

START STATE: The video begins by emerging from a macro, extreme close-up of a neutral texture (mist/fog/blur) that matches the aesthetic of {QUESTION}.

MIDDLE STATE: As the camera moves forward, the scene reveals the representation of {ANSWER} in the center of the frame. The environment is immersive and fully detailed.

END STATE: The camera continues moving forward, eventually pushing extremely close into a texture within the scene until the screen is filled with a macro blur/mist, obscuring the details and returning to a neutral state.

AUDIO: Purely ambient and atmospheric soundscape. NO speech, NO dialogue, NO voices. Ethereal, abstract, deep textures that blend seamlessly.

TECHNICAL: 4k resolution, photorealistic, 10 seconds, temporal smoothing, consistent lighting.`;

export const constructPrompt = (question: string, answer: string, template: string = DEFAULT_PROMPT_TEMPLATE): string => {
  return template
    .replace(/{QUESTION}/g, question)
    .replace(/{ANSWER}/g, answer);
};

export const generateVideoForScene = async (
  scene: Scene,
  config: VideoGenerationConfig,
  modelName: string = 'veo-3.1-generate-preview'
): Promise<string> => {
  // Always create a new instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const generationConfig: any = {
        numberOfVideos: 1,
        aspectRatio: config.aspectRatio,
    };

    // The 'resolution' parameter is specific to Veo 3.1 models. 
    // Sending it to older models (Veo 2.0, Veo 3.0) causes a 400 INVALID_ARGUMENT error.
    if (modelName.includes('veo-3.1')) {
        generationConfig.resolution = config.resolution;
    }

    let operation = await ai.models.generateVideos({
      model: modelName,
      prompt: scene.prompt,
      config: generationConfig
    });

    // Polling loop
    while (!operation.done) {
      // Wait 10 seconds before next poll for video generation
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
        throw new Error(operation.error.message || "Unknown generation error");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("No video URI returned from API");
    }

    return videoUri;
  } catch (error: any) {
    console.error("Video generation failed:", error);
    throw error;
  }
};