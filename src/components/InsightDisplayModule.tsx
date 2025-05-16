import React, { useState } from 'react';
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
import { InsightData, ChartDataPoint } from '../types';
import { 
  DocumentIcon, 
  ChartBarIcon, 
  UsersIcon, 
  BellAlertIcon, 
  PresentationChartLineIcon, 
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  UserGroupIcon,
  BellIcon
} from '@heroicons/react/24/outline';

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
  onDrilldown?: (jsonFile: string, title: string) => void;
}

export const InsightDisplayModule: React.FC<InsightDisplayModuleProps> = ({ insight, onDrilldown }) => {
  // Add state for view mode (NCCN or Peer)
  const [viewMode, setViewMode] = useState<'nccn' | 'peer'>('nccn');
  
  // Check if the chart data is in the new format (nested under 'chart' property)
  // or the old format (directly in 'chart_data' property)
  const chartData: ChartDataPoint[] = (insight.chart?.data || insight.chart_data || []) as ChartDataPoint[];
  
  // Get the appropriate target based on view mode
  const nccnTarget = insight.chart?.nccn_target || insight.benchmark || 65;
  const peerBenchmark = insight.peer_comparison?.peer_benchmark || nccnTarget - 10; // Default to 10% below NCCN if not specified
  
  // Get the current target based on selected view mode
  const currentTarget = viewMode === 'nccn' ? nccnTarget : peerBenchmark;
  
  // Generate dynamic summary based on view mode
  const getSummary = () => {
    if (viewMode === 'peer' && insight.peer_comparison?.description) {
      return insight.peer_comparison.description;
    }
    return insight.summary;
  };
  
  // Calculate financial impact based on view mode
  const getFinancialImpact = () => {
    if (!insight.financial_impact) return null;
    
    // For peer comparison, use peer-specific financial impact if available
    if (viewMode === 'peer' && insight.peer_comparison?.financial_impact) {
      return insight.peer_comparison.financial_impact;
    }
    
    // Default to the original financial impact
    return insight.financial_impact;
  };

  // Apply colors to chart data
  const colorizedChartData = chartData.map((d, i) => ({
    ...d,
    fill: d.highlight ? "#DC2626" : ["#2563EB", "#3B82F6", "#60A5FA", "#A5B4FC"][i % 4]
  }));

  const handleDrilldown = (jsonFile: string, label: string) => {
    if (onDrilldown) {
      onDrilldown(jsonFile, label);
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow p-4 space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-800">Therapy Management Insight</h2>
        <p className="text-base text-gray-500">{insight.cohort}</p>
      </header>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Utilization by Provider</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setViewMode('nccn')}
            className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
              viewMode === 'nccn' 
                ? 'text-white bg-blue-600 hover:bg-blue-700' 
                : 'text-blue-600 border border-blue-600 bg-white hover:bg-blue-50'
            }`}
          >
            NCCN Target
          </button>
          <button 
            onClick={() => setViewMode('peer')}
            className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
              viewMode === 'peer' 
                ? 'text-white bg-blue-600 hover:bg-blue-700' 
                : 'text-blue-600 border border-blue-600 bg-white hover:bg-blue-50'
            }`}
          >
            Peer Benchmark
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-700">{highlightSummary(getSummary())}</p>
      
      {/* Financial and Clinical Impact Section */}
      {(getFinancialImpact() || insight.clinical_impact) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {getFinancialImpact() && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <h4 className="text-sm font-semibold text-green-800">Financial Impact</h4>
              <p className="text-sm font-bold text-green-600 mt-1">{getFinancialImpact()?.annual_opportunity}</p>
              <p className="text-xs text-green-700 mt-1">{getFinancialImpact()?.math}</p>
            </div>
          )}
          {insight.clinical_impact && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-800">Clinical Impact</h4>
              {insight.clinical_impact.metrics ? (
                <div className="mt-1">
                  <p className="text-xs text-blue-700 mb-2">{insight.clinical_impact.description}</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {insight.clinical_impact.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-xs font-semibold text-blue-800 mr-1">{metric.type}:</span>
                        <span className="text-xs font-bold text-blue-600">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-bold text-blue-600 mt-1">{insight.clinical_impact.quantitative}</p>
                  <p className="text-xs text-blue-700 mt-1">{insight.clinical_impact.description}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={colorizedChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip wrapperClassName="text-xs" cursor={{ fill: '#f3f4f6' }} />
            <ReferenceLine 
              y={currentTarget} 
              stroke={viewMode === 'nccn' ? '#1d4ed8' : '#8B5CF6'} 
              strokeDasharray="4 2" 
              label={{ 
                value: viewMode === 'nccn' ? 'NCCN Target' : 'Peer Avg',
                position: 'top',
                fill: viewMode === 'nccn' ? '#1d4ed8' : '#8B5CF6',
                fontSize: 10
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {colorizedChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Drilldown Buttons */}
      <div className="flex flex-wrap gap-2 pt-4">
        {insight.drilldowns && insight.drilldowns.length > 0 ? (
          insight.drilldowns.map((drilldown) => (
            <button 
              key={drilldown.label} 
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200"
              onClick={() => handleDrilldown(drilldown.jsonFile, drilldown.label)}
            >
              {drilldown.label}
            </button>
          ))
        ) : (
          ["View by Payer Type", "Compare Sites", "Variance by Regimen"].map((chip) => (
            <button key={chip} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200">
              {chip}
            </button>
          ))
        )}
      </div>
      
      {/* Action Steps Section */}
      <div className="space-y-3 pt-4 border-t border-gray-100 mt-6">
        <h4 className="text-sm font-semibold text-gray-700">Action Steps</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {viewMode === 'peer' && insight.peer_comparison?.action_steps ? (
            // Show peer-specific action steps when in peer view mode
            insight.peer_comparison.action_steps.map((step, idx) => {
              // If step is a string, use it directly
              const stepText = typeof step === 'string' ? step : step.text;
              const iconType = typeof step === 'string' ? getDefaultIcon(step) : step.icon || getDefaultIcon(step.text);
              
              return (
                <button key={idx} className="text-left text-sm text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 shadow-sm flex items-start">
                  <span className="flex-shrink-0 mr-2 mt-0.5">{renderIcon(iconType)}</span>
                  <span>{stepText}</span>
                </button>
              );
            })
          ) : insight.action_steps ? (
            // Show NCCN-based action steps by default
            insight.action_steps.map((step, idx) => {
              // If step is a string, use it directly
              const stepText = typeof step === 'string' ? step : step.text;
              const iconType = typeof step === 'string' ? getDefaultIcon(step) : step.icon || getDefaultIcon(step.text);
              
              return (
                <button key={idx} className="text-left text-sm text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 shadow-sm flex items-start">
                  <span className="flex-shrink-0 mr-2 mt-0.5">{renderIcon(iconType)}</span>
                  <span>{stepText}</span>
                </button>
              );
            })
          ) : insight.suggestions ? (
            // Fallback to suggestions if no action steps available
            insight.suggestions.map((suggestion, idx) => {
              // If suggestion is a string, use it directly
              const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.text;
              const iconType = typeof suggestion === 'string' ? getDefaultIcon(suggestion) : suggestion.icon || getDefaultIcon(suggestion.text);
              
              return (
                <button key={idx} className="text-left text-sm text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 rounded-md px-4 py-2 shadow-sm flex items-start">
                  <span className="flex-shrink-0 mr-2 mt-0.5">{renderIcon(iconType)}</span>
                  <span>{suggestionText}</span>
                </button>
              );
            })
          ) : null}
        </div>
      </div>
    </section>
  );
};

// Helper function to determine icon type based on text content
function getDefaultIcon(text: string): string {
  text = text.toLowerCase();
  
  if (text.includes('flag') || text.includes('eligible') || text.includes('identify')) {
    return 'flag';
  } else if (text.includes('dashboard') || text.includes('monitoring') || text.includes('track')) {
    return 'chart';
  } else if (text.includes('peer') || text.includes('provider') || text.includes('review')) {
    return 'users';
  } else if (text.includes('alert') || text.includes('set')) {
    return 'alert';
  } else if (text.includes('share') || text.includes('discussion')) {
    return 'document';
  } else if (text.includes('implement') || text.includes('create') || text.includes('workflow')) {
    return 'clipboard';
  } else if (text.includes('schedule') || text.includes('meeting')) {
    return 'calendar';
  } else if (text.includes('analyze') || text.includes('compare')) {
    return 'chart-line';
  } else {
    return 'default';
  }
}

// Helper function to render the appropriate icon
function renderIcon(iconType: string) {
  switch (iconType) {
    case 'flag':
      return <ClipboardDocumentListIcon className="h-4 w-4" />;
    case 'chart':
      return <ChartBarIcon className="h-4 w-4" />;
    case 'users':
      return <UsersIcon className="h-4 w-4" />;
    case 'alert':
      return <BellAlertIcon className="h-4 w-4" />;
    case 'document':
      return <DocumentIcon className="h-4 w-4" />;
    case 'clipboard':
      return <ClipboardDocumentListIcon className="h-4 w-4" />;
    case 'calendar':
      return <ArrowPathIcon className="h-4 w-4" />;
    case 'chart-line':
      return <PresentationChartLineIcon className="h-4 w-4" />;
    default:
      return <BellIcon className="h-4 w-4" />;
  }
} 