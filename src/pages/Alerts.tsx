
import React, { useState } from 'react';
import { Alert, Zone, ReadingType, TFunction } from '../types';

interface AlertsPageProps {
  alerts: Alert[];
  zones: Zone[];
  readingTypes: ReadingType[];
  onAcknowledge: (alertId: number) => void;
  t: TFunction;
}

const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, zones, readingTypes, onAcknowledge, t }) => {
    const [filter, setFilter] = useState<'all' | 'new' | 'acknowledged'>('all');

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'new') return !alert.isAcknowledged;
        if (filter === 'acknowledged') return alert.isAcknowledged;
        return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
    <div className="space-y-6">
       <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
                <h2 className="text-xl font-semibold text-black dark:text-white">{t('alertsPage.title')}</h2>
                <p className="text-text-light-secondary dark:text-dark-secondary mt-1">
                    {t('alertsPage.description')}
                </p>
            </div>
            <div>
                <label htmlFor="status-filter" className="sr-only">{t('alertsPage.filterByStatus')}</label>
                <select 
                    id="status-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-slate-100 dark:bg-slate-700 border-border-light dark:border-border-dark rounded-lg p-2"
                >
                    <option value="all">{t('alertsPage.all')}</option>
                    <option value="new">{t('alertsPage.new')}</option>
                    <option value="acknowledged">{t('alertsPage.acknowledged')}</option>
                </select>
            </div>
        </div>
      
      <div className="overflow-x-auto bg-card-light dark:bg-card-dark rounded-xl shadow-md">
        <table className="w-full text-sm text-left rtl:text-right text-text-light-secondary dark:text-dark-secondary">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">{t('alertsPage.zone')}</th>
              <th scope="col" className="px-6 py-3">{t('alertsPage.message')}</th>
              <th scope="col" className="px-6 py-3">{t('alertsPage.reading')}</th>
              <th scope="col" className="px-6 py-3">{t('alertsPage.date')}</th>
              <th scope="col" className="px-6 py-3">{t('alertsPage.status')}</th>
              <th scope="col" className="px-6 py-3">{t('alertsPage.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => {
                const zone = zones.find(z => z.id === alert.zoneId);
                const readingType = readingTypes.find(rt => rt.id === alert.readingTypeId);
                
                return (
                  <tr key={alert.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 font-semibold text-black dark:text-white">{zone?.name}</td>
                    <td className="px-6 py-4">{alert.message}</td>
                    <td className="px-6 py-4 font-mono">{alert.value.toFixed(1)} {readingType?.unit}</td>
                    <td className="px-6 py-4">{new Date(alert.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {alert.isAcknowledged ? (
                         <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {t('alertsPage.acknowledged')}
                         </span>
                      ) : (
                         <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            {t('alertsPage.new')}
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                        {!alert.isAcknowledged && (
                             <button onClick={() => onAcknowledge(alert.id)} className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20">
                                {t('acknowledge')}
                            </button>
                        )}
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertsPage;
