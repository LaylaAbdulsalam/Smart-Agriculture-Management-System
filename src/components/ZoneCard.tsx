import React, { useState, useRef, useEffect } from 'react';
import { Zone, ZoneCrop, Crop, SensorReading, ReadingType, Alert, TFunction } from '../types';

interface ZoneCardProps {
  zone: Zone;
  activeCropDetails?: {
    zoneCrop: ZoneCrop,
    crop?: Crop,
  };
  readings: SensorReading[];
  readingTypes: ReadingType[];
  alerts: Alert[];
  t: TFunction;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

// Icons
const SoilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 00-1-1h-.5a1.5 1.5 0 00-3 0V10a1.5 1.5 0 003 0V8.5a1 1 0 011-1H17a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V10a1 1 0 01-1-1V4a1.5 1.5 0 01-1.5-1.5zM2 4.5A1.5 1.5 0 013.5 3H6a1 1 0 011 1v3.5a1.5 1.5 0 003 0V6a1 1 0 00-1-1H6.5a1.5 1.5 0 010-3H8a1 1 0 011 1v1.5a1.5 1.5 0 003 0V4a1 1 0 011-1h1.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v4.5a1.5 1.5 0 01-3 0V12a1 1 0 011-1h1.5a1.5 1.5 0 000-3H12a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V10a1 1 0 011-1h2.5A1.5 1.5 0 0013 7.5V6a1 1 0 011-1h.5a1.5 1.5 0 010 3H14a1 1 0 011 1v1.5a1.5 1.5 0 003 0V10a1 1 0 00-1-1h-.5a1.5 1.5 0 00-1.5 1.5v.5A1.5 1.5 0 0013.5 13H17a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3a1 1 0 011-1h1.5a1.5 1.5 0 000-3H3a1 1 0 00-1 1v1.5z" /></svg>;
const CropIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h14a1 1 0 011 1v5a.997.997 0 01-.293.707zM11 6a1 1 0 100-2 1 1 0 000 2z" /></svg>;
const StageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l.293.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>;

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, activeCropDetails, alerts, t, onEdit, onDelete, onViewDetails }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const alertCount = alerts.length;
  const hasActiveCrop = !!activeCropDetails?.zoneCrop;

  // حساب الأيام المنقضية منذ الزراعة
  const getDaysSincePlanting = (dateString: string) => {
    const planted = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - planted.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-md flex flex-col justify-between border h-full transition-all hover:shadow-lg ${alertCount > 0 ? 'border-red-500/50' : 'border-border-light dark:border-border-dark'}`}>
      <div>
        {/* Header: Name + Alerts */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
             <h3 className="text-lg font-bold text-black dark:text-white">{zone.name}</h3>
             <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{zone.area} acres</span>
          </div>
           {alertCount > 0 && (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 flex items-center gap-1 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.242-1.21 2.878 0l5.394 10.332a1.5 1.5 0 01-1.306 2.268H4.17a1.5 1.5 0 01-1.306-2.268L8.257 3.099zM10 12a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    {alertCount}
                </span>
           )}
        </div>
        
        {/* Body: Details */}
        <div className="space-y-3">
            {/* Soil Information */}
            <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-dark-secondary bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                <SoilIcon/> 
                <span className="font-medium">{t('zoneCard.soilType')}:</span> 
                <span>{zone.soilType}</span>
            </div>

            {/* Crop Information (Conditionals) */}
            {hasActiveCrop ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-green-900 dark:text-green-100">
                            <CropIcon/>
                            <span className="font-bold">{activeCropDetails?.zoneCrop.cropName || activeCropDetails?.crop?.name}</span>
                        </div>
                        {/* Days Badge */}
                        <span className="text-xs bg-white dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded shadow-sm border border-green-200 dark:border-green-700">
                            {getDaysSincePlanting(activeCropDetails!.zoneCrop.plantedAt)} days
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-green-800 dark:text-green-200">
                        <StageIcon/>
                        <span>Stage: <strong>{activeCropDetails?.zoneCrop.stageName || 'Unknown'}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-green-800 dark:text-green-200">
                        <CalendarIcon/>
                        <span>Planted: {new Date(activeCropDetails!.zoneCrop.plantedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No crop planted</p>
                </div>
            )}
        </div>
      </div>
      
      {/* Footer: Actions */}
       <div className="flex justify-between items-center mt-5 pt-4 border-t border-border-light dark:border-border-dark">
        {hasActiveCrop ? (
             <button onClick={onViewDetails} className="flex-1 text-center px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors text-sm">
                Manage Crop
            </button>
        ) : (
            <button onClick={onViewDetails} className="flex-1 text-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm shadow-green-200 dark:shadow-none">
                + Plant a Crop
            </button>
        )}
       
        <div className="relative ms-2" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-gray-500">
                <MenuIcon />
            </button>
            {menuOpen && (
                <div className="absolute end-0 bottom-full mb-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-xl py-1 z-20 border border-gray-100 dark:border-gray-700 ring-1 ring-black ring-opacity-5">
                    <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">
                        <span>✏️</span> Edit Zone
                    </button>
                    <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <span>🗑️</span> Delete Zone
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;