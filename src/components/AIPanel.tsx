import React, { useState } from 'react';
import { TFunction, Zone } from '../types';
import { useFarm } from '../contexts/FarmContext';
import { analyzeZone } from '../services/geminiService';

interface AIPanelProps {
  t: TFunction;
}

const AIPanel: React.FC<AIPanelProps> = ({ t }) => {
  const { zones, zoneCrops, cropCatalog, equipments, readings, alerts } = useFarm();
  
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedZoneId) return;

    setLoading(true);
    setAnalysisResult(null);

    try {
      const zone = zones.find(z => z.id === selectedZoneId) as Zone;
      const zoneCrop = zoneCrops.find(zc => zc.zoneId === selectedZoneId && zc.isActive);
      
      const crop = zoneCrop ? cropCatalog.find(c => c.id === zoneCrop.cropId) : undefined;
      
      const zoneEquipment = equipments.filter(eq => eq.zoneId === selectedZoneId);
      const zoneReadings = readings.filter(r => 
        zoneEquipment.some(eq => eq.id === r.equipmentId)
      );
      const zoneAlerts = alerts.filter(a => a.zoneId === selectedZoneId);

      const result = await analyzeZone(
        zone, 
        zoneCrop, 
        crop, 
        zoneEquipment, 
        zoneReadings, 
        zoneAlerts
      );
      
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysisResult("Failed to analyze zone. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md h-full flex flex-col border border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          {t('aiPanel.title') || 'AI Precision Agriculture'}
        </h3>
      </div>
      
      <div className="space-y-4 grow flex flex-col">
        <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-dark-secondary mb-1">
            Select Zone to Analyze
          </label>
          <div className="flex gap-2">
            <select 
              value={selectedZoneId} 
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="grow p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="" disabled>-- Select Zone --</option>
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
            <button 
              onClick={handleAnalyze}
              disabled={!selectedZoneId || loading}
              className="bg-primary hover:bg-primary-focus text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        <div className="grow bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 overflow-y-auto border border-dashed border-slate-200 dark:border-slate-700">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-primary animate-pulse">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm">Generating insights...</p>
            </div>
          ) : analysisResult ? (
            <div className="prose dark:prose-invert text-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text-light-secondary dark:text-dark-secondary text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-sm">
                Select a zone to get AI-powered insights for a specific crop and its current growth stage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;