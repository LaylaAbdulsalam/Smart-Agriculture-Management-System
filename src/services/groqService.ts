/* eslint-disable @typescript-eslint/no-explicit-any */
import Groq from 'groq-sdk';
import { Zone, Equipment, SensorReading, Alert, Crop, ZoneCrop } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn('⚠️ Groq API Key is not configured. AI features will not work.');
}

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true }) : null;

export async function analyzeZone(
  zone: Zone,
  zoneCrop: ZoneCrop | undefined,
  crop: Crop | undefined,
  equipment: Equipment[],
  readings: SensorReading[],
  alerts: Alert[]
): Promise<string> {
  if (!groq) {
    throw new Error('Groq API is not configured. Please check your VITE_GROQ_API_KEY environment variable.');
  }

  const equipmentList = equipment.length > 0 ? equipment.map(eq => `- ${eq.model} (Status: ${eq.status})`).join('\n') : 'No equipment data available.';
  const readingsList = readings.length > 0 ? readings.slice(-10).map(r => `- ${r.readingType || 'Sensor'}: ${r.value} at ${new Date(r.timestamp).toLocaleTimeString()}`).join('\n') : 'No recent readings available.';
  const alertsList = alerts.length > 0 ? alerts.map(a => `- ${a.message} (Severity: ${a.severity})`).join('\n') : 'No active alerts.';

  const prompt = `
You are an expert agricultural analyst. Your task is to analyze the following data from a specific farm zone and provide concise, actionable recommendations for a farmer.

**Analysis Data:**
- **Zone Name:** ${zone.name}
- **Area:** ${zone.area} acres
- **Soil Type:** ${zone.soilType}
- **Current Crop:** ${crop?.name || 'Not specified'}
- **Days Since Planting:** ${zoneCrop ? Math.floor((Date.now() - new Date(zoneCrop.plantedAt).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}

**Equipment in Zone:**
${equipmentList}

**Last 10 Sensor Readings:**
${readingsList}

**Active Alerts:**
${alertsList}

**Your Task:**
Based on all the data above, provide a short analysis and 3 to 4 clear, actionable bullet points for the farmer. Focus on immediate priorities. Structure your response in Markdown. For example:
**Overall Health: Good**
- **Recommendation 1:** ...
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 300,
    });

    const result = chatCompletion.choices[0]?.message?.content || "No analysis could be generated.";
    return result;

  } catch (error: any) {
    console.error("AI Analysis Error from Groq:", error);
    if (error.status === 401) {
      return "Failed to generate analysis: The provided Groq API key is not valid.";
    }
    const errorMessage = error.error?.message || error.message || "An unknown error occurred.";
    return `Failed to generate analysis. Error: ${errorMessage}`;
  }
}