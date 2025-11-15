
import React from 'react';
import { User, UserRole, TFunction } from '../types';

interface RoleSelectionProps {
  user: User;
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
  t: TFunction;
}

const FarmOwnerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
const FarmManagerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
const FarmWorkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
const IrrigationEngineerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0l-2.828 2.828m0 0a2 2 0 11-2.828-2.828m2.828 2.828L12 12m0 0l-2.828 2.828m2.828-2.828l2.828-2.828M12 12l2.828 2.828" /></svg>
const SystemAdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>

const roles = [
    { name: 'Farm Owner', description: 'Oversee your entire farm’s performance.', icon: <FarmOwnerIcon />, value: 'Farm Owner' },
    { name: 'Farm Manager', description: 'Handle daily reports and irrigation scheduling.', icon: <FarmManagerIcon />, value: 'Farm Manager' },
    { name: 'Farm Worker', description: 'View assigned tasks and field alerts.', icon: <FarmWorkerIcon />, value: 'Farm Worker' },
    { name: 'Irrigation Engineer', description: 'Manage systems and AI-based suggestions.', icon: <IrrigationEngineerIcon />, value: 'Irrigation Engineer' },
    { name: 'System Admin', description: 'Control user accounts, analytics, and logs.', icon: <SystemAdminIcon />, value: 'System Admin' },
] as const;

const RoleCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex flex-col items-center text-center p-6 bg-card-light/80 dark:bg-card-dark/70 backdrop-blur-sm rounded-xl shadow-lg border-2 border-transparent hover:border-primary hover:scale-105 transition-all duration-300 group"
    >
        {icon}
        <h3 className="text-xl font-bold text-black dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-text-light-secondary dark:text-dark-secondary">{description}</p>
    </button>
);

const ProgressBar: React.FC = () => (
    <div className="w-full max-w-md">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-slate-300">Step 1: Authenticate</span>
            <span className="text-base font-medium text-white">Step 2: Select Role</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{width: "50%"}}></div>
        </div>
    </div>
);


const RoleSelection: React.FC<RoleSelectionProps> = ({ user, onSelectRole, onBack, t }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-black opacity-60"></div>
            
            <button onClick={onBack} className="absolute top-6 start-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {t('roleSelection.back')}
            </button>
            
            <div className="relative w-full max-w-5xl p-8 space-y-8 text-center animate-fade-in">
                 <div className="flex flex-col items-center space-y-4">
                    <ProgressBar />
                    <h1 className="text-4xl font-bold text-white">{t('roleSelection.welcome', {name: user.name})}</h1>
                    <p className="text-slate-300 text-lg">{t('roleSelection.prompt')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {roles.map((role) => (
                         <RoleCard
                            key={role.name}
                            icon={role.icon}
                            title={role.name}
                            description={role.description}
                            onClick={() => onSelectRole(role.value)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
