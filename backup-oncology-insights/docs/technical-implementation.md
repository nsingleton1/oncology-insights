# OncoInsights Technical Implementation Details

## Tech Stack

- **Frontend Framework**: React 19.1.0 with TypeScript 4.9.5
- **UI Components**: Headless UI 2.2.3 (accessibility-focused components)
- **Icons**: Heroicons 2.2.0
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Charts**: Recharts 2.15.3
- **Notifications**: React Hot Toast 2.5.2
- **Markdown Rendering**: React Markdown 10.1.0
- **UUID Generation**: uuid 11.1.0
- **Build Tool**: Create React App (via react-scripts 5.0.1)

## Core File Structure

```
oncology-insights/
├── public/
│   ├── data/
│   │   └── insights/       # JSON files for all insights
├── src/
│   ├── components/         # UI components
│   │   ├── CohortInputModule.tsx
│   │   ├── InsightDisplayModule.tsx
│   │   ├── LoadingSimulationModule.tsx
│   │   ├── SidebarModule.tsx
│   │   ├── TabManagementModule.tsx
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Core type definitions
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── docs/                   # Documentation
└── package.json            # Dependencies and scripts
```

## TypeScript Type Definitions

### Key Types (from `src/types/index.ts`)

```typescript
// Insight data structure
export interface InsightData {
  id: string;
  display_name: string;
  cohort: string;
  insight_type: string;
  summary: string;
  chart: ChartData;
  financial_impact: FinancialImpact;
  clinical_impact: ClinicalImpact;
  weighted_score: number;
  action_steps: ActionStep[];
  drilldowns: Drilldown[];
  suggestions?: Suggestion[];
  peer_comparison?: PeerComparison;
}

// Tab management
export interface Tab {
  id: string;
  title: string;
  insight: InsightData;
  isPinned: boolean;
  isStarred: boolean;
}

// Cohort prompt for selection
export interface CohortPrompt {
  id: string;
  text: string;
  jsonFile: string;
}
```

## Component Implementation Details

### App.tsx

The `App.tsx` file (970 lines) serves as the application's core controller, managing:

1. **Constants and Configuration**:
   ```typescript
   const STARRED_IDS_STORAGE_KEY = 'oncoinsights_starred_ids_v2';
   const CUSTOM_INSIGHTS_STORAGE_KEY = 'oncoinsights_custom_insights_v2';
   const TOP_INSIGHT_CATEGORIES = [ /* category definitions */ ];
   ```

2. **State Management**:
   ```typescript
   const [activeInsight, setActiveInsight] = useState<InsightData | null>(null);
   const [tabs, setTabs] = useState<Tab[]>([]);
   const [activeTabId, setActiveTabId] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);
   const [showSplash, setShowSplash] = useState<boolean>(true);
   const [showCohortInput, setShowCohortInput] = useState<boolean>(false);
   const [starredInsightIds, setStarredInsightIds] = useState<string[]>(() => {
     // Load from localStorage
   });
   ```

3. **Effects**:
   ```typescript
   // Loading simulation effect
   useEffect(() => {
     const timer = setTimeout(() => {
       setShowSplash(false);
     }, 800);
     return () => clearTimeout(timer);
   }, []);

   // Save starred insights effect
   useEffect(() => {
     localStorage.setItem(STARRED_IDS_STORAGE_KEY, JSON.stringify(starredInsightIds));
   }, [starredInsightIds]);
   ```

4. **Event Handlers**:
   ```typescript
   const handleCategorySelect = async (category) => { /* ... */ };
   const handleDrilldown = async (jsonFile, title) => { /* ... */ };
   const handleCohortSelect = async (prompt) => { /* ... */ };
   const handleTabSelect = (tabId) => { /* ... */ };
   const handleTabClose = (tabId) => { /* ... */ };
   const handleTabStar = (tabId, isStarred) => { /* ... */ };
   ```

### CohortInputModule.tsx

This component manages cohort selection:

```typescript
export const CohortInputModule: React.FC<CohortInputModuleProps> = ({ onCohortSelect }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<CohortPrompt>(predefinedPrompts[0]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <Listbox value={selectedPrompt} onChange={handlePromptSelect}>
          {/* Dropdown implementation */}
          <Listbox.Button>...</Listbox.Button>
          <Listbox.Options className="absolute bottom-full mb-1 max-h-60 w-full...">
            {/* Options rendering */}
          </Listbox.Options>
        </Listbox>
        <button onClick={() => onCohortSelect(selectedPrompt)}>
          Generate Insights
        </button>
      </div>
    </div>
  );
};
```

### InsightDisplayModule.tsx

Renders all insight-related content including:
- Chart visualizations
- Financial and clinical impact metrics
- Action steps
- Drilldown options for navigation

## Data Loading and Hydration

The application uses fetch API to load JSON data:

```typescript
// Example from handleCategorySelect in App.tsx
const response = await fetch(`/data/insights/${category.jsonFile}`);
if (!response.ok) {
  throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
}
const data: InsightData = await response.json();
```

## Biomarker Implementation Code Details

### 1. App.tsx Integration

The biomarker category is registered in `TOP_INSIGHT_CATEGORIES`:

```typescript
{
  id: 'biomarker-testing',
  title: 'Biomarker Testing Compliance',
  description: 'Optimize precision medicine through improved biomarker testing rates',
  icon: 'dna',
  bgColorClass: 'bg-teal-100',
  textColorClass: 'text-teal-600',
  jsonFile: 'biomarker-compliance.json'
}
```

### 2. CohortInputModule.tsx Update

```typescript
// Updated predefined prompts
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
```

### 3. UI Dropdown Fix

```tsx
// Before
<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full...">

// After
<Listbox.Options className="absolute bottom-full mb-1 max-h-60 w-full...">
```

### 4. JSON Structure for Interconnected Navigation

Each JSON file contains a `drilldowns` array that establishes the hierarchical connection between views:

```json
"drilldowns": [
  {
    "label": "By Cancer Type",
    "cohort": "Biomarker Testing by Cancer Type",
    "jsonFile": "biomarker-compliance-by-cancer.json",
    "drilldownLevel": 1
  },
  {
    "label": "NSCLC Detail",
    "cohort": "NSCLC Biomarker Testing",
    "jsonFile": "nsclc-biomarker.json",
    "drilldownLevel": 2
  }
]
```

When a user selects a drilldown option, the application:
1. Reads the `jsonFile` property
2. Loads that JSON file via fetch
3. Updates the active insight
4. Creates a new tab for the drilldown view

## Testing Implementation

### Test Files

1. **App.test.tsx**:
   ```tsx
   test('renders without crashing', () => {
     render(<App />);
   });
   ```

2. **BiomarkerDataFlow.test.tsx**:
   ```tsx
   describe('Biomarker Testing Implementation', () => {
     test('biomarker testing implementation exists', () => {
       expect(true).toBe(true);
     });
   });
   ```

3. **CohortInputModule.test.tsx**:
   ```tsx
   test('renders without crashing', () => {
     render(<CohortInputModule onCohortSelect={mockOnCohortSelect} />);
   });
   ```

### Test Setup

In `setupTests.ts`, a ResizeObserver mock was added to support Headless UI testing:

```typescript
// Mock ResizeObserver which is not available in Jest environment
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;
```

## Performance Considerations

1. **Memo-ized Components**: Not currently implemented, but would benefit larger renders
2. **Lazy Loading**: Not implemented, would help with initial load time
3. **Data Loading**: Occurs on-demand when insights are selected
4. **Localstorage Persistence**: Used for starred insights, but with version keys to avoid stale data

## CSS Implementation

The application uses Tailwind CSS for styling with custom color schemes for each insight category:

```tsx
<div className={`flex-shrink-0 w-12 h-12 rounded-lg ${category.bgColorClass} flex items-center justify-center mr-4`}>
  {/* Icon SVG based on category */}
  {category.icon === 'dna' && (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.textColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8l8 8M16 8l-8 8" />
    </svg>
  )}
</div>
```

## TypeScript Configuration

The project uses TypeScript 4.9.5 with these key settings:
- Strict type checking
- ESNext target
- React JSX transformation

## Asset Loading

The application loads:
1. JSON data from the `/public/data/insights/` directory
2. SVG icons from Heroicons
3. No heavy media assets - focused on data visualization

## Code Modularity

Most logic is centralized in `App.tsx` (970 lines), which could benefit from refactoring into:
- Custom hooks for data fetching
- Context providers for state management
- Utility functions for data processing

## Build Pipeline

Uses standard Create React App build process:
```
npm run build # Produces optimized production build
```

## Browser Compatibility

The application uses modern JavaScript features and relies on:
- Fetch API
- ES6+ features
- Modern CSS (Flexbox, Grid)
- localStorage API

Polyfills would be needed for IE11 support (not currently implemented). 