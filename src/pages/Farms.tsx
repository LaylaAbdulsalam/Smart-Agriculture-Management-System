/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TFunction } from '../types';
import { useFarm } from '../contexts/FarmContext';
import Modal from '../components/Modal';
import FarmForm from '../components/FarmForm';
import DeleteConfirmation from '../components/DeleteConfirmation';

interface FarmsPageProps {
  t: TFunction;
}

const FarmsPage: React.FC<FarmsPageProps> = ({ t }) => {
  const { farms, addFarm, updateFarm, deleteFarm, setSelectedFarmId } = useFarm();
  const navigate = useNavigate();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);

  const handleOpenCreateModal = () => {
    setSelectedFarm(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (farm: any) => {
    setSelectedFarm(farm);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (farm: any) => {
    setSelectedFarm(farm);
    setIsDeleteModalOpen(true);
  };

  const handleSaveFarm = async (farmData: any) => {
    try {
      if (selectedFarm) {
        await updateFarm(selectedFarm.id, farmData);
      } else {
        await addFarm(farmData);
      }
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Failed to save farm:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedFarm) {
      try {
        await deleteFarm(selectedFarm.id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Failed to delete farm:', error);
      }
    }
  };
  
  const handleViewZones = (farmId: string) => {
    // 1. Update the global selected farm ID
    setSelectedFarmId(farmId);
    // 2. Navigate the user to the zones page
    navigate('/zones');
  };

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} 
             title={selectedFarm ? "Edit Farm" : "Create New Farm"}>
        <FarmForm key={selectedFarm?.id || 'new'} farm={selectedFarm} onSave={handleSaveFarm} onClose={() => setIsFormModalOpen(false)} />
      </Modal>
      
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName="farm"
        t={t}
      />
      
      <div className="space-y-6">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Farm Management</h2>
            <p className="text-text-light-secondary dark:text-dark-secondary mt-1">
              Create, view, and manage all of your farms.
            </p>
          </div>
          <button 
            onClick={handleOpenCreateModal} 
            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors"
          >
            + Create Farm
          </button>
        </div>

        {farms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map(farm => (
              <div key={farm.id} className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-md flex flex-col justify-between border border-border-light dark:border-border-dark">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">{farm.name}</h3>
                  <p className="text-sm text-text-light-secondary dark:text-dark-secondary mt-1 h-10 overflow-hidden">
                    {farm.description}
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span>📍</span> 
                      <span>{farm.location.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>🌍</span>
                      <span>Lat: {farm.location.lat.toFixed(4)}, Lon: {farm.location.lon.toFixed(4)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>🔢</span>
                      <span>{farm.code}</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <button
                    onClick={() => handleViewZones(farm.id)}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors text-sm"
                  >
                    View Zones
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEditModal(farm)} 
                      className="px-3 py-1 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleOpenDeleteModal(farm)} 
                      className="px-3 py-1 text-sm font-medium text-red-500 rounded-lg hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">No farms yet!</h3>
            <p className="text-text-light-secondary dark:text-dark-secondary mt-2">
              Get started by creating your first farm.
            </p>
            <button 
              onClick={handleOpenCreateModal} 
              className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors"
            >
              Create a Farm
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FarmsPage;