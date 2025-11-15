import React, { useState, useEffect } from 'react';
import ChartComponent from '../components/ChartComponent';
import { HistoricalDataPoint, TFunction, Report } from '../types';
import * as api from '../services/apiService';

interface ReportsProps {
  farmId: number | null;
  t: TFunction;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

const Reports: React.FC<ReportsProps> = ({ farmId, t }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const historicalWaterUsage: HistoricalDataPoint[] = []; // Placeholder

  useEffect(() => {
    if (farmId) {
        setLoading(true);
        api.getReportsByFarm(farmId).then(data => {
            setReports(data);
            setLoading(false);
        });
    } else {
        setReports([]);
    }
  }, [farmId]);

  const handleGenerateReport = () => {
    if(!farmId) return;
    api.generateReport(farmId).then(newReport => {
        setReports(prev => [newReport, ...prev]);
    });
  };

  const handleExport = (format: 'PDF' | 'CSV') => {
    alert(`Simulating export of ${reports.length} reports as ${format}...`);
  };

  return (
    <div className="space-y-6">
       <Card>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-black dark:text-white">{t('reportsPage.title')}</h2>
            <p className="text-text-light-secondary dark:text-dark-secondary mt-1">{t('reportsPage.description')}</p>
          </div>
          <div className="flex gap-2">
            <button
                onClick={handleGenerateReport}
                disabled={!farmId}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Generate Report
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('reportsPage.exportCSV')}
            </button>
          </div>
        </div>
      </Card>

      <ChartComponent title={t('reportsPage.waterUsageTrend')} data={historicalWaterUsage} dataKey="value" color="#3b82f6" />
      
      <div className="overflow-x-auto bg-card-light dark:bg-card-dark rounded-xl shadow-md">
        <table className="w-full text-sm text-left rtl:text-right text-text-light-secondary dark:text-dark-secondary">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700 text-text-light-secondary dark:text-dark-secondary">
            <tr>
              <th scope="col" className="px-6 py-3">{t('reportsPage.reportId')}</th>
              <th scope="col" className="px-6 py-3">{t('reportsPage.date')}</th>
              <th scope="col" className="px-6 py-3">{t('reportsPage.type')}</th>
              <th scope="col" className="px-6 py-3">{t('reportsPage.author')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={4} className="text-center p-8">Loading reports...</td></tr>
            ) : reports.length > 0 ? (
                reports.map((report) => (
                <tr key={report.id} className="border-b dark:border-slate-700 even:bg-card-light dark:even:bg-card-dark odd:bg-slate-50 dark:odd:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <th scope="row" className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">{report.id}</th>
                    <td className="px-6 py-4">{report.date}</td>
                    <td className="px-6 py-4">{report.type}</td>
                    <td className="px-6 py-4">{report.author}</td>
                </tr>
                ))
            ) : (
                <tr><td colSpan={4} className="text-center p-8">No reports found for this farm.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
