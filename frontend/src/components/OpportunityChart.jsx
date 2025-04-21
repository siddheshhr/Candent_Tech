// src/components/OpportunityChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function OpportunityChart({ data }) {  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Leads per Month
      </h2> */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
        >
          {/* define the gradient */}
          <defs>
            <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00B4D8" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#0077B6" stopOpacity={0.9} />
            </linearGradient>
          </defs>

          {/* very light grid */}
          <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />

          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            formatter={(value) => [`${value}`, 'Leads']}
            labelFormatter={(label) => `Month: ${label}`}
          />

          <Bar
            dataKey="count"
            name="Leads"
            fill="url(#leadGradient)"
            radius={[6, 6, 0, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
