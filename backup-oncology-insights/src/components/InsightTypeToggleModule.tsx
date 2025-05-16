import React from 'react';

type InsightType = 'Revenue' | 'Margin' | 'Behavioral';

interface InsightTypeToggleModuleProps {
  currentType: InsightType;
  onTypeChange: (type: InsightType) => void;
}

export const InsightTypeToggleModule: React.FC<InsightTypeToggleModuleProps> = ({
  currentType,
  onTypeChange
}) => {
  const types: InsightType[] = ['Revenue', 'Margin', 'Behavioral'];

  return (
    <div className="flex space-x-4 p-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
            ${
              currentType === type
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {type}
        </button>
      ))}
    </div>
  );
}; 