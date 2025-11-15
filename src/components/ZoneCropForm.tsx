import React, { useState, useEffect, useMemo } from 'react';
import { ZoneCrop, Crop, Zone } from '../types';

interface ZoneCropFormProps {
  zone: Zone;
  zoneCrop?: ZoneCrop | null;
  crops: Crop[];
  onSave: (data: Omit<ZoneCrop, 'id'>) => void;
  onClose: () => void;
}

const ZoneCropForm: React.FC<ZoneCropFormProps> = ({ zone, zoneCrop, crops, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        cropId: zoneCrop?.cropId || crops[0]?.id || 0,
        seasonId: 0,
        currentStageId: zoneCrop?.currentStageId || 0,
        plantedAt: zoneCrop?.plantedAt ? zoneCrop.plantedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        expectedHarvestAt: zoneCrop?.expectedHarvestAt ? zoneCrop.expectedHarvestAt.split('T')[0] : '',
        isActive: zoneCrop?.isActive ?? true,
        yieldWeightKg: zoneCrop?.yieldWeightKg || 0,
        actualHarvestAt: zoneCrop?.actualHarvestAt ? zoneCrop.actualHarvestAt.split('T')[0] : '',
    });
    
    const selectedCrop = useMemo(() => crops.find(c => c.id === Number(formData.cropId)), [crops, formData.cropId]);
    const seasons = useMemo(() => selectedCrop?.seasons || [], [selectedCrop]);
    const selectedSeason = useMemo(() => seasons.find(s => s.id === Number(formData.seasonId)), [seasons, formData.seasonId]);
    const stages = useMemo(() => selectedSeason?.stages.sort((a,b) => a.order - b.order) || [], [selectedSeason]);

    useEffect(() => {
        if (zoneCrop) {
            const crop = crops.find(c => c.id === zoneCrop.cropId);
            const stage = crop?.seasons.flatMap(s => s.stages).find(st => st.id === zoneCrop.currentStageId);
            const season = crop?.seasons.find(s => s.id === stage?.cropSeasonId);
            setFormData(prev => ({
                ...prev,
                seasonId: season?.id || 0,
            }));
        }
    }, [zoneCrop, crops]);
    
    useEffect(() => {
        if (selectedCrop && (!formData.seasonId || !seasons.some(s => s.id === formData.seasonId))) {
             setFormData(prev => ({...prev, seasonId: seasons[0]?.id || 0 }));
        }
    }, [formData.cropId, seasons, selectedCrop]);
    
    useEffect(() => {
        if (selectedSeason && (!formData.currentStageId || !stages.some(s => s.id === formData.currentStageId))) {
            setFormData(prev => ({...prev, currentStageId: stages[0]?.id || 0 }));
        }
    }, [formData.seasonId, stages, selectedSeason]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData: Omit<ZoneCrop, 'id'> = {
            zoneId: zone.id,
            cropId: Number(formData.cropId),
            currentStageId: Number(formData.currentStageId),
            plantedAt: new Date(formData.plantedAt).toISOString(),
            expectedHarvestAt: new Date(formData.expectedHarvestAt).toISOString(),
            isActive: formData.isActive,
            yieldWeightKg: formData.yieldWeightKg ? Number(formData.yieldWeightKg) : undefined,
            actualHarvestAt: formData.actualHarvestAt ? new Date(formData.actualHarvestAt).toISOString() : undefined,
        };
        onSave(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Crop</label>
                    <select name="cropId" value={formData.cropId} onChange={handleChange} required className="w-full input">
                        {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Season</label>
                    <select name="seasonId" value={formData.seasonId} onChange={handleChange} required className="w-full input" disabled={!seasons.length}>
                        {seasons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Starting Stage</label>
                <select name="currentStageId" value={formData.currentStageId} onChange={handleChange} required className="w-full input" disabled={!stages.length}>
                    {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Planted At</label>
                    <input type="date" name="plantedAt" value={formData.plantedAt} onChange={handleChange} required className="w-full input" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Expected Harvest</label>
                    <input type="date" name="expectedHarvestAt" value={formData.expectedHarvestAt} onChange={handleChange} required className="w-full input" />
                </div>
            </div>
            <div className="border-t border-border-light dark:border-border-dark pt-4">
                 <div className="flex items-center justify-between">
                    <label htmlFor="isActive" className="font-medium text-black dark:text-white">Is Active Crop?</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="isActive" name="isActive" className="sr-only peer" checked={formData.isActive} onChange={handleChange}/>
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
            {!formData.isActive && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border-light dark:border-border-dark">
                    <div>
                        <label className="block text-sm font-medium mb-1">Actual Harvest Date</label>
                        <input type="date" name="actualHarvestAt" value={formData.actualHarvestAt} onChange={handleChange} className="w-full input" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Yield (kg)</label>
                        <input type="number" name="yieldWeightKg" value={formData.yieldWeightKg} onChange={handleChange} className="w-full input" />
                    </div>
                </div>
            )}
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Crop</button>
            </div>
            <style>{`
                .input {
                    display: block;
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                }
                .dark .input {
                    background-color: #1e293b;
                    border-color: #334155;
                }
                .btn-primary {
                    padding: 0.5rem 1rem;
                    background-color: #22c55e;
                    color: white;
                    border-radius: 0.375rem;
                    border: none;
                }
                 .btn-primary:hover {
                    background-color: #16a34a;
                }
                 .btn-secondary {
                    padding: 0.5rem 1rem;
                    background-color: #e2e8f0;
                    border-radius: 0.375rem;
                    border: none;
                }
                .dark .btn-secondary {
                    background-color: #334155;
                }
                 .btn-secondary:hover {
                    background-color: #cbd5e1;
                }
                 .dark .btn-secondary:hover {
                    background-color: #475569;
                }
            `}</style>
        </form>
    );
};

export default ZoneCropForm;
