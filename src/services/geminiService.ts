/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Farm, Zone, Equipment, SensorReading, Alert, Crop, ZoneCrop } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ Gemini API Key is not configured. AI features will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface FarmAnalysisData {
  farm: Farm;
  zones: Zone[];
  zoneCrops: ZoneCrop[];
  crops: Crop[];
  equipment: Equipment[];
  readings: SensorReading[];
  alerts: Alert[];
}

export interface AIRecommendation {
  overallHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  summary: string;
  irrigation: {
    status: string;
    recommendations: string[];
  };
  fertilization: {
    status: string;
    recommendations: string[];
  };
  cropHealth: {
    status: string;
    issues: string[];
    recommendations: string[];
  };
  equipment: {
    status: string;
    issues: string[];
  };
  alerts: {
    critical: number;
    recommendations: string[];
  };
  nextActions: string[];
}

export async function analyzeZone(
  zone: Zone,
  zoneCrop: ZoneCrop | undefined,
  crop: Crop | undefined,
  equipment: Equipment[],
  readings: SensorReading[],
  alerts: Alert[]
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API is not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // تصحيح: استخدام model بدلاً من name أو equipmentmodel لأننا وحدنا الـ Type
  const equipmentList = equipment.map(eq => `- ${eq.model} (${eq.status})`).join('\n');
  
  const readingsList = readings.slice(-5).map(r => 
    `- ${r.readingType || 'Sensor'}: ${r.value} at ${new Date(r.timestamp).toLocaleTimeString()}`
  ).join('\n');

  const prompt = `
Analyze this specific farm zone and provide actionable recommendations:

**Zone:** ${zone.name}
- Area: ${zone.area} acres
- Soil Type: ${zone.soilType}
- Current Crop: ${crop?.name || 'None'}
- Days since planting: ${zoneCrop ? Math.floor((Date.now() - new Date(zoneCrop.plantedAt).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}

**Equipment in this zone:**
${equipmentList || 'No equipment'}

**Recent readings:**
${readingsList || 'No recent readings'}

**Alerts:**
${alerts.length} active alert(s)

Provide specific, actionable recommendations for this zone in 3-5 bullet points.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Failed to generate analysis. Please try again later.";
  }
}