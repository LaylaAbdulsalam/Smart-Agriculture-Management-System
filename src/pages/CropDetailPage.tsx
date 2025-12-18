/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TFunction, Crop, CropSeason } from '../types';
import * as api from '../services/apiService';
import { useFarm } from '../contexts/FarmContext';
import CropIcon from '../assets/crop.png'; 
import GrowthIcon from '../assets/growing-plant.png'; 

// Helper function to get a readable range for a requirement
const getRequirementRange = (crop: Crop | null, readingTypeCode: string, type: 'optimal' | 'acceptable'): string => {
    if (!crop || !crop.growthstages) return 'N/A';
    const allReqs = crop.growthstages.flatMap(stage => stage.requirements || []);
    const relevantReqs = allReqs.filter(req => req.readingtypecode === readingTypeCode);
    if (relevantReqs.length === 0) {
        if (readingTypeCode === 'LIGHT') return '30000 - 60000 Lux';
        return 'N/A';
    }
    
    const minKey = type === 'optimal' ? 'optimalmin' : 'minvalue';
    const maxKey = type === 'optimal' ? 'optimalmax' : 'maxvalue';

    const min = Math.min(...relevantReqs.map(r => r[minKey]));
    const max = Math.max(...relevantReqs.map(r => r[maxKey]));
    const unit = relevantReqs[0].unit || '';

    if (min === max) return `${min}${unit}`;
    const formattedMin = parseFloat(min.toFixed(2));
    const formattedMax = parseFloat(max.toFixed(2));
    return `${formattedMin} - ${formattedMax} ${unit}`;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthToName = (month: number) => monthNames[month - 1] || '';


const HeaderCard: React.FC<{ crop: Crop; description: string; t: TFunction }> = ({ crop, description, t }) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-32 w-32 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-slate-300 dark:border-slate-600 overflow-hidden">
              <img src={CropIcon} alt={crop.name} className="h-full w-full object-cover" />
            </div>
            <div>
                <h2 className="text-4xl font-extrabold text-black dark:text-white tracking-tight">
                  {t(`crops.${crop.name}`, { defaultValue: crop.name })}
                </h2>
                <p className="text-text-light-secondary dark:text-slate-400 mt-2 text-lg">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

const DetailCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20">
        <h3 className="text-xl font-bold mb-4 text-primary">
          {title}
        </h3>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

const DetailRow: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-border-light dark:border-border-dark">
        <span className="font-medium text-text-light-secondary dark:text-dark-secondary">{label}</span>
        <span className="font-semibold text-black dark:text-white text-right">{value || 'N/A'}</span>
    </div>
);

const SeasonsCard: React.FC<{ seasons: CropSeason[]; t: TFunction }> = ({ seasons, t }) => (
    <div className="md:col-span-2 lg:col-span-3">
        <DetailCard title="Seasons">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...seasons].sort((a, b) => {
                    if (a.seasonname.includes('Primary')) return -1;
                    if (b.seasonname.includes('Primary')) return 1;
                    return a.seasonname.localeCompare(b.seasonname);
                }).map(season => (
                    <div key={season.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
                        <h4 className="font-bold text-black dark:text-white">{t(`seasons.${season.seasonname}`, {defaultValue: season.seasonname})}</h4>

                       <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-dark-secondary mt-1">
                          <img src={CropIcon} alt="Planting" className="h-4 w-4" />
                          <span>Recommended planting month: <strong>{monthToName(season.plantingstartmonth)}</strong></span>
                       </div>
                        <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-dark-secondary">
                            <img src={GrowthIcon} alt="Expected growth" className="h-4 w-4" />
                            <span>Expected growth: {season.expectedrangedays} days.</span>
                        </div>
                    </div>
                ))}
            </div>
        </DetailCard>
    </div>
);


// --- MAIN COMPONENT ---

const CropDetailPage: React.FC<{ t: TFunction }> = ({ t }) => {
  const { cropId } = useParams<{ cropId: string }>();
  const navigate = useNavigate();
  const [crop, setCrop] = React.useState<Crop | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { zones, zoneCrops } = useFarm();

  React.useEffect(() => {
    if (cropId) {
      const fetchCrop = async () => {
        try { setLoading(true); const data = await api.getCropDetails(cropId); setCrop(data); } 
        catch (error) { console.error("Failed to fetch crop details:", error); } 
        finally { setLoading(false); }
      };
      fetchCrop();
    }
  }, [cropId]);

  const dynamicDescription = useMemo(() => {
    if (!crop) return '';
    const activePlantings = zoneCrops.filter(zc => zc.cropId === crop.id && zc.isActive);
    if (activePlantings.length === 0) {
      return "This crop is not currently planted in any of your farm's zones.";
    }
    const locations = activePlantings.map(zc => zones.find(z => z.id === zc.zoneId)?.name).filter(Boolean);
    return `Currently active in your farm: ${[...new Set(locations)].join(', ')}.`;
  }, [crop, zoneCrops, zones]);

  const conditions = useMemo(() => ({
      optimalTemp: getRequirementRange(crop, 'TEMP', 'optimal'),
      acceptableTemp: getRequirementRange(crop, 'TEMP', 'acceptable'),
      optimalSoilTemp: getRequirementRange(crop, 'SOIL_TEMP', 'optimal'),
      acceptableSoilTemp: getRequirementRange(crop, 'SOIL_TEMP', 'acceptable'),
      optimalMoisture: getRequirementRange(crop, 'MOIST', 'optimal'),
      acceptableMoisture: getRequirementRange(crop, 'MOIST', 'acceptable'),
      optimalPh: getRequirementRange(crop, 'PH', 'optimal'),
      acceptablePh: getRequirementRange(crop, 'PH', 'acceptable'),
      optimalEc: getRequirementRange(crop, 'EC', 'optimal'),
      acceptableEc: getRequirementRange(crop, 'EC', 'acceptable'),
      optimalLight: getRequirementRange(crop, 'LIGHT', 'optimal'),
      acceptableLight: getRequirementRange(crop, 'LIGHT', 'acceptable'),
  }), [crop]);

  if (loading) { return <div className="text-center py-16">{t('cropDetail.loading')}</div>; }
  if (!crop) { return <div className="text-center py-16">{t('cropDetail.notFound')}</div>; }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/crop-guide')} className="flex items-center gap-2 font-semibold text-primary hover:underline">
        &larr; {t('cropDetail.back')}
      </button>

      <HeaderCard crop={crop} description={dynamicDescription} t={t} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DetailCard title={t('cropDetail.growthStages')}>
            {(crop.growthstages || []).map(stage => (
                <DetailRow key={stage.id} label={t(`stages.${stage.stagename}`)} value={`${stage.durationdays} days`} />
            ))}
        </DetailCard>
        
        <DetailCard title={t('cropDetail.optimalConditions')}>
            <DetailRow label="Soil Types" value={crop.soilTypes?.join(', ') || 'Various'} />
            <DetailRow label="Air Temperature" value={conditions.optimalTemp} />
            <DetailRow label="Soil Temperature" value={conditions.optimalSoilTemp} />
            <DetailRow label="Soil Moisture" value={conditions.optimalMoisture} />
            <DetailRow label="Soil pH" value={conditions.optimalPh} />
            <DetailRow label="EC (Salinity)" value={conditions.optimalEc} />
            <DetailRow label="Light Intensity" value={conditions.optimalLight} />
        </DetailCard>

        <DetailCard title="Acceptable Conditions">
            <DetailRow label="Air Temperature" value={conditions.acceptableTemp} />
            <DetailRow label="Soil Temperature" value={conditions.acceptableSoilTemp} />
            <DetailRow label="Soil Moisture" value={conditions.acceptableMoisture} />
            <DetailRow label="Soil pH" value={conditions.acceptablePh} />
            <DetailRow label="EC (Salinity)" value={conditions.acceptableEc} />
            <DetailRow label="Light Intensity" value={conditions.acceptableLight} />
        </DetailCard>

        {(crop.seasons && crop.seasons.length > 0) && (
            <SeasonsCard seasons={crop.seasons} t={t} />
        )}
      </div>
    </div>
  );
};

export default CropDetailPage;