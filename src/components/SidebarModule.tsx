import React, { useState } from 'react';
import { ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export interface SidebarModuleProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  starredInsightIds: string[];
  customStarredInsights: Record<string, any>;
  onUnstar: (insightId: string) => void;
  onCategorySelect: (category: any) => Promise<void>;
}

export const SidebarModule: React.FC<SidebarModuleProps> = ({
  activeSection,
  onNavigate,
  starredInsightIds,
  customStarredInsights,
  onUnstar,
  onCategorySelect
}) => {
  const [hoveredInsight, setHoveredInsight] = useState<string | null>(null);

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
            className={`flex items-center gap-2 text-left px-3 py-2 rounded-md ${
              activeSection === 'insights' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-[#172c51] hover:text-white'
            }`}
            onClick={() => onNavigate('insights')}
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>Insights</span>
          </button>
        </nav>
        {/* Starred Insights */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-2 px-3">STARRED INSIGHTS</h2>
          <div className="space-y-1">
            {starredInsightIds.length > 0 ? (
              starredInsightIds.map(insightId => (
                <button 
                  key={insightId}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-md 
                    ${hoveredInsight === insightId 
                      ? 'bg-[#172c51] text-white' 
                      : 'text-gray-300 hover:bg-[#172c51] hover:text-white'} 
                    transition-colors`}
                  onClick={() => onUnstar(insightId)}
                  onMouseEnter={() => setHoveredInsight(insightId)}
                  onMouseLeave={() => setHoveredInsight(null)}
                >
                  <div className="flex items-center">
                    <StarIconSolid className="h-3.5 w-3.5 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="truncate max-w-[120px] inline-block">
                      {customStarredInsights[insightId]?.title || insightId}
                    </span>
                  </div>
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