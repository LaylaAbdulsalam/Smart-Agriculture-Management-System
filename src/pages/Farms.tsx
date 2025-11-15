import React, { useState } from 'react';
import { Farm, TFunction } from '../types';
import Modal from '../components/Modal';
import FarmForm from '../components/FarmForm';
import DeleteConfirmation from '../components/DeleteConfirmation';

interface FarmsPageProps {
  farms: Farm[];
  t: TFunction;
  onAddFarm: (farmData: Omit<Farm, 'id' | 'ownerUserId'>) => void;
  onUpdateFarm: (farmId: number, farmData: Partial<Farm>) => void;
  onDeleteFarm: (farmId: number) => void;
}

const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block me-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block me-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 6.293a1 1 0 00-1.414 1.414L8.586 9H7a1 1 0 100 2h1.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414l-3-3z" clipRule="evenodd" /></svg>;


const FarmCard: React.FC<{farm: Farm, onEdit: () => void, onDelete: () => void}> = ({ farm, onEdit, onDelete }) => (
    <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-md flex flex-col justify-between border border-border-light dark:border-border-dark">
        <div>
            <h3 className="text-lg font-bold text-black dark:text-white">{farm.name}</h3>
            <p className="text-sm text-text-light-secondary dark:text-dark-secondary mt-1 h-10">{farm.description}</p>
            <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center"><LocationIcon /> {farm.location.address}</p>
                <p className="flex items-center"><CodeIcon /> {farm.code}</p>
            </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
            <button onClick={onEdit} className="px-3 py-1 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">Edit</button>
            <button onClick={onDelete} className="px-3 py-1 text-sm font-medium text-red-500 rounded-lg hover:bg-red-500/10">Delete</button>
        </div>
    </div>
);


const FarmsPage: React.FC<FarmsPageProps> = ({ farms, t, onAddFarm, onUpdateFarm, onDeleteFarm }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

    const handleOpenCreateModal = () => {
        setSelectedFarm(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (farm: Farm) => {
        setSelectedFarm(farm);
        setIsFormModalOpen(true);
    };

    const handleOpenDeleteModal = (farm: Farm) => {
        setSelectedFarm(farm);
        setIsDeleteModalOpen(true);
    };

    const handleSaveFarm = (farmData: any) => {
        if (selectedFarm) {
            onUpdateFarm(selectedFarm.id, farmData);
        } else {
            onAddFarm(farmData);
        }
        setIsFormModalOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (selectedFarm) {
            onDeleteFarm(selectedFarm.id);
        }
        setIsDeleteModalOpen(false);
    };

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedFarm ? "Edit Farm" : "Create New Farm"}>
        <FarmForm farm={selectedFarm} onSave={handleSaveFarm} onClose={() => setIsFormModalOpen(false)} />
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
            <p className="text-text-light-secondary dark:text-dark-secondary mt-1">Create, view, and manage all of your farms.</p>
          </div>
          <button onClick={handleOpenCreateModal} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
            + Create Farm
          </button>
        </div>

        {farms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farms.map(farm => (
                    <FarmCard key={farm.id} farm={farm} onEdit={() => handleOpenEditModal(farm)} onDelete={() => handleOpenDeleteModal(farm)} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-md">
                <h3 className="text-xl font-semibold">No farms yet!</h3>
                <p className="text-text-light-secondary dark:text-dark-secondary mt-2">Get started by creating your first farm.</p>
                <button onClick={handleOpenCreateModal} className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
                    Create a Farm
                </button>
            </div>
        )}
      </div>
    </>
  );
};

export default FarmsPage;
