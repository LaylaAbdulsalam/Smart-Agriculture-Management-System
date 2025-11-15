import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentStatus, Zone, ReadingType } from '../types';

interface EquipmentFormProps {
  equipment?: Equipment | null;
  zones: Zone[];
  readingTypes: ReadingType[];
  onSave: (equipment: Omit<Equipment, 'id'|'lastReadingAt'>) => void;
  onClose: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, zones, readingTypes, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    zoneId: zones[0]?.id || 0,
    serialNumber: '',
    model: '',
    readingTypeId: readingTypes[0]?.id || 0,
    status: EquipmentStatus.Active,
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        zoneId: equipment.zoneId,
        serialNumber: equipment.serialNumber,
        model: equipment.model,
        readingTypeId: equipment.readingTypeId,
        status: equipment.status,
      });
    }
  }, [equipment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        ...formData,
        zoneId: Number(formData.zoneId),
        readingTypeId: Number(formData.readingTypeId),
        status: formData.status as EquipmentStatus,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label className="block text-sm font-medium mb-1">Zone</label>
        <select name="zoneId" value={formData.zoneId} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md">
            {zones.map(zone => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Model</label>
        <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Serial Number</label>
        <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Reading Type</label>
        <select name="readingTypeId" value={formData.readingTypeId} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md">
            {readingTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.displayName}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md">
            {Object.values(EquipmentStatus).map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus">Save Equipment</button>
      </div>
    </form>
  );
};

export default EquipmentForm;
