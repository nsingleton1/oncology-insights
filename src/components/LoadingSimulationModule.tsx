import React from 'react';

const LoadingSimulationModule: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-white bg-opacity-80">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Insights</h2>
        <p className="text-gray-600">Analyzing oncology data...</p>
      </div>
    </div>
  );
};

export default LoadingSimulationModule; 