import React, { useState } from 'react';
import { Farm } from '../types';

interface FarmFormProps {
  farm?: Farm | null;
  onSave: (farm: Omit<Farm, 'id' | 'ownerUserId' | 'description'>) => void;
  onClose: () => void;
}

const FarmForm: React.FC<FarmFormProps> = ({ farm, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: farm?.name || '',
    address: farm?.location?.address || '',
    lat: farm?.location?.lat || 0,
    lon: farm?.location?.lon || 0,
    code: farm?.code || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        name: formData.name,
        location: {
            address: formData.address,
            lat: Number(formData.lat),
            lon: Number(formData.lon),
        },
        code: formData.code,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Farm Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>
      
       <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input type="number" step="any" name="lon" value={formData.lon} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Farm Code</label>
        <input type="text" name="code" value={formData.code} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus">Save Farm</button>
      </div>
    </form>
  );
};

export default FarmForm;