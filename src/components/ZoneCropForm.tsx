/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import { ZoneCrop, Crop, Zone } from '../types';
import * as api from '../services/apiService';

interface ZoneCropFormProps {
  zone: Zone;
  zoneCrop?: ZoneCrop | null;
  crops: Crop[];
  onSave: (data: any) => void;
  onClose: () => void;
}

const ZoneCropForm: React.FC<ZoneCropFormProps> = ({ zone, zoneCrop, crops, onSave, onClose }) => {
    
    const [formData, setFormData] = useState(() => {
        const initialCropId = zoneCrop?.cropId || (crops.length > 0 ? crops[0].id : '');
        return {
            cropId: initialCropId,
            seasonId: '',
            currentStageId: zoneCrop?.currentStageId?.toString() || '',
            plantedAt: zoneCrop?.plantedAt ? zoneCrop.plantedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            expectedHarvestAt: zoneCrop?.expectedHarvestAt ? zoneCrop.expectedHarvestAt.split('T')[0] : '',
        };
    });
    
    const [detailedCrop, setDetailedCrop] = useState<Crop | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchDetailsAndUpdateForm = async () => {
            if (formData.cropId) {
                setIsLoadingDetails(true);
                setDetailedCrop(null); 
                try {
                    const details = await api.getCropDetails(String(formData.cropId));
                    setDetailedCrop(details);

                    const seasons = details?.seasons || [];
                    const stages = (details?.growthStages || []).sort((a: any, b: any) => a.order - b.order);

                    if (!zoneCrop || formData.cropId !== zoneCrop.cropId) {
                        setFormData(prev => ({
                            ...prev,
                            seasonId: seasons.length > 0 ? String(seasons[0].id) : '',
                            currentStageId: stages.length > 0 ? String(stages[0].id) : '',
                        }));
                    }
                } catch (error) {
                    console.error("Could not fetch crop details:", error);
                } finally {
                    setIsLoadingDetails(false);
                }
            }
        };
        fetchDetailsAndUpdateForm();
    }, [formData.cropId, zoneCrop]);

    const seasons = useMemo(() => detailedCrop?.seasons || [], [detailedCrop]);
    const stages = useMemo(() => (detailedCrop?.growthStages || []).sort((a: any, b: any) => a.order - b.order), [detailedCrop]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let submissionData;

        if (zoneCrop) {
            submissionData = {
                cropgrowthstageid: formData.currentStageId,
            };
        } else {
            submissionData = {
                zoneid: zone.id,
                cropid: formData.cropId,
                cropgrowthstageid: formData.currentStageId,
                plantingdate: new Date(formData.plantedAt).toISOString().split('T')[0],
                expectedharvestat: formData.expectedHarvestAt ? new Date(formData.expectedHarvestAt).toISOString().split('T')[0] : null,
                isactive: true,
            };
        }
        onSave(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Crop</label>
                    <select name="cropId" value={formData.cropId} onChange={handleChange} required className="w-full input" disabled={!!zoneCrop}>
                        {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Season</label>
                    <select name="seasonId" value={formData.seasonId} onChange={handleChange} required className="w-full input" disabled={isLoadingDetails || seasons.length === 0}>
                        {isLoadingDetails ? <option>Loading...</option> : 
                         seasons.length === 0 ? <option>No seasons found</option> :
                         seasons.map((s: any) => <option key={s.id} value={s.id}>{s.seasonname || s.name}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Starting Stage</label>
                <select name="currentStageId" value={formData.currentStageId} onChange={handleChange} required className="w-full input" disabled={isLoadingDetails || stages.length === 0}>
                     {isLoadingDetails ? <option>Loading stages...</option> :
                      stages.length === 0 ? <option>No stages found</option> :
                      stages.map((s: any) => <option key={s.id} value={s.id}>{s.stagename || s.name}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Planted At</label>
                    <input type="date" name="plantedAt" value={formData.plantedAt} onChange={handleChange} required className="w-full input" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Expected Harvest</label>
                    <input type="date" name="expectedHarvestAt" value={formData.expectedHarvestAt} onChange={handleChange} className="w-full input" />
                </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4 border-t border-border-light dark:border-border-dark mt-6">
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Crop</button>
            </div>
            <style>{`
                .input { display: block; width: 100%; padding: 0.5rem 0.75rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.375rem; }
                .dark .input { background-color: #1e293b; border-color: #334155; }
                .btn-primary { padding: 0.5rem 1rem; background-color: #22c55e; color: white; border-radius: 0.375rem; border: none; }
                .btn-primary:hover { background-color: #16a34a; }
                .btn-secondary { padding: 0.5rem 1rem; background-color: #e2e8f0; border-radius: 0.375rem; border: none; }
                .dark .btn-secondary { background-color: #334155; }
                .btn-secondary:hover { background-color: #cbd5e1; }
                .dark .btn-secondary:hover { background-color: #475569; }
            `}</style>
        </form>
    );
};

export default ZoneCropForm;