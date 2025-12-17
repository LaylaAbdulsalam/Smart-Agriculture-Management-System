import React from 'react';
import { ZoneCrop, Crop, CropGrowthStage, ReadingType, TFunction, CropSeason, CropStageRequirement } from '../types';

interface GrowthStageWidgetProps {
  zoneCrop: ZoneCrop;
  crop: Crop;
  stage: CropGrowthStage;
  readingTypes: ReadingType[];
  t: TFunction;
}

const RequirementItem: React.FC<{ name: string, range: string, unit: string }> = ({ name, range, unit }) => (
    <div className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark last:border-b-0">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm font-semibold">{range} {unit}</span>
    </div>
);

const GrowthStageWidget: React.FC<GrowthStageWidgetProps> = ({ zoneCrop, crop, stage, readingTypes, t }) => {
    // --- GUARDS ADDED HERE ---
    const safeSeasons = crop.seasons || [];
    const safeStages = stage.requirements || [];
    const safeReadingTypes = readingTypes || [];

    const plantedDate = new Date(zoneCrop.plantedAt);
    const today = new Date();
    const daysSincePlanted = Math.floor((today.getTime() - plantedDate.getTime()) / (1000 * 3600 * 24));
    
    let daysInStage = 0;
    let progressPercent = 0;
    
    const currentStageOrder = stage.order;
    
    const season = safeSeasons.find((s: CropSeason) => (s.stages || []).some((st: CropGrowthStage) => st.id === stage.id));
    
    const previousStagesDuration = season?.stages
        .filter((s: CropGrowthStage) => s.order < currentStageOrder)
        .reduce((acc: number, s: CropGrowthStage) => acc + s.durationDays, 0) || 0;

    daysInStage = daysSincePlanted - previousStagesDuration;
    if (daysInStage < 0) daysInStage = 0;
    
    if(stage.durationDays > 0) {
        progressPercent = Math.min(100, (daysInStage / stage.durationDays) * 100);
    }

    const nextStage = season?.stages.find((s: CropGrowthStage) => s.order === currentStageOrder + 1);

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4">
            <h3 className="font-bold text-lg">{crop.name} - {t('zoneCard.stage', {defaultValue: 'Stage'})}: {stage.stagename}</h3>
            
            <div>
                <div className="flex justify-between text-sm mb-1 text-text-light-secondary dark:text-dark-secondary">
                    <span>Day {daysInStage} of {stage.durationDays}</span>
                    {nextStage && <span>Next: {nextStage.stagename}</span>}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-black dark:text-white">Stage Requirements</h4>
                <div className="space-y-1">
                    {safeStages.map((req: CropStageRequirement) => {
                        const readingType = safeReadingTypes.find(rt => rt.code === req.readingTypeCode);
                        if (!readingType) return null;
                        return (
                            <RequirementItem 
                                key={req.id}
                                name={readingType.displayName}
                                range={`${req.optimalMin} - ${req.optimalMax}`}
                                unit={readingType.unit}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default GrowthStageWidget;