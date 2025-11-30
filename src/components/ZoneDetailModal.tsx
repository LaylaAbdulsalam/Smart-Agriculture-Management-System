/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Zone, ZoneCrop, Crop, ReadingType, TFunction } from '../types';
import Modal from './Modal';
import GrowthStageWidget from './GrowthStageWidget';
import ZoneCropForm from './ZoneCropForm';
import * as api from '../services/apiService';

interface ZoneDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone;
  zoneCrops: ZoneCrop[];
  crops: Crop[];
  readingTypes: ReadingType[];
  t: TFunction;
  onAssignCrop: (zoneCropData: Omit<ZoneCrop, 'id'>) => Promise<ZoneCrop>;
  onUpdateZoneCrop: (zoneCropId: string, updates: Partial<ZoneCrop>) => Promise<ZoneCrop>;
}

const ZoneDetailModal: React.FC<ZoneDetailModalProps> = ({ isOpen, onClose, zone, zoneCrops, crops, readingTypes, t, onAssignCrop, onUpdateZoneCrop }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const activeZoneCrop = zoneCrops.find(zc => zc.zoneId === zone.id && zc.isActive);
    const activeCrop = activeZoneCrop ? crops.find(c => c.id === activeZoneCrop.cropId) : undefined;
    const activeStage = activeCrop && activeZoneCrop && activeZoneCrop.currentStageId !== undefined ? api.findStage(activeCrop, activeZoneCrop.currentStageId) : undefined;

 const handleSave = (data: any) => {
        if (activeZoneCrop) {
            onUpdateZoneCrop(activeZoneCrop.id, data).then(() => {
                setIsFormVisible(false);
            });
        } else {
            onAssignCrop(data).then(() => {
                setIsFormVisible(false);
            });
        }
    };
    
    const handleDeactivate = () => {
        if (activeZoneCrop) {
            onUpdateZoneCrop(activeZoneCrop.id, { isActive: false, actualHarvestAt: new Date().toISOString() }).then(() => {
                onClose(); // Close main modal after deactivation
            });
        }
    };
    
    // Reset form visibility when modal is closed/re-opened
    React.useEffect(() => {
        if (!isOpen) {
            setIsFormVisible(false);
        }
    }, [isOpen]);

    const getModalTitle = () => {
        if(isFormVisible) {
            return activeZoneCrop ? `Update Crop in ${zone.name}` : `Plant Crop in ${zone.name}`;
        }
        return `Zone Details: ${zone.name}`;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
            {isFormVisible ? (
                <ZoneCropForm
                    zone={zone}
                    zoneCrop={activeZoneCrop}
                    crops={crops}
                    onSave={handleSave}
                    onClose={() => setIsFormVisible(false)}
                />
            ) : (
                <div className="space-y-6">
                    {activeCrop && activeStage && activeZoneCrop ? (
                        <>
                            <GrowthStageWidget 
                                zoneCrop={activeZoneCrop}
                                crop={activeCrop}
                                stage={activeStage}
                                readingTypes={readingTypes}
                                t={t}
                            />
                             <div className="flex justify-between items-center pt-4 border-t border-border-light dark:border-border-dark">
                                 <div>
                                    <button onClick={handleDeactivate} className="btn-secondary">Deactivate / Harvest</button>
                                </div>
                                <div className="flex gap-2">
                                     <button onClick={onClose} className="btn-secondary">Close</button>
                                     <button onClick={() => setIsFormVisible(true)} className="btn-primary">Update Crop Details</button>
                                </div>
                             </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                             <h3 className="text-lg font-semibold">No active crop in this zone.</h3>
                             <button onClick={() => setIsFormVisible(true)} className="mt-4 btn-primary">
                                + Plant a Crop
                            </button>
                        </div>
                    )}
                </div>
            )}
             <style>{`
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
        </Modal>
    );
};

export default ZoneDetailModal;
