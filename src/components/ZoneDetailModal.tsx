/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { Zone, ZoneCrop, Crop, ReadingType, TFunction } from '../types';
import Modal from './Modal';
import GrowthStageWidget from './GrowthStageWidget';
import ZoneCropForm from './ZoneCropForm';
import DeleteConfirmation from './DeleteConfirmation';
import * as api from '../services/apiService';
import { useFarm } from '../contexts/FarmContext';

interface ZoneDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone;
  zoneCrops: ZoneCrop[];
  crops: Crop[];
  readingTypes: ReadingType[];
  t: TFunction;
  onAssignCrop: (zoneCropData: Omit<ZoneCrop, 'id'>) => Promise<any>;
  onUpdateZoneCrop: (zoneCropId: string, updates: Partial<ZoneCrop>) => Promise<any>;
}

const ZoneDetailModal: React.FC<ZoneDetailModalProps> = ({ isOpen, onClose, zone, zoneCrops, crops, readingTypes, t, onAssignCrop, onUpdateZoneCrop }) => {
    const { deleteZoneCrop } = useFarm();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeactivateConfirmOpen, setIsDeactivateConfirmOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [detailedCrop, setDetailedCrop] = useState<Crop | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    
    const safeZoneCrops = zoneCrops || [];
    const safeCrops = crops || [];
    const safeReadingTypes = readingTypes || [];

    const activeZoneCrop = useMemo(() => safeZoneCrops.find(zc => zc.zoneId === zone.id && zc.isActive), [safeZoneCrops, zone.id]);
    
    useEffect(() => {
        if (isOpen && !activeZoneCrop) {
            setIsEditing(true);
        }
    }, [isOpen, activeZoneCrop]);
    
    useEffect(() => {
        const fetchDetails = async () => {
            if (activeZoneCrop) {
                setIsLoadingDetails(true);
                setDetailedCrop(null);
                try {
                    const details = await api.getCropDetails(activeZoneCrop.cropId);
                    setDetailedCrop(details);
                } catch (error) {
                    console.error("Failed to fetch crop details for modal:", error);
                    setDetailedCrop(null);
                } finally {
                    setIsLoadingDetails(false);
                }
            } else {
                setDetailedCrop(null);
            }
        };
        if (isOpen) {
            fetchDetails();
        }
    }, [isOpen, activeZoneCrop]);

    const activeStage = useMemo(() => {
        if (!detailedCrop || !activeZoneCrop?.currentStageId) return undefined;
        return api.findStage(detailedCrop, activeZoneCrop.currentStageId);
    }, [detailedCrop, activeZoneCrop]);

    const handleSave = async (data: any) => {
        try {
            if (activeZoneCrop) {
                await onUpdateZoneCrop(activeZoneCrop.id, data);
            } else {
                await onAssignCrop({ ...data, zoneId: zone.id });
            }
            onClose(); 
        } catch (error) {
            console.error("Failed to save crop", error);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (activeZoneCrop) {
            try {
                await deleteZoneCrop(activeZoneCrop.id);
                setIsDeleteConfirmOpen(false);
                onClose();
            } catch (error) {
                console.error("Failed to delete active crop", error);
            }
        }
    };

    const handleDeactivateConfirm = () => {
        if (activeZoneCrop) {
            onUpdateZoneCrop(activeZoneCrop.id, { isActive: false, actualHarvestAt: new Date().toISOString() })
            .then(() => {
                setIsDeactivateConfirmOpen(false);
                setIsEditing(true);
            })
            .catch(error => {
                console.error("Failed to deactivate crop:", error);
            });
        }
    };

    const getModalTitle = () => {
        if (isEditing || !activeZoneCrop) {
            return activeZoneCrop ? `Update Crop in ${zone.name}` : `Plant Crop in ${zone.name}`;
        }
        return `Current Crop in ${zone.name}`;
    }
    
    const handleClose = () => {
        setIsEditing(false);
        onClose();
    }

    const renderContent = () => {
        if (isEditing || !activeZoneCrop) {
            return (
                <ZoneCropForm
                    zone={zone}
                    zoneCrop={isEditing && activeZoneCrop ? null : activeZoneCrop}
                    crops={safeCrops}
                    onSave={handleSave}
                    onClose={() => {
                        if (activeZoneCrop) { setIsEditing(false); } 
                        else { onClose(); }
                    }}
                />
            );
        }

        if (isLoadingDetails) {
            return (
                <div className="text-center p-8">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary"></div>
                    <p className="mt-4 text-sm text-slate-500">Loading crop details...</p>
                </div>
            );
        }

        if (activeZoneCrop && detailedCrop && activeStage) {
            return (
                <>
                    <GrowthStageWidget 
                        zoneCrop={activeZoneCrop}
                        crop={detailedCrop}
                        stage={activeStage}
                        readingTypes={safeReadingTypes}
                        t={t}
                    />
                    <div className="flex justify-between items-center pt-4 border-t border-border-light dark:border-border-dark">
                        <div className="flex gap-2">
                            <button onClick={() => setIsDeactivateConfirmOpen(true)} className="btn-secondary">Deactivate & Plant New</button>
                            <button onClick={() => setIsDeleteConfirmOpen(true)} className="btn-danger">Delete</button>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleClose} className="btn-secondary">Close</button>
                            <button onClick={() => setIsEditing(true)} className="btn-primary">Update</button>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <div className="text-center p-8">
                <p className="text-red-500">Failed to load crop details. Please try again.</p>
            </div>
        );
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} title={getModalTitle()}>
                <div className="space-y-6">
                    {renderContent()}
                </div>
                <style>{`
                    .btn-primary { padding: 0.5rem 1rem; background-color: #22c55e; color: white; border-radius: 0.375rem; border: none; transition: background-color 0.2s; font-weight: 600; }
                    .btn-primary:hover { background-color: #16a34a; }
                    .btn-secondary { padding: 0.5rem 1rem; background-color: #e2e8f0; color: #1e293b; border-radius: 0.375rem; border: none; transition: background-color 0.2s; font-weight: 600; }
                    .dark .btn-secondary { background-color: #475569; color: #e2e8f0; }
                    .btn-secondary:hover { background-color: #cbd5e1; }
                    .dark .btn-secondary:hover { background-color: #525f75; }
                    .btn-danger { padding: 0.5rem 1rem; background-color: #ef4444; color: white; border-radius: 0.375rem; border: none; transition: background-color 0.2s; font-weight: 600; }
                    .btn-danger:hover { background-color: #dc2626; }
                `}</style>
            </Modal>
            
            {activeZoneCrop && (
                <DeleteConfirmation
                    isOpen={isDeactivateConfirmOpen}
                    onClose={() => setIsDeactivateConfirmOpen(false)}
                    onConfirm={handleDeactivateConfirm}
                    itemName={`the crop "${activeZoneCrop.cropName}" and plant a new one`}
                    t={t}
                    title="Confirm Deactivation"
                    confirmText="Yes, Deactivate"
                />
            )}
            
            {activeZoneCrop && (
                <DeleteConfirmation
                    isOpen={isDeleteConfirmOpen}
                    onClose={() => setIsDeleteConfirmOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={`the crop "${activeZoneCrop.cropName}"`}
                    t={t}
                />
            )}
        </>
    );
};

export default ZoneDetailModal;