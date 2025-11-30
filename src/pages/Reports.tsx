/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import ChartComponent from '../components/ChartComponent';
import { HistoricalDataPoint, TFunction, Report } from '../types';
import { useFarm } from '../contexts/FarmContext';
import * as api from '../services/apiService';

interface ReportsProps {
  t: TFunction;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

const Reports: React.FC<ReportsProps> = ({ t }) => {
  const { selectedFarmId } = useFarm();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const historicalWaterUsage: HistoricalDataPoint[] = [];

  useEffect(() => {
    const timer = setTimeout(() => {
        if (selectedFarmId) {
            setLoading(true);
            api.getReportsByFarm(selectedFarmId)
            .then((data: any) => {
                setReports(data as Report[]);
            })
            .catch((err: any) => {
                console.error("Failed to load reports", err);
                setReports([]);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setReports([]);
        }
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedFarmId]);

  const handleGenerateReport = () => {
    if(!selectedFarmId) return;
    
    api.generateReport(selectedFarmId)
      .then((newReport: any) => {
        const formattedReport: Report = {
            ...newReport,
            id: String(newReport.id)
        };
        setReports(prev => [formattedReport, ...prev]);
      })
      .catch((err: any) => console.error("Failed to generate report", err));
  };

  const handleExport = (format: 'PDF' | 'CSV') => {
    alert(`Exporting as ${format} (Simulation)`);
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
                disabled={!selectedFarmId}
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
                    <td className="px-6 py-4">{new Date(report.date).toLocaleDateString()}</td>
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