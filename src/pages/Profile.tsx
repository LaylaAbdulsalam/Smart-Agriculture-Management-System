
import React, { useState, useRef } from 'react';
import { User, TFunction } from '../types';
import Toast from '../components/Toast';
import DefaultUserIcon from '../components/DefaultUserIcon';
import ImageCropModal from '../components/ImageCropModal';

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  t: TFunction;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

const Toggle: React.FC<{ id: string, name: string, label: string, description: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, name, label, description, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <div>
            <label htmlFor={id} className="font-medium text-black dark:text-white">{label}</label>
            <p className="text-sm text-text-light-secondary dark:text-dark-secondary">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id={id}
              name={name}
              className="sr-only peer" 
              checked={checked}
              onChange={onChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 dark:peer-focus:ring-primary/80 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
    </div>
);


const Profile: React.FC<ProfileProps> = ({ user, setUser, t }) => {
  const [localUser, setLocalUser] = useState(user);
  const [showToast, setShowToast] = useState(false);
  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    weeklyReports: true,
    aiRecommendations: false,
  });

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked as boolean }));
  };


  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageToCrop(reader.result as string);
        });
        reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleCropSave = (croppedImageUrl: string) => {
    setLocalUser(prev => ({ ...prev, avatarUrl: croppedImageUrl }));
    setImageToCrop(null);
  };


  const handleSaveChanges = () => {
    setUser(localUser);
    // In a real app, you would also save the notification settings
    console.log("Saving notification settings:", notifications);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {imageToCrop && (
        <ImageCropModal 
          src={imageToCrop}
          onSave={handleCropSave}
          onClose={() => setImageToCrop(null)}
        />
      )}
      <div className="max-w-4xl mx-auto space-y-6">
        <Toast message={t('profilePage.toastSuccess')} show={showToast} onClose={() => setShowToast(false)} />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-black dark:text-white">{t('profilePage.title')}</h1>
          <button type="button" onClick={handleSaveChanges} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
              {t('profilePage.save')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <div className="flex flex-col items-center">
                 {localUser.avatarUrl ? (
                    <img src={localUser.avatarUrl} alt="User Avatar" className="w-32 h-32 rounded-full object-cover mb-4 bg-slate-200 dark:bg-slate-700" />
                 ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4">
                        <DefaultUserIcon className="w-24 h-24 text-slate-500 dark:text-slate-400" />
                    </div>
                 )}
                <h3 className="text-xl font-bold">{localUser.name}</h3>
                <p className="text-text-light-secondary dark:text-dark-secondary">{localUser.role}</p>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 cursor-pointer px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-focus transition-colors">
                  {t('profilePage.changePicture')}
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">{t('profilePage.accountDetails')}</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">{t('profilePage.fullName')}</label>
                  <input type="text" id="name" name="name" value={localUser.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">{t('profilePage.emailAddress')}</label>
                  <input type="email" id="email" name="email" value={localUser.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium">{t('profilePage.role')}</label>
                  <select id="role" name="role" value={localUser.role} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" disabled>
                    <option>Farm Owner</option>
                    <option>Farm Manager</option>
                    <option>Farm Worker</option>
                    <option>Irrigation Engineer</option>
                    <option>System Admin</option>
                  </select>
                </div>
                <div className="border-t border-border-light dark:border-border-dark pt-4">
                  <button type="button" className="px-4 py-2 text-sm font-medium text-primary hover:underline">
                    {t('profilePage.changePassword')}
                  </button>
                </div>
              </form>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-4">{t('profilePage.notificationPrefs')}</h3>
              <div className="space-y-4">
                  <Toggle 
                      id="systemAlerts"
                      name="systemAlerts"
                      label={t('profilePage.systemAlerts')}
                      description={t('profilePage.systemAlertsDesc')}
                      checked={notifications.systemAlerts}
                      onChange={handleNotificationChange}
                  />
                  <Toggle 
                      id="weeklyReports"
                      name="weeklyReports"
                      label={t('profilePage.weeklyReports')}
                      description={t('profilePage.weeklyReportsDesc')}
                      checked={notifications.weeklyReports}
                      onChange={handleNotificationChange}
                  />
                  <Toggle 
                      id="aiRecommendations"
                      name="aiRecommendations"
                      label={t('profilePage.aiRecommendations')}
                      description={t('profilePage.aiRecommendationsDesc')}
                      checked={notifications.aiRecommendations}
                      onChange={handleNotificationChange}
                  />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
