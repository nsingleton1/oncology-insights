import React, { useState } from 'react';
import { CohortPrompt } from '../types';

interface CohortInputModuleProps {
  onCohortSelect: (prompt: CohortPrompt) => void;
}

// Predefined prompts for cohort selection
const predefinedPrompts: CohortPrompt[] = [
  {
    id: '1',
    text: 'NSCLC biomarker testing compliance and optimization opportunities',
    jsonFile: 'nsclc-biomarker.json'
  },
  {
    id: '2',
    text: 'Colorectal cancer biomarker testing patterns and gaps',
    jsonFile: 'crc-biomarker.json'
  },
  {
    id: '3',
    text: 'Breast cancer biomarker utilization and provider variation',
    jsonFile: 'breast-biomarker.json'
  },
  {
    id: '4',
    text: 'Biomarker testing compliance across all solid tumors',
    jsonFile: 'biomarker-compliance.json'
  }
];

export const CohortInputModule: React.FC<CohortInputModuleProps> = ({ onCohortSelect }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<CohortPrompt>(predefinedPrompts[0]);

  const handlePromptSelect = (prompt: CohortPrompt) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select a cohort to analyze
          </label>
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedPrompt.id}
              onChange={(e) => {
                const selected = predefinedPrompts.find(p => p.id === e.target.value);
                if (selected) handlePromptSelect(selected);
              }}
            >
              {predefinedPrompts.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.text}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <button
          onClick={() => onCohortSelect(selectedPrompt)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:mt-auto"
        >
          Generate Insights
        </button>
      </div>
    </div>
  );
};

// Only keep one export method
export default CohortInputModule; 