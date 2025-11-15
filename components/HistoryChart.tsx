'use client';

import { ResponsiveContainer, Line, XAxis, Tooltip, LineChart } from 'recharts';
import React from 'react';

interface ChartDataPoint {
  sentimentScore: number;
  createdAt: string;
  mood: string;
  color: string;
}

interface HistoryChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any;
  label?: string;
}) => {
  if (active && payload && payload.length > 0) {
    const { mood, color, sentimentScore } = payload[0].payload;
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow text-black">
        <div className="flex items-center mb-2">
          <span
            className="inline-block w-3 h-3 rounded-full mr-2"
            style={{ background: color }}
          ></span>
          <span className="font-bold">{mood}</span>
        </div>
        <div className="text-xs text-gray-600 mb-1">
          {new Date(label ?? '').toLocaleString()}
        </div>
        <div>Sentiment: <b>{sentimentScore}</b></div>
      </div>
    );
  }
  return null;
};

const HistoryChart = ({ data }: HistoryChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="sentimentScore"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 7 }}
        />
        <XAxis
          dataKey="createdAt"
          tickFormatter={(str) =>
            new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          }
        />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;