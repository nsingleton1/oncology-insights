import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { CohortPrompt } from '../types';

// Updated to include only cohorts with existing JSON files
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

interface CohortInputModuleProps {
  onCohortSelect: (prompt: CohortPrompt) => void;
}

export const CohortInputModule: React.FC<CohortInputModuleProps> = ({ onCohortSelect }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<CohortPrompt>(predefinedPrompts[0]);

  const handlePromptSelect = (prompt: CohortPrompt) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full">
          <Listbox value={selectedPrompt} onChange={handlePromptSelect}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                <span className="block truncate">{selectedPrompt.text}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {predefinedPrompts.map((prompt) => (
                  <Listbox.Option
                    key={prompt.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                        active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                      }`
                    }
                    value={prompt}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {prompt.text}
                        </span>
                        {selected ? (
                          <span
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600"
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <button
          onClick={() => onCohortSelect(selectedPrompt)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          Generate Insights
        </button>
      </div>
    </div>
  );
}; 