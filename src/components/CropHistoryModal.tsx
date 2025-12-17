import React, { useState } from 'react';
import { Zone, ZoneCrop } from '../types';
import Modal from './Modal';
import DeleteConfirmation from './DeleteConfirmation';
import { useFarm } from '../contexts/FarmContext';

interface CropHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone;
  zoneCrops: ZoneCrop[];
}

const CropHistoryModal: React.FC<CropHistoryModalProps> = ({ isOpen, onClose, zone, zoneCrops }) => {
  const { deleteZoneCrop } = useFarm();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState<ZoneCrop | null>(null);

  const allCropsForZone = zoneCrops.filter(zc => zc.zoneId === zone.id);
  const activeCrop = allCropsForZone.find(zc => zc.isActive);
  const previousCrops = allCropsForZone
    .filter(zc => zc.id !== activeCrop?.id)
    .sort((a, b) => new Date(b.plantedAt).getTime() - new Date(a.plantedAt).getTime());

  const handleDeleteClick = (crop: ZoneCrop) => {
    setCropToDelete(crop);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (cropToDelete) {
      await deleteZoneCrop(cropToDelete.id);
      setIsConfirmOpen(false);
      setCropToDelete(null);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Crop History for ${zone.name}`} widthClass="max-w-3xl">
        <div className="mt-2 pt-4">
          {previousCrops.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto pr-2 rounded-lg border border-border-light dark:border-border-dark">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Previous Crop
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Planted Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Harvest Date (Est.)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {previousCrops.map((crop) => (
                    <tr key={crop.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black dark:text-white">
                        {crop.cropName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {new Date(crop.plantedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {(() => {
                          if (crop.expectedHarvestAt) {
                            return new Date(crop.expectedHarvestAt).toLocaleDateString();
                          }
                          const plantedDate = new Date(crop.plantedAt);
                          const mockHarvestDate = new Date(plantedDate.setDate(plantedDate.getDate() + 90));
                          return `~ ${mockHarvestDate.toLocaleDateString()}`;
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button onClick={() => handleDeleteClick(crop)} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-10 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-black dark:text-white">No Crop History</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">There are no previously recorded crops for this zone.</p>
            </div>
          )}
        </div>
      </Modal>

      {cropToDelete && (
        <DeleteConfirmation
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={`the history for "${cropToDelete.cropName}"`}
          title="Confirm History Deletion"
          confirmText="Yes, Delete History"
        />
      )}
    </>
  );
};

export default CropHistoryModal;