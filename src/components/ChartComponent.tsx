
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoricalDataPoint } from '../types';

interface ChartComponentProps {
  title: string;
  data: HistoricalDataPoint[];
  dataKey: string;
  color: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ title, data, dataKey, color }) => {
  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">{title}</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5, right: 20, left: isRtl ? 10 : -10, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="time" stroke="rgb(156 163 175)" reversed={isRtl} />
            <YAxis stroke="rgb(156 163 175)" orientation={isRtl ? 'right' : 'left'} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: 'rgba(51, 65, 85, 1)',
                color: 'white',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
