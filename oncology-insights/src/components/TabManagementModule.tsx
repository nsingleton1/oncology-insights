import React from 'react';
import { Tab } from '../types';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface TabManagementModuleProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabStar?: (tabId: string, isStarred: boolean) => void;
}

export const TabManagementModule: React.FC<TabManagementModuleProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabStar
}) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center px-4 py-1">
        <div className="flex space-x-1 overflow-x-auto flex-grow scrollbar-hide">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                relative flex items-center h-9 pl-3 pr-16 rounded-t-md text-sm
                ${
                  tab.id === activeTabId
                    ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50'
                    : 'border border-b-0 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <button
                onClick={() => onTabSelect(tab.id)}
                className="flex items-center space-x-2 max-w-[140px] truncate"
                title={tab.title}
              >
                <span className="truncate">{tab.title}</span>
              </button>
              <div className="absolute right-2 flex items-center space-x-2">
                {onTabStar && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabStar(tab.id, !tab.isStarred);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    title={tab.isStarred ? "Unstar insight" : "Star insight"}
                  >
                    {tab.isStarred ? (
                      <StarIconSolid className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                    ) : (
                      <StarIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" aria-hidden="true" />
                    )}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  title="Close tab"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add default export to fix import issues
export default TabManagementModule; 