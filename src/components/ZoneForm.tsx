import React, { useState, useEffect } from 'react';
import { Zone } from '../types';

interface ZoneFormProps {
  zone?: Zone | null;
  onSave: (zone: Omit<Zone, 'id' | 'farmId'>) => void;
  onClose: () => void;
}

const soilTypes = ['Sandy', 'Clay', 'Loamy', 'Silty', 'Peaty', 'Chalky'];

const ZoneForm: React.FC<ZoneFormProps> = ({ zone, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    area: 0,
    soilType: soilTypes[0], // Default to the first option
  });

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        area: zone.area,
        soilType: zone.soilType,
      });
    } else {
      // Reset form for creating a new zone
      setFormData({
        name: '',
        area: 0,
        soilType: soilTypes[0],
      });
    }
  }, [zone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        ...formData,
        area: Number(formData.area),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Zone Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Area (in acres)</label>
        <input type="number" name="area" value={formData.area} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>
       <div>
        <label className="block text-sm font-medium mb-1">Soil Type</label>
        <select 
          name="soilType" 
          value={formData.soilType} 
          onChange={handleChange} 
          required 
          className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md"
        >
          {soilTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus">Save Zone</button>
      </div>
    </form>
  );
};

export default ZoneForm;
