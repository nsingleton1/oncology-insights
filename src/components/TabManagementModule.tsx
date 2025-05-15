import React from 'react';
import { Tab } from '../types';
import { XMarkIcon, BookmarkIcon } from '@heroicons/react/24/outline';

interface TabManagementModuleProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabPin: (tabId: string) => void;
}

export const TabManagementModule: React.FC<TabManagementModuleProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabPin
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              group relative flex items-center py-4 px-1 border-b-2 font-medium text-sm
              ${
                tab.id === activeTabId
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <button
              onClick={() => onTabSelect(tab.id)}
              className="flex items-center space-x-2"
            >
              <span>{tab.title}</span>
              {tab.isPinned && (
                <BookmarkIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
              )}
            </button>
            <div className="absolute right-0 flex items-center space-x-2">
              <button
                onClick={() => onTabPin(tab.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <BookmarkIcon
                  className={`h-4 w-4 ${
                    tab.isPinned ? 'text-indigo-500' : 'text-gray-400'
                  }`}
                  aria-hidden="true"
                />
              </button>
              <button
                onClick={() => onTabClose(tab.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}; 