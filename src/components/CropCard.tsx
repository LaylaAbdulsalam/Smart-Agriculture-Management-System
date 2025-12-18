import React from 'react';
import { Crop, TFunction } from '../types';
import CropIcon from '../assets/crop.png'; 


interface CropCardProps {
  crop: Crop;
  t: TFunction;
  onClick: () => void;
}

const CropCard: React.FC<CropCardProps> = ({ crop, t, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-md flex flex-col justify-center items-center border border-border-light dark:border-border-dark cursor-pointer transition-all hover:shadow-lg hover:border-primary"
    >
       <div className="h-25 w-25 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-slate-300 dark:border-slate-600">
        <img 
          src={CropIcon} 
          alt={crop.name} 
          className="h-16 w-16 object-cover" 
        />
      </div>
      <h3 className="text-lg font-bold text-black dark:text-white text-center">
        {t(`crops.${crop.name}`, { defaultValue: crop.name })}
      </h3>
    </div>
  );
};

export default CropCard;