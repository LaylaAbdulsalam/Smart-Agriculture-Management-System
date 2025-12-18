import React, { useState, useEffect } from 'react';
import { TFunction, Crop } from '../types';
import * as api from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import CropCard from '../components/CropCard';

interface CropGuidePageProps {
  t: TFunction;
}

const CropGuidePage: React.FC<CropGuidePageProps> = ({t}) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const cropData = await api.getCropCatalog();
        setCrops(cropData);
      } catch (error) {
        console.error("Failed to fetch crop catalog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {t('cropGuide.title', { defaultValue: 'Crop Guide' })}
        </h2>
        <p className="text-text-light-secondary dark:text-dark-secondary mt-1">
          {t('cropGuide.description', { defaultValue: 'Explore the catalog of crops you can manage in your farm.' })}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          {t('cropGuide.loading', { defaultValue: 'Loading crops...' })}
        </div>
      ) : crops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {crops.map(crop => (
            <CropCard 
              key={crop.id} 
              crop={crop}
              t={t} 
              onClick={() => navigate(`/crop-guide/${crop.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-md">
          <h3 className="text-xl font-semibold">
            {t('cropGuide.noCropsTitle', { defaultValue: 'No crops found in the catalog.' })}
          </h3>
          <p className="text-text-light-secondary dark:text-dark-secondary mt-2">
            {t('cropGuide.noCropsDescription', { defaultValue: 'Contact your system administrator to add crops.' })}
          </p>
        </div>
      )}
    </div>
  );
};

export default CropGuidePage;