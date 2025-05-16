# OncoInsights Codebase Documentation

## Architecture Overview

The OncoInsights platform is a React/TypeScript single-page application designed to provide actionable insights for oncology practices. The architecture follows a component-based approach with a combination of data-driven visualization and interactive UI elements.

## Directory Structure

```
oncology-insights/
├── public/               # Static assets and data
│   ├── data/
│   │   └── insights/     # JSON data for all insight categories
├── src/
│   ├── components/       # React components
│   ├── types/            # TypeScript type definitions
│   ├── data/             # Static data used in the application
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Application entry point
└── docs/                 # Documentation files
```

## Key Components

### App.tsx

The root component that manages:

1. **State Management**:
   - Active insight tracking
   - Tab management
   - Starred insights persistence (via localStorage)
   - Loading states
   - Navigation between sections

2. **Core Functions**:
   - `handleCategorySelect`: Loads an insight when a category is selected
   - `handleDrilldown`: Navigates to more detailed insights
   - `handleCohortSelect`: Processes user-selected cohorts
   - `handleTabSelect/Close/Star`: Manages the tabbed interface
   - `handleStarredInsightSelect`: Loads saved insights

3. **UI Rendering Logic**:
   - Conditional rendering based on application state
   - Tab management system
   - Cohort input handling

### Core Components

1. **SidebarModule**:
   - Provides navigation between application sections
   - Displays starred/saved insights
   - Manages user favorites

2. **TabManagementModule**:
   - Handles the tabbed interface for multiple insights
   - Supports tab closing, selection, and starring

3. **InsightDisplayModule**:
   - Renders a specific insight with visualizations
   - Displays metrics, impact calculations, and action steps
   - Provides drilldown navigation options

4. **CohortInputModule**:
   - Manages cohort selection via dropdown
   - Connects selected cohorts to insight generation
   - Uses Headless UI for accessible dropdown functionality

## Data Structure

The application primarily uses JSON files for insight data, following a consistent structure:

```typescript
interface InsightData {
  id: string;
  display_name: string;
  cohort: string;
  insight_type: string;
  summary: string;
  chart: {
    type: string;
    unit: string;
    data: Array<{
      name: string;
      value: number;
      gap?: number;
      highlight?: boolean;
    }>;
    benchmark?: number;
    nccn_target?: number;
  };
  financial_impact: {
    annual_opportunity: string;
    math: string;
  };
  clinical_impact: {
    description: string;
    metrics: Array<{
      type: string;
      value: string;
      description: string;
    }>;
    quantitative: string;
  };
  weighted_score: number;
  action_steps: Array<{
    text: string;
    icon: string;
  }>;
  drilldowns: Array<{
    label: string;
    cohort: string;
    jsonFile: string;
    drilldownLevel: number;
  }>;
}
```

## Biomarker Testing Implementation

### Overview

The Biomarker Testing Compliance feature is the 6th insight category that helps oncology practices optimize precision medicine through improved biomarker testing rates. Implementation follows a hierarchical, interconnected navigation pattern.

### Component Integration

In `App.tsx`, the biomarker category is integrated via:

```javascript
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

### Data Files Structure

The implementation follows a hierarchical structure with 4 levels:

1. **Main Overview (Level 0)**:
   - `biomarker-compliance.json`: The primary entry point with overview metrics

2. **Primary Drilldown (Level 1)**:
   - `biomarker-compliance-by-cancer.json`: Analysis by cancer type
   - `biomarker-compliance-by-provider.json`: Provider variation analysis
   - `biomarker-compliance-by-site.json`: Facility comparison
   - `biomarker-compliance-by-method.json`: Testing methodology analysis
   - `biomarker-compliance-by-payer.json`: Payer coverage patterns
   - `biomarker-compliance-tat.json`: Turnaround time metrics

3. **Cancer-Specific Biomarker (Level 2)**:
   - `nsclc-biomarker.json`: NSCLC biomarker analysis
   - `crc-biomarker.json`: Colorectal cancer biomarker analysis
   - `breast-biomarker.json`: Breast cancer biomarker analysis

4. **Detailed Analysis (Level 3)**:
   - `nsclc-biomarker-by-provider.json`: NSCLC provider comparison
   - `nsclc-biomarker-by-method.json`: NSCLC methodology details
   - `crc-biomarker-by-provider.json`: CRC provider comparison
   - `crc-biomarker-by-method.json`: CRC methodology details
   - `breast-biomarker-by-provider.json`: Breast cancer provider comparison
   - `breast-biomarker-by-method.json`: Breast cancer methodology details

### Interconnection Mechanism

The files connect via the `drilldowns` array in each JSON file. Each drilldown object contains:
- `label`: User-facing text for the navigation link
- `cohort`: Description of the related patient population
- `jsonFile`: Target JSON file to load when selected
- `drilldownLevel`: Hierarchy level indicator (0-3)

For example, from `biomarker-compliance.json`:
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

### Metrics Consistency

Each biomarker file maintains consistent metrics:
1. **Testing compliance rates** across different dimensions
2. **Financial impact calculations** showing revenue opportunities
3. **Clinical impact metrics** including survival benefits
4. **Peer comparison data** with benchmarks
5. **Action steps** for process improvement

## UI Improvements

### Cohort Selector Enhancement

In `CohortInputModule.tsx`, the dropdown was modified to:

1. **Expand Upward**: Changed from `mt-1` to `bottom-full mb-1` positioning
   ```jsx
   <Listbox.Options className="absolute bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
   ```

2. **Simplify Options**: Reduced options to only show biomarker-related items
   ```javascript
   const predefinedPrompts: CohortPrompt[] = [
     {
       id: '1',
       text: 'NSCLC biomarker testing compliance and optimization opportunities',
       jsonFile: 'nsclc-biomarker.json'
     },
     // Other biomarker options...
   ];
   ```

## State Management

The application uses React's built-in state management with:
1. **Local state**: Managed via `useState` hooks in components
2. **Persistence**: localStorage for user preferences
3. **Prop drilling**: For component communication

Example from `App.tsx`:
```javascript
const [activeInsight, setActiveInsight] = useState<InsightData | null>(null);
const [tabs, setTabs] = useState<Tab[]>([]);
const [activeTabId, setActiveTabId] = useState<string>("");
```

## Navigation Flow

1. User selects an insight category from the dashboard
2. `handleCategorySelect` loads the corresponding JSON
3. JSON data is parsed into an `InsightData` object
4. `InsightDisplayModule` renders the insight
5. User can click drilldown options to navigate deeper
6. `handleDrilldown` loads the new JSON and updates state
7. User can navigate between tabs or back to the main dashboard

## Testing Strategy

The application uses Jest and React Testing Library with:

1. **Simplified Component Tests**: Verify components render without crashing
2. **Mock ResizeObserver**: For Headless UI components in Node.js environment
3. **Data Structure Tests**: Verify JSON file existence and structure

## Runtime Dependencies

- **React**: Core UI framework
- **TypeScript**: Type safety and developer experience
- **Headless UI**: Accessible UI components
- **Heroicons**: SVG icon library
- **Recharts**: Data visualization
- **Tailwind CSS**: Utility-first styling

## Future Enhancement Areas

The codebase has room for expansion in:
1. **Real data integration**: Currently using static JSON
2. **State management refactoring**: For larger scale
3. **Additional insight categories**: Beyond the current six
4. **Enhanced filtering**: For more specific cohort definition 