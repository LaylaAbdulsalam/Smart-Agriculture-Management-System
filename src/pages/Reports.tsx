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

const generateInitialWaterData = (): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      const baseUsage = (hour >= 6 && hour <= 18) ? 80 : 20; 
      const randomVariation = Math.random() * 15;
      
      data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: Number((baseUsage + randomVariation).toFixed(1))
      });
  }
  return data;
};

const Reports: React.FC<ReportsProps> = ({ t }) => {
  const { selectedFarmId } = useFarm();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [waterUsageData] = useState(generateInitialWaterData);

  useEffect(() => {
    if (selectedFarmId) {
        // The following line is a valid use case for setting state in an effect
        // to show a loading indicator before an async operation.
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [selectedFarmId]);

  const handleGenerateReport = () => {
    if(!selectedFarmId) return;
    
    api.generateReport(selectedFarmId)
      .then((newReport: any) => {
        const formattedReport: Report = {
            ...newReport,
            id: String(newReport.id),
            farmId: String(selectedFarmId)
        };
        setReports(prev => [formattedReport, ...prev]);
      })
      .catch((err: any) => console.error("Failed to generate report", err));
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

      <ChartComponent 
        title="Water Usage Trend (L/hr)" 
        data={waterUsageData} 
        dataKey="value" 
        color="#0ea5e9" 
      />
      
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
                    <td className="px-6 py-4">{new Date(report.date).toLocaleDateString()} {new Date(report.date).toLocaleTimeString()}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            report.type.includes('Weekly') ? 'bg-purple-100 text-purple-800' :
                            report.type.includes('Water') ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                            {report.type}
                        </span>
                    </td>
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