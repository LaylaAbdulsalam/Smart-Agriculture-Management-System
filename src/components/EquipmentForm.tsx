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
        zoneid: equipment.zoneid,
        serialnumber: equipment.serialnumber,
        equipmentmodel: equipment.equipmentmodel,
        readingtypeid: equipment.readingtypeid,
        status: equipment.isactive ? EquipmentStatus.Active : EquipmentStatus.Inactive,
      };
    } else {
      return {
        zoneid: zones.length > 0 ? zones[0].id.toString() : '',
        serialnumber: '',
        equipmentmodel: '',
        readingtypeid: readingTypes.length > 0 ? readingTypes[0].id : '',
        status: EquipmentStatus.Active,
      };
    }
  };

  const [formData, setFormData] = useState(getInitialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const equipmentDataForApi = {
      zoneid: formData.zoneid,
      readingtypeid: formData.readingtypeid,
      serialnumber: formData.serialnumber,
      equipmentmodel: formData.equipmentmodel,
      isactive: formData.status === EquipmentStatus.Active,
      installationdate: new Date().toISOString(),
    };
  
    console.log("Final data being sent to API:", equipmentDataForApi);
    
    onSave(equipmentDataForApi);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label className="block text-sm font-medium mb-1">Zone</label>
        <select name="zoneid" value={formData.zoneid} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md">
            {zones.map(zone => <option key={zone.id} value={zone.id.toString()}>{zone.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Model</label>
        <input type="text" name="equipmentmodel" value={formData.equipmentmodel} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Serial Number</label>
        <input type="text" name="serialnumber" value={formData.serialnumber} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reading Type</label>
        <select name="readingtypeid" value={formData.readingtypeid} onChange={handleChange} required className="w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md">
            {readingTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.displayname}</option>)}
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