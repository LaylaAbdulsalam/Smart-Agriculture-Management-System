/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Equipment, EquipmentStatus, Zone, ReadingType } from '../types';

interface EquipmentFormProps {
  equipment?: Equipment | null;
  zones: Zone[];
  readingTypes: ReadingType[];
  onSave: (equipmentData: any) => void;
  onClose: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, zones, readingTypes, onSave, onClose }) => {
  
  const getInitialState = () => {
    if (equipment) {
      return {
        zoneid: equipment.zoneId,
        serialnumber: equipment.serialNumber,
        equipmentmodel: equipment.model,
        readingtypeid: equipment.readingTypeId,
        status: equipment.status,
      };
    }
    return {
      zoneid: zones.length > 0 ? zones[0].id.toString() : '',
      serialnumber: '',
      equipmentmodel: '',
      readingtypeid: readingTypes.length > 0 ? readingTypes[0].id : '',
      status: EquipmentStatus.Active,
    };
  };

  const [formData, setFormData] = useState(getInitialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isEditing = !!equipment;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label className="block text-sm font-medium mb-1">Zone</label>
        <select 
          name="zoneid" 
          value={formData.zoneid} 
          onChange={handleChange} 
          required 
          disabled={isEditing} 
          className="w-full input disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
        >
            {zones.map(zone => <option key={zone.id} value={zone.id.toString()}>{zone.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Model</label>
        <input 
          type="text" 
          name="equipmentmodel" 
          value={formData.equipmentmodel} 
          onChange={handleChange} 
          required 
          disabled={isEditing} 
          className="w-full input disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Serial Number</label>
        <input 
          type="text" 
          name="serialnumber" 
          value={formData.serialnumber} 
          onChange={handleChange} 
          required 
          disabled={isEditing} 
          className="w-full input disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reading Type</label>
        <select 
          name="readingtypeid" 
          value={formData.readingtypeid} 
          onChange={handleChange} 
          required 
          className="w-full input"
        >
            {readingTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.displayName}</option>)}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select 
          name="status" 
          value={formData.status} 
          onChange={handleChange} 
          required 
          className="w-full input"
        >
            {Object.values(EquipmentStatus).map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">Save Equipment</button>
      </div>
      <style>{`
          .input { display: block; width: 100%; padding: 0.5rem 0.75rem; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.375rem; }
          .dark .input { background-color: #1e293b; border-color: #334155; }
          .btn-primary { padding: 0.5rem 1rem; background-color: #22c55e; color: white; border-radius: 0.375rem; border: none; font-weight: 600; }
          .btn-primary:hover { background-color: #16a34a; }
          .btn-secondary { padding: 0.5rem 1rem; background-color: #e2e8f0; border-radius: 0.375rem; border: none; font-weight: 600; }
          .dark .btn-secondary { background-color: #334155; }
          .btn-secondary:hover { background-color: #cbd5e1; }
          .dark .btn-secondary:hover { background-color: #475569; }
      `}</style>
    </form>
  );
};

export default EquipmentForm;