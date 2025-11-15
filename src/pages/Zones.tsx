import React, { useState } from 'react';
import { Zone, ZoneCrop, Equipment, SensorReading, Alert, TFunction, AppContext, Zone as ZoneType } from '../types';
import ZoneCard from '../components/ZoneCard';
import Modal from '../components/Modal';
import ZoneForm from '../components/ZoneForm';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ZoneDetailModal from '../components/ZoneDetailModal';
import * as api from '../services/apiService';

interface ZonesProps {
  zones: ZoneType[];
  setZones: React.Dispatch<React.SetStateAction<ZoneType[]>>;
  zoneCrops: ZoneCrop[];
  equipments: Equipment[];
  readings: SensorReading[];
  alerts: Alert[];
  t: TFunction;
  farmId: number | null;
  appContext: AppContext;
  onAssignCrop: (zoneCropData: Omit<ZoneCrop, 'id'>) => Promise<ZoneCrop>;
  onUpdateZoneCrop: (zoneCropId: number, updates: Partial<ZoneCrop>) => Promise<ZoneCrop>;
}

const Zones: React.FC<ZonesProps> = ({ 
  zones, setZones, zoneCrops, equipments, readings, alerts, t, farmId, appContext,
  onAssignCrop, onUpdateZoneCrop 
}) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [selectedZone, setSelectedZone] = useState<ZoneType | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedZone(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (zone: ZoneType) => {
    setSelectedZone(zone);
    setIsFormModalOpen(true);
  };
  
  const handleOpenDeleteModal = (zone: ZoneType) => {
    setSelectedZone(zone);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetailModal = (zone: ZoneType) => {
    setSelectedZone(zone);
    setIsDetailModalOpen(true);
  };

  const handleSaveZone = (zoneData: Omit<ZoneType, 'id'|'farmId'>) => {
    if(!farmId) return;
    if (selectedZone) {
      api.updateZone(selectedZone.id, zoneData).then(updatedZone => {
        setZones(prev => prev.map(z => z.id === updatedZone.id ? updatedZone : z));
      });
    } else {
      api.createZone({ ...zoneData, farmId }).then(newZone => {
        setZones(prev => [...prev, newZone]);
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedZone) {
        api.deleteZone(selectedZone.id).then(() => {
            setZones(prev => prev.filter(z => z.id !== selectedZone.id));
        });
    }
    setIsDeleteModalOpen(false);
  };
  
  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedZone ? "Edit Zone" : "Create New Zone"}>
        <ZoneForm zone={selectedZone} onSave={handleSaveZone} onClose={() => setIsFormModalOpen(false)} />
      </Modal>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName="zone"
        t={t}
      />
      {selectedZone && (
        <ZoneDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          zone={selectedZone}
          zoneCrops={zoneCrops}
          crops={appContext.crops}
          readingTypes={appContext.readingTypes}
          t={t}
          onAssignCrop={onAssignCrop}
          onUpdateZoneCrop={onUpdateZoneCrop}
        />
      )}

      <div className="space-y-6">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-white">{t('zonesPage.title')}</h2>
            <p className="text-text-light-secondary dark:text-dark-secondary mt-1">{t('zonesPage.description')}</p>
          </div>
           <button onClick={handleOpenCreateModal} disabled={!farmId} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors disabled:bg-gray-400">
            + Create Zone
          </button>
        </div>

        {zones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map(zone => {
                    const activeCrop = zoneCrops.find(zc => zc.zoneId === zone.id && zc.isActive);
                    const zoneEquipments = equipments.filter(eq => eq.zoneId === zone.id);
                    const zoneReadings = readings.filter(r => zoneEquipments.some(eq => eq.id === r.equipmentId));
                    const zoneAlerts = alerts.filter(a => a.zoneId === zone.id && !a.isAcknowledged);

                    return (
                    <ZoneCard 
                        key={zone.id} 
                        zone={zone} 
                        activeCropDetails={activeCrop ? {
                            zoneCrop: activeCrop,
                            crop: appContext.crops.find(c => c.id === activeCrop.cropId)
                        }: undefined}
                        readings={zoneReadings}
                        readingTypes={appContext.readingTypes}
                        alerts={zoneAlerts}
                        t={t}
                        onEdit={() => handleOpenEditModal(zone)}
                        onDelete={() => handleOpenDeleteModal(zone)}
                        onViewDetails={() => handleOpenDetailModal(zone)}
                    />
                    )
                })}
            </div>
        ) : (
            <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-md">
                <h3 className="text-xl font-semibold">{farmId ? "No zones in this farm yet." : "Please select a farm."}</h3>
                {farmId && <p className="text-text-light-secondary dark:text-dark-secondary mt-2">Get started by creating your first zone.</p>}
                 {farmId && <button onClick={handleOpenCreateModal} className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
                    Create a Zone
                </button>}
            </div>
        )}
      </div>
    </>
  );
};

export default Zones;