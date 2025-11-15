
import { GoogleGenAI, Type } from "@google/genai";
import { Zone, ZoneCrop, Crop, CropGrowthStage, SensorReading, ReadingType, CropStageRequirement } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  // This will be handled by the environment, but as a fallback for local dev:
  console.warn("API_KEY environment variable is not set. AI Features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    irrigationNeeded: { type: Type.BOOLEAN, description: 'Whether irrigation is needed right now.' },
    recommendationText: { type: Type.STRING, description: 'A concise, actionable recommendation for the farmer.' },
    cropHealthStatus: { type: Type.STRING, enum: ['Good', 'Fair', 'Critical'], description: 'Overall health assessment.' },
    wateringSchedule: { type: Type.STRING, description: 'A suggested watering schedule, e.g., "Irrigate for 20 minutes now." or "No watering needed today."' },
  },
  required: ['irrigationNeeded', 'recommendationText', 'cropHealthStatus', 'wateringSchedule']
};

export type AIRecommendation = {
    irrigationNeeded: boolean;
    recommendationText: string;
    cropHealthStatus: 'Good' | 'Fair' | 'Critical';
    wateringSchedule: string;
}

export async function getAIRecommendation(
  zone: Zone,
  zoneCrop: ZoneCrop,
  crop: Crop,
  stage: CropGrowthStage,
  requirements: CropStageRequirement[],
  latestReadings: { readingType: ReadingType, reading: SensorReading }[]
): Promise<AIRecommendation> {
  if(!API_KEY) {
      return Promise.reject("API Key is not configured.");
  }
  
  const readingsText = latestReadings.map(lr => `- ${lr.readingType.displayName}: ${lr.reading.value.toFixed(1)} ${lr.readingType.unit}`).join('\n');
  const requirementsText = requirements.map(req => {
      const readingType = latestReadings.find(lr => lr.readingType.id === req.readingTypeId)?.readingType;
      return `- ${readingType?.displayName}: Optimal range ${req.optimalMin}-${req.optimalMax} ${readingType?.unit}, Absolute range ${req.minValue}-${req.maxValue} ${readingType?.unit}`;
  }).join('\n');

  const prompt = `
    You are an expert agricultural AI assistant for a smart farm.
    Based on the following real-time data for a specific farm zone, provide a JSON object with your analysis and recommendations.

    Context:
    - Zone Name: ${zone.name}
    - Currently Planted Crop: ${crop.name}
    - Current Growth Stage: ${stage.name}

    Ideal Conditions for this Stage:
    ${requirementsText}

    Current Sensor Readings:
    ${readingsText}
    
    Analysis Task:
    Compare the "Current Sensor Readings" to the "Ideal Conditions for this Stage". 
    1. Determine if irrigation is needed. Irrigation is critical if any reading is outside the absolute range. It is recommended if readings are outside the optimal range but within the absolute range.
    2. Assess the overall crop health status ('Good', 'Fair', 'Critical') based on how many readings are off-target.
    3. Provide a very concise, actionable recommendation for the farmer.
    4. Suggest a clear watering schedule (e.g., "Irrigate for 30 minutes now", "Monitor, no action needed", "Check for equipment fault").

    Return a single JSON object matching the required schema. Do not include any other text or markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    if (
        typeof parsedJson.irrigationNeeded === 'boolean' &&
        typeof parsedJson.recommendationText === 'string' &&
        ['Good', 'Fair', 'Critical'].includes(parsedJson.cropHealthStatus) &&
        typeof parsedJson.wateringSchedule === 'string'
    ) {
        return parsedJson as AIRecommendation;
    } else {
        throw new Error("AI response does not match the expected format.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}
