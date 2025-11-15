import React, { useState } from 'react';
import { Equipment, Zone, SensorReading, ReadingType, EquipmentStatus, TFunction } from '../types';
import Modal from '../components/Modal';
import EquipmentForm from '../components/EquipmentForm';
import DeleteConfirmation from '../components/DeleteConfirmation';
import * as api from '../services/apiService';


interface EquipmentPageProps {
    equipments: Equipment[];
    setEquipments: React.Dispatch<React.SetStateAction<Equipment[]>>;
    zones: Zone[];
    readings: SensorReading[];
    readingTypes: ReadingType[];
    t: TFunction;
    farmId: number | null;
}

const statusClasses = {
  [EquipmentStatus.Active]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [EquipmentStatus.Fault]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [EquipmentStatus.Inactive]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};


const EquipmentPage: React.FC<EquipmentPageProps> = ({ equipments, setEquipments, zones, readings, readingTypes, t, farmId }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedEquipment(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setIsFormModalOpen(true);
  };
  
  const handleOpenDeleteModal = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEquipment = (equipmentData: Omit<Equipment, 'id'|'lastReadingAt'>) => {
    if (selectedEquipment) {
      api.updateEquipment(selectedEquipment.id, equipmentData).then(updatedEq => {
        setEquipments(prev => prev.map(e => e.id === updatedEq.id ? updatedEq : e));
      });
    } else {
      api.createEquipment(equipmentData).then(newEq => {
        setEquipments(prev => [...prev, newEq]);
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedEquipment) {
        api.deleteEquipment(selectedEquipment.id).then(() => {
            setEquipments(prev => prev.filter(e => e.id !== selectedEquipment.id));
        });
    }
    setIsDeleteModalOpen(false);
  };


  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedEquipment ? "Edit Equipment" : "Add New Equipment"}>
        <EquipmentForm 
            equipment={selectedEquipment} 
            onSave={handleSaveEquipment} 
            onClose={() => setIsFormModalOpen(false)}
            zones={zones}
            readingTypes={readingTypes}
        />
      </Modal>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName="equipment"
        t={t}
      />
      <div className="space-y-6">
       <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md flex justify-between items-center">
            <div>
                <h2 className="text-xl font-semibold text-black dark:text-white">{t('equipmentPage.title')}</h2>
                <p className="text-text-light-secondary dark:text-dark-secondary mt-1">
                    {t('equipmentPage.description')}
                </p>
            </div>
            <button onClick={handleOpenCreateModal} disabled={!farmId || zones.length === 0} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors disabled:bg-gray-400">
                + Add Equipment
            </button>
        </div>
      
      <div className="overflow-x-auto bg-card-light dark:bg-card-dark rounded-xl shadow-md">
        <table className="w-full text-sm text-left rtl:text-right text-text-light-secondary dark:text-dark-secondary">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700 text-text-light-secondary dark:text-dark-secondary">
            <tr>
              <th scope="col" className="px-6 py-3">{t('equipmentPage.equipment')}</th>
              <th scope="col" className="px-6 py-3">{t('equipmentPage.zone')}</th>
              <th scope="col" className="px-6 py-3">{t('equipmentPage.type')}</th>
              <th scope="col" className="px-6 py-3">{t('equipmentPage.status')}</th>
              <th scope="col" className="px-6 py-3">{t('equipmentPage.value')}</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((eq) => {
                const zone = zones.find(z => z.id === eq.zoneId);
                const readingType = readingTypes.find(rt => rt.id === eq.readingTypeId);
                const lastReading = readings
                    .filter(r => r.equipmentId === eq.id)
                    .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

                return (
                  <tr key={eq.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <th scope="row" className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">
                        <p>{eq.model}</p>
                        <p className="text-xs font-normal text-text-light-secondary dark:text-dark-secondary">SN: {eq.serialNumber}</p>
                    </th>
                    <td className="px-6 py-4">{zone?.name}</td>
                    <td className="px-6 py-4">{readingType?.displayName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[eq.status]}`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-black dark:text-white">
                        {lastReading ? `${lastReading.value.toFixed(1)} ${readingType?.unit}`: 'N/A'}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => handleOpenEditModal(eq)} className="font-medium text-primary hover:underline">Edit</button>
                        <button onClick={() => handleOpenDeleteModal(eq)} className="font-medium text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default EquipmentPage;
