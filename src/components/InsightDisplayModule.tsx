import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { InsightData } from '../types';

function highlightSummary(summary: string) {
  // Highlight dollar amounts, percentages, negative/positive trends, and key phrases
  const patterns = [
    { regex: /(\$[\d,.]+(M|K)?)/g, className: "text-green-600 font-semibold" }, // Dollar amounts
    { regex: /(\d+%)/g, className: "font-semibold" }, // Percentages
    { regex: /(falls below|below the peer benchmark|significant variation|opportunities for optimization)/gi, className: "text-red-600 font-semibold" },
    { regex: /(exceeds|above the peer benchmark|positive revenue impact)/gi, className: "text-green-600 font-semibold" },
    { regex: /(revenue opportunity|revenue impact)/gi, className: "font-semibold" }
  ];

  let parts: (string | React.ReactNode)[] = [summary];

  patterns.forEach(({ regex, className }) => {
    let newParts: (string | React.ReactNode)[] = [];
    parts.forEach(part => {
      if (typeof part === "string") {
        let lastIndex = 0;
        let match;
        regex.lastIndex = 0;
        while ((match = regex.exec(part)) !== null) {
          if (match.index > lastIndex) {
            newParts.push(part.slice(lastIndex, match.index));
          }
          newParts.push(<span className={className} key={match[0] + match.index}>{match[0]}</span>);
          lastIndex = regex.lastIndex;
        }
        if (lastIndex < part.length) {
          newParts.push(part.slice(lastIndex));
        }
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  return parts;
}

interface InsightDisplayModuleProps {
  insight: InsightData;
}

export const InsightDisplayModule: React.FC<InsightDisplayModuleProps> = ({ insight }) => {
  // Check if the chart data is in the new format (nested under 'chart' property)
  // or the old format (directly in 'chart_data' property)
  const chartData = insight.chart?.data || insight.chart_data || [];
  const nccnTarget = insight.chart?.nccn_target || insight.benchmark || 65;
  
  // Apply colors to chart data
  const colorizedChartData = chartData.map((d, i) => ({
    ...d,
    fill: ["#DC2626", "#2563EB", "#3B82F6", "#60A5FA", "#A5B4FC"][i % 5]
  }));

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow p-4 space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-800">Therapy Management Insight</h2>
        <p className="text-base text-gray-500">{insight.cohort}</p>
      </header>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Utilization by Provider</h3>
        <div className="flex items-center space-x-2">
          <button className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">NCCN Target</button>
          <button className="text-xs font-medium text-blue-600 border border-blue-600 bg-white hover:bg-blue-50 px-3 py-1 rounded">Peer Benchmark</button>
        </div>
      </div>
      <p className="text-xs text-gray-700">{highlightSummary(insight.summary)}</p>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={colorizedChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip wrapperClassName="text-xs" cursor={{ fill: '#f3f4f6' }} />
            <ReferenceLine y={nccnTarget} stroke="#1d4ed8" strokeDasharray="4 2" />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {colorizedChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 pt-4">
        {insight.drilldowns ? insight.drilldowns.map((drilldown) => (
          <button key={drilldown.label} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200">
            {drilldown.label}
          </button>
        )) : ["View by Payer Type", "Compare Sites", "Variance by Regimen"].map((chip) => (
          <button key={chip} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200">
            {chip}
          </button>
        ))}
      </div>
      <div className="space-y-2 pt-4 border-t border-gray-100 mt-6">
        <h4 className="text-sm font-semibold text-gray-700">Action Steps</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {insight.suggestions.map((suggestion, idx) => (
            <button key={idx} className="text-left text-sm text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 shadow-sm">
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}; 