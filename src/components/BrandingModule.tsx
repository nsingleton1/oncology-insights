import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export const BrandingModule: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-indigo-600">OncoInsights</div>
          <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
            Demo Mode
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </div>
  );
}; 