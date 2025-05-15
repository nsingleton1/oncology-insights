import React, { useState, useEffect } from 'react';
import { ChartBarIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface StarredInsight {
  id: string;
  title: string;
  jsonFile: string;
}

interface SidebarModuleProps {
  onInsightSelect?: (insightId: string) => void;
  onNavigate?: (section: string) => void;
  starredInsights?: StarredInsight[];
  onInsightUnstar?: (insightId: string) => void;
}

// Debug log function for troubleshooting
const debugLog = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] SidebarModule: ${message}`, data || '');
};

export const SidebarModule: React.FC<SidebarModuleProps> = ({ 
  onInsightSelect, 
  onNavigate,
  starredInsights = [], // Default to empty array if not provided
  onInsightUnstar
}) => {
  const [hoveredInsight, setHoveredInsight] = useState<string | null>(null);
  
  // Log initial props to ensure they're passed correctly
  useEffect(() => {
    debugLog('Mounted with props:', { 
      hasInsightSelect: !!onInsightSelect, 
      hasNavigate: !!onNavigate,
      hasUnstar: !!onInsightUnstar,
      starredInsightsCount: starredInsights.length,
      starredInsightIds: starredInsights.map(i => i.id)
    });
  }, [onInsightSelect, onNavigate, onInsightUnstar, starredInsights]);

  const handleInsightClick = (insightId: string) => {
    debugLog('Starred insight clicked:', insightId);
    if (onInsightSelect) {
      onInsightSelect(insightId);
    } else {
      console.error('No onInsightSelect handler provided');
    }
  };

  const handleUnstar = (event: React.MouseEvent, insightId: string) => {
    event.stopPropagation(); // Prevent insight selection
    debugLog('Unstarring insight:', insightId);
    if (onInsightUnstar) {
      onInsightUnstar(insightId);
    } else {
      console.error('No onInsightUnstar handler provided');
    }
  };

  const handleNavClick = (navItem: string) => {
    debugLog('Navigation item clicked:', navItem);
    // Call parent handler
    if (onNavigate) {
      onNavigate(navItem);
    } else {
      console.error('No onNavigate handler provided');
    }
  };

  return (
    <aside className="w-56 bg-[#0e1b38] text-white flex flex-col h-screen shadow-md" style={{ minWidth: '220px' }}>
      <div className="px-4 py-5">
        <h1 className="text-xl font-bold tracking-wide mb-6">
          <span className='inline-flex items-center gap-2 cursor-pointer hover:text-blue-300 transition-colors'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
            </svg>
            OncoInsights
          </span>
        </h1>
        
        {/* Main Navigation */}
        <nav className="flex flex-col space-y-1 text-sm">
          <button 
            className="flex items-center gap-2 text-left px-3 py-2 rounded-md bg-blue-600 text-white"
            onClick={() => handleNavClick('insights')}
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>Insights</span>
          </button>
        </nav>

        {/* Starred Insights */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-2 px-3">STARRED INSIGHTS</h2>
          <div className="space-y-1">
            {starredInsights.length > 0 ? (
              starredInsights.map(insight => (
                <button 
                  key={insight.id}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-md 
                    ${hoveredInsight === insight.id 
                      ? 'bg-[#172c51] text-white' 
                      : 'text-gray-300 hover:bg-[#172c51] hover:text-white'} 
                    transition-colors`}
                  onClick={() => handleInsightClick(insight.id)}
                  onMouseEnter={() => setHoveredInsight(insight.id)}
                  onMouseLeave={() => setHoveredInsight(null)}
                  title={insight.title}
                >
                  <div className="flex items-center">
                    <StarIconSolid className="h-3.5 w-3.5 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="truncate max-w-[120px] inline-block">{insight.title}</span>
                  </div>
                  {onInsightUnstar && hoveredInsight === insight.id && (
                    <XMarkIcon 
                      className="h-3.5 w-3.5 text-gray-400 hover:text-red-400 flex-shrink-0 ml-1" 
                      onClick={(e) => handleUnstar(e, insight.id)}
                      title="Remove from starred"
                    />
                  )}
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-500 px-3">Star insights by clicking the star icon on any tab</p>
            )}
          </div>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="mt-auto p-4 border-t border-[#172c51]">
        <div className="flex items-center cursor-pointer hover:bg-[#172c51] p-2 rounded-md transition-colors">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-semibold text-sm">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-gray-400">Oncology Director</p>
          </div>
          <Cog6ToothIcon className="h-4 w-4 text-gray-400 ml-auto hover:text-white" />
        </div>
      </div>
    </aside>
  );
}; 