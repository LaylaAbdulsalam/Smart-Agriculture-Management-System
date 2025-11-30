import { GoogleGenerativeAI } from '@google/generative-ai';
import { Farm, Zone, Equipment, SensorReading, Alert, Crop, ZoneCrop } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ Gemini API Key is not configured. AI features will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// ============================================
// 📊 AI Report Generation
// ============================================

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

export async function generateFarmReport(data: FarmAnalysisData): Promise<AIRecommendation> {
  if (!genAI) {
    throw new Error('Gemini API is not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  
  const prompt = `
You are an expert agricultural advisor. Analyze the following farm data and provide comprehensive recommendations.

**Farm Information:**
- Name: ${data.farm.name}
- Location: ${data.farm.location.address}
- Total Zones: ${data.zones.length}

**Zones Data:**
${data.zones.map(zone => {
  const zoneCrop = data.zoneCrops.find(zc => zc.zoneId === zone.id && zc.isActive);
  const crop = zoneCrop ? data.crops.find(c => c.id === zoneCrop.cropId) : null;
  return `
- Zone: ${zone.name}
  - Area: ${zone.area} acres
  - Soil Type: ${zone.soilType}
  - Current Crop: ${crop?.name || 'None'}
  - Planted Date: ${zoneCrop?.plantedAt || 'N/A'}
`;
}).join('\n')}

**Equipment Status:**
${data.equipment.map(eq => `
- ${eq.model} (${eq.serialNumber})
  - Zone: ${data.zones.find(z => z.id === eq.zoneId)?.name}
  - Status: ${eq.status}
`).join('\n')}

**Recent Sensor Readings (last 10):**
${data.readings.slice(-10).map(r => {
  const equipment = data.equipment.find(eq => eq.id === r.equipmentId);
  return `- Equipment ${equipment?.model}: ${r.value} at ${new Date(r.timestamp).toLocaleString()}`;
}).join('\n')}

**Active Alerts:**
${data.alerts.filter(a => !a.isAcknowledged).map(a => `
- ${a.message} (${new Date(a.timestamp).toLocaleString()})
`).join('\n') || 'None'}

**Please provide:**
1. Overall farm health assessment (Excellent/Good/Fair/Poor/Critical)
2. Summary of current status
3. Irrigation recommendations
4. Fertilization recommendations
5. Crop health analysis
6. Equipment status review
7. Alert analysis and priority actions
8. Next recommended actions

Format your response as a JSON object matching this structure:
{
  "overallHealth": "Good",
  "summary": "Brief overall assessment...",
  "irrigation": {
    "status": "Current irrigation status",
    "recommendations": ["recommendation 1", "recommendation 2"]
  },
  "fertilization": {
    "status": "Current fertilization status",
    "recommendations": ["recommendation 1"]
  },
  "cropHealth": {
    "status": "Overall crop health",
    "issues": ["issue 1"],
    "recommendations": ["recommendation 1"]
  },
  "equipment": {
    "status": "Equipment status",
    "issues": ["issue 1"]
  },
  "alerts": {
    "critical": 0,
    "recommendations": ["action 1"]
  },
  "nextActions": ["action 1", "action 2", "action 3"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate farm report');
  }
}

// ============================================
// 🌱 Zone-Specific Analysis
// ============================================

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

  const prompt = `
Analyze this specific farm zone and provide actionable recommendations:

**Zone:** ${zone.name}
- Area: ${zone.area} acres
- Soil Type: ${zone.soilType}
- Current Crop: ${crop?.name || 'None'}
- Days since planting: ${zoneCrop ? Math.floor((Date.now() - new Date(zoneCrop.plantedAt).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}

**Equipment in this zone:**
${equipment.map(eq => `- ${eq.model}: ${eq.status}`).join('\n')}

**Recent readings:**
${readings.slice(-5).map(r => `- Value: ${r.value} at ${new Date(r.timestamp).toLocaleTimeString()}`).join('\n')}

**Alerts:**
${alerts.length} active alert(s)

Provide specific, actionable recommendations for this zone in 3-5 bullet points.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}