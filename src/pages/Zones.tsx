import React, { useState } from 'react';
import { TFunction, Zone as ZoneType } from '../types';
import { useFarm } from '../contexts/FarmContext';
import ZoneCard from '../components/ZoneCard';
import Modal from '../components/Modal';
import ZoneForm from '../components/ZoneForm';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ZoneDetailModal from '../components/ZoneDetailModal';

interface ZonesProps {
  t: TFunction;
}

const Zones: React.FC<ZonesProps> = ({ t }) => {
  const { 
    zones, 
    zoneCrops, 
    equipments, 
    readings, 
    alerts, 
    selectedFarmId, 
    cropCatalog, 
    readingTypes,
    addZone, 
    updateZone, 
    deleteZone, 
    assignCropToZone, 
    updateZoneCrop 
  } = useFarm();

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

  const handleSaveZone = async (zoneData: Omit<ZoneType, 'id'|'farmId'>) => {
  if (!selectedFarmId) return;
  
  try {
    if (selectedZone) {
      await updateZone(selectedZone.id, zoneData);
    } else {
      await addZone({ ...zoneData, farmId: selectedFarmId });
    }
    setIsFormModalOpen(false);
  } catch (error) {
    console.error("Error saving zone:", error);
  }
};

  const handleDeleteConfirm = async () => {
    if (selectedZone) {
      try {
        await deleteZone(selectedZone.id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting zone:", error);
      }
    }
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
          crops={cropCatalog}
          readingTypes={readingTypes}
          t={t}
          onAssignCrop={assignCropToZone}
          onUpdateZoneCrop={updateZoneCrop}
        />
      )}

      <div className="space-y-6">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-white">{t('zonesPage.title')}</h2>
            <p className="text-text-light-secondary dark:text-dark-secondary mt-1">{t('zonesPage.description')}</p>
          </div>
           <button 
             onClick={handleOpenCreateModal} 
             disabled={!selectedFarmId} 
             className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors disabled:bg-gray-400"
           >
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
                            crop: cropCatalog.find(c => c.id === activeCrop.cropId)
                        }: undefined}
                        readings={zoneReadings}
                        readingTypes={readingTypes}
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
                <h3 className="text-xl font-semibold">{selectedFarmId ? "No zones in this farm yet." : "Please select a farm."}</h3>
                {selectedFarmId && <p className="text-text-light-secondary dark:text-dark-secondary mt-2">Get started by creating your first zone.</p>}
                 {selectedFarmId && <button onClick={handleOpenCreateModal} className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
                    Create a Zone
                </button>}
            </div>
        )}
      </div>
    </>
  );
};

export default Zones;