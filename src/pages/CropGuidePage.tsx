import React, { useState, useEffect, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredCrops = useMemo(() => {
    if (!searchQuery) {
      return crops;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return crops.filter(crop =>
      crop.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [crops, searchQuery]);

  // Determine which placeholder to use based on the current language
  const placeholderText = t('cropGuide.searchPlaceholder') === 'cropGuide.searchPlaceholder' 
    ? 'Search by crop name...' 
    : t('cropGuide.searchPlaceholder');

  return (
    <div className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {t('cropGuide.title', { defaultValue: 'Crop Guide' })}
          </h2>
          <p className="text-text-light-secondary dark:text-dark-secondary mt-1">
            {t('cropGuide.description', { defaultValue: 'Explore the catalog of crops you can manage in your farm.' })}
          </p>
        </div>

        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p>{t('cropGuide.loading', { defaultValue: 'Loading crops...' })}</p>
        </div>
      ) : filteredCrops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCrops.map(crop => (
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
            No Matching Crops Found
          </h3>
          <p className="text-text-light-secondary dark:text-dark-secondary mt-2">
            {`We couldn't find any crops matching "${searchQuery}". Please try a different search term.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CropGuidePage;