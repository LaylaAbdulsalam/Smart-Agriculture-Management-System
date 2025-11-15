import React, { useState, useRef, useEffect } from 'react';
import { Zone, ZoneCrop, Crop, SensorReading, ReadingType, Alert, TFunction } from '../types';
import { findStage } from '../services/apiService';

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

const SoilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 00-1-1h-.5a1.5 1.5 0 00-3 0V10a1.5 1.5 0 003 0V8.5a1 1 0 011-1H17a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V10a1 1 0 01-1-1V4a1.5 1.5 0 01-1.5-1.5zM2 4.5A1.5 1.5 0 013.5 3H6a1 1 0 011 1v3.5a1.5 1.5 0 003 0V6a1 1 0 00-1-1H6.5a1.5 1.5 0 010-3H8a1 1 0 011 1v1.5a1.5 1.5 0 003 0V4a1 1 0 011-1h1.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v4.5a1.5 1.5 0 01-3 0V12a1 1 0 011-1h1.5a1.5 1.5 0 000-3H12a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V10a1 1 0 011-1h2.5A1.5 1.5 0 0013 7.5V6a1 1 0 011-1h.5a1.5 1.5 0 010 3H14a1 1 0 011 1v1.5a1.5 1.5 0 003 0V10a1 1 0 00-1-1h-.5a1.5 1.5 0 00-1.5 1.5v.5A1.5 1.5 0 0013.5 13H17a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3a1 1 0 011-1h1.5a1.5 1.5 0 000-3H3a1 1 0 00-1 1v1.5z" /></svg>;
const CropIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h14a1 1 0 011 1v5a.997.997 0 01-.293.707zM11 6a1 1 0 100-2 1 1 0 000 2z" /></svg>;
const StageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l.293.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>;


const ZoneCard: React.FC<ZoneCardProps> = ({ zone, activeCropDetails, alerts, t, onEdit, onDelete, onViewDetails }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const currentStage = activeCropDetails?.crop ? findStage(activeCropDetails.crop, activeCropDetails.zoneCrop.currentStageId) : null;
  const alertCount = alerts.length;

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
    <div className={`bg-card-light dark:bg-card-dark p-5 rounded-xl shadow-md flex flex-col justify-between border ${alertCount > 0 ? 'border-red-500/50' : 'border-border-light dark:border-border-dark'}`}>
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-black dark:text-white">{zone.name}</h3>
           {alertCount > 0 && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.242-1.21 2.878 0l5.394 10.332a1.5 1.5 0 01-1.306 2.268H4.17a1.5 1.5 0 01-1.306-2.268L8.257 3.099zM10 12a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    {alertCount} {t('sidebar.alerts')}
                </span>
           )}
        </div>
        
        <div className="mt-4 space-y-2 text-sm text-text-light-secondary dark:text-dark-secondary">
            <div className="flex items-center gap-2"><SoilIcon/> <strong>{t('zoneCard.soilType')}:</strong> {zone.soilType}</div>
             <div className="flex items-center gap-2"><CropIcon/> <strong>{t('zoneCard.currentCrop')}:</strong> {activeCropDetails?.crop?.name || t('zoneCard.none')}</div>
             {activeCropDetails && currentStage && (
                 <>
                    <div className="flex items-center gap-2"><StageIcon/> <strong>{t('zoneCard.stage')}:</strong> {currentStage.name}</div>
                    <div className="flex items-center gap-2"><CalendarIcon/> <strong>{t('zoneCard.planted')}:</strong> {new Date(activeCropDetails.zoneCrop.plantedAt).toLocaleDateString()}</div>
                 </>
             )}
        </div>
      </div>
      
       <div className="flex justify-between items-center mt-6">
        <button onClick={onViewDetails} className="w-full text-center px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors">
            {t('zoneCard.viewDetails')}
        </button>
        <div className="relative ms-2" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <MenuIcon />
            </button>
            {menuOpen && (
                <div className="absolute end-0 bottom-full mb-2 w-32 bg-card-light dark:bg-slate-700 rounded-md shadow-lg py-1 z-10 border border-border-light dark:border-border-dark">
                    <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full text-left rtl:text-right block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-600">Edit Zone</button>
                    <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full text-left rtl:text-right block px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">Delete Zone</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;