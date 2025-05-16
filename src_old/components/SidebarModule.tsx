import React from 'react';

interface SidebarModuleProps {
  starredInsightIds: string[];
  onStarredInsightSelect: (id: string) => void;
  onHomeClick: () => void;
  onCohortGeneratorClick: () => void;
}

const SidebarModule: React.FC<SidebarModuleProps> = ({
  starredInsightIds,
  onStarredInsightSelect,
  onHomeClick,
  onCohortGeneratorClick
}) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">OncoInsights</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          <li>
            <button
              onClick={onHomeClick}
              className="flex items-center w-full px-4 py-3 hover:bg-gray-700"
            >
              <span className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </span>
              Home
            </button>
          </li>
          <li>
            <button
              onClick={onCohortGeneratorClick}
              className="flex items-center w-full px-4 py-3 hover:bg-gray-700"
            >
              <span className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </span>
              Create Cohort
            </button>
          </li>
        </ul>
        
        {starredInsightIds.length > 0 && (
          <>
            <div className="px-4 py-2 text-xs text-gray-400 uppercase">
              Starred Insights
            </div>
            <ul className="pb-4">
              {starredInsightIds.map(id => (
                <li key={id}>
                  <button
                    onClick={() => onStarredInsightSelect(id)}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 text-left"
                  >
                    <span className="mr-2 text-yellow-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    Insight {id.substring(0, 8)}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        <p>OncoInsights v0.1.0</p>
      </div>
    </div>
  );
};

export default SidebarModule; 