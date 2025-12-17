import React from 'react';

interface SensorCardProps {
  title: string;
  value: string;
  icon: 'temp' | 'moisture' | 'humidity' | 'water' | 'zone';
  status: 'good' | 'warning' | 'danger';
}

const TempIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 18h2a4 4 0 004-4V8a4 4 0 00-4-4h-2a4 4 0 00-4 4v6a4 4 0 004 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4V2m0 20v-2m-5.657-5.657l-1.414-1.414m12.728 0l-1.414 1.414" /></svg>;
const MoistureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L12 12l-6.364-6.364" /></svg>;
const HumidityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20v-2.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.93 4.93l1.76 1.76" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.31 17.31l1.76 1.76" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h2.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12h-2.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.93 19.07l1.76-1.76" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.31 6.69l1.76-1.76" /></svg>;
const WaterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" /></svg>;
const ZoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const icons = {
  temp: <TempIcon />,
  moisture: <MoistureIcon />,
  humidity: <HumidityIcon />,
  water: <WaterIcon />,
  zone: <ZoneIcon />,
};

const statusColors = {
  good: 'text-green-500',
  warning: 'text-yellow-500',
  danger: 'text-red-500',
};

const SensorCard: React.FC<SensorCardProps> = ({ title, value, icon, status }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text-light-secondary dark:text-dark-secondary">{title}</p>
        <p className="text-3xl font-bold text-black dark:text-white">{value}</p>
      </div>
      <div className={statusColors[status]}>
        {icons[icon]}
      </div>
    </div>
  );
};

export default SensorCard;
