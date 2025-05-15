import React, { useState, useEffect } from "react";
import { SidebarModule } from "./components/SidebarModule";
import { InsightDisplayModule } from "./components/InsightDisplayModule";
import { CohortInputModule } from "./components/CohortInputModule";
import { TabManagementModule } from "./components/TabManagementModule";
import { LoadingSimulationModule } from "./components/LoadingSimulationModule";
import { NotificationModule } from "./components/NotificationModule";
import { InsightData, CohortPrompt, Tab } from "./types";
import { v4 as uuidv4 } from 'uuid';

// Define our custom insights tracker
interface InsightTracker {
  id: string;
  jsonFile: string;
  title: string;
  insightType: string;
}

// Define an empty map for predefined starred insights - cleared for the demo
const PREDEFINED_INSIGHTS: Record<string, InsightTracker> = {};

// Create a map to look up starred insight IDs by JSON filename
const JSON_TO_STARRED_ID_MAP: Record<string, string> = {};
Object.entries(PREDEFINED_INSIGHTS).forEach(([id, data]) => {
  JSON_TO_STARRED_ID_MAP[data.jsonFile] = id;
});

// Local storage keys
const STARRED_IDS_STORAGE_KEY = 'oncoinsights-starred-ids';
const CUSTOM_INSIGHTS_STORAGE_KEY = 'oncoinsights-custom-insights';
const VERSION_KEY = 'oncoinsights-version';
const CURRENT_VERSION = '1.1.0'; // Stable version - won't force clear on every refresh

// Debug log function for troubleshooting
const debugLog = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
};

// Clear localStorage on version change or first run
const clearStorageIfNeeded = () => {
  try {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    
    // Only clear storage if version has changed
    if (!savedVersion || savedVersion !== CURRENT_VERSION) {
      debugLog('New version detected, clearing localStorage');
      localStorage.removeItem(CUSTOM_INSIGHTS_STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    } else {
      debugLog('Using existing localStorage data');
    }
  } catch (e) {
    console.error('Error handling localStorage version check:', e);
  }
};

// Call this function to clear storage
clearStorageIfNeeded();

// Define our top insights categories
const TOP_INSIGHT_CATEGORIES = [
  {
    id: 'revenue-optimization',
    title: 'Revenue Optimization',
    description: 'Identify opportunities to increase revenue through appropriate therapy utilization',
    icon: 'chart-line',
    bgColorClass: 'bg-blue-100',
    textColorClass: 'text-blue-600',
    jsonFile: 'breast-cancer-cdk46.json', // Breast cancer CDK4/6 insight
  },
  {
    id: 'margin-maximization',
    title: 'Margin Maximization',
    description: 'Analyze treatment patterns that deliver the best financial margins',
    icon: 'cash',
    bgColorClass: 'bg-green-100',
    textColorClass: 'text-green-600',
    jsonFile: 'multiple-myeloma-regimens.json', // Multiple myeloma regimens insight
  },
  {
    id: 'contract-performance',
    title: 'Contract Performance',
    description: 'Evaluate performance against value-based contracts',
    icon: 'document-text',
    bgColorClass: 'bg-purple-100',
    textColorClass: 'text-purple-600',
    jsonFile: 'nsclc-contracts.json', // NSCLC contract performance insight
  },
  {
    id: 'care-gap-closure',
    title: 'Care Gap Closure',
    description: 'Find patients who aren\'t receiving guideline-recommended therapies',
    icon: 'heart',
    bgColorClass: 'bg-red-100',
    textColorClass: 'text-red-600',
    jsonFile: 'crc-screening-gaps.json', // Colorectal cancer screening gaps insight
  },
  {
    id: 'resource-allocation',
    title: 'Resource Allocation',
    description: 'Determine where to focus educational or operational resources',
    icon: 'scale',
    bgColorClass: 'bg-amber-100',
    textColorClass: 'text-amber-600',
    jsonFile: 'lymphoma-resource-allocation.json', // Lymphoma resource allocation insight
  },
  {
    id: 'biomarker-testing',
    title: 'Biomarker Testing Compliance',
    description: 'Optimize precision medicine through improved biomarker testing rates',
    icon: 'dna',
    bgColorClass: 'bg-teal-100',
    textColorClass: 'text-teal-600',
    jsonFile: 'biomarker-compliance.json', // Biomarker testing compliance insight
  }
];

const App: React.FC = () => {
  const [activeInsight, setActiveInsight] = useState<InsightData | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showCohortInput, setShowCohortInput] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("insights");
  
  // Load starred insights from localStorage or use defaults (which is now an empty array)
  const [starredInsightIds, setStarredInsightIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STARRED_IDS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading starred insights from localStorage:', e);
      return [];
    }
  });

  // Load custom starred insights from localStorage or use empty object
  const [customStarredInsights, setCustomStarredInsights] = useState<Record<string, InsightTracker>>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_INSIGHTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading custom insights from localStorage:', e);
      return {};
    }
  });

  // Save starred insight IDs to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STARRED_IDS_STORAGE_KEY, JSON.stringify(starredInsightIds));
      debugLog('Saved starred insight IDs to localStorage', starredInsightIds);
    } catch (e) {
      console.error('Error saving starred insights to localStorage:', e);
    }
  }, [starredInsightIds]);

  // Save custom starred insights to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_INSIGHTS_STORAGE_KEY, JSON.stringify(customStarredInsights));
      debugLog('Saved custom starred insights to localStorage', Object.keys(customStarredInsights));
    } catch (e) {
      console.error('Error saving custom insights to localStorage:', e);
    }
  }, [customStarredInsights]);

  // Debug log state changes
  useEffect(() => {
    debugLog('App state updated:', { 
      activeSection, 
      showCohortInput, 
      tabsCount: tabs.length, 
      activeTabId, 
      hasActiveInsight: !!activeInsight,
      starredInsightIds,
      customStarredInsights: Object.keys(customStarredInsights)
    });
  }, [activeSection, showCohortInput, tabs, activeTabId, activeInsight, starredInsightIds, customStarredInsights]);

  // Simulate initial load
  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  }, []);

  // Handle navigation from sidebar
  const handleNavigate = (section: string) => {
    debugLog('Navigation handler called with section:', section);
    setActiveSection(section);
    
    if (section === "cohorts") {
      debugLog('Opening cohort selection panel');
      setShowCohortInput(true);
    } else if (section === "insights") {
      debugLog('Showing insights section');
      // Close cohort input if it's open
      setShowCohortInput(false);
    }
  };

  // Handle cohort selection and fetch data
  const handleCohortSelect = async (prompt: CohortPrompt) => {
    try {
      debugLog('Cohort selected:', prompt);
      setLoading(true);
      setShowCohortInput(false);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      debugLog(`Fetching data from: /data/insights/${prompt.jsonFile}`);
      const response = await fetch(`/data/insights/${prompt.jsonFile}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data: InsightData = await response.json();
      debugLog('Data loaded successfully:', data);

      // Check if this insight corresponds to a predefined starred insight
      const starredId = JSON_TO_STARRED_ID_MAP[prompt.jsonFile];
      const isStarred = starredId ? starredInsightIds.includes(starredId) : false;
      
      // Create a new tab for this insight
      const newTabId = uuidv4();
      const newTab: Tab = {
        id: newTabId,
        title: data.display_name || data.cohort.split(',')[0],
        insight: data,
        isPinned: false,
        isStarred
      };
      
      // Add the new tab, but respect the max of 4 tabs
      const updatedTabs = [...tabs];
      if (updatedTabs.length >= 4) {
        // Remove the oldest tab
        updatedTabs.shift();
      }
      updatedTabs.push(newTab);
      
      setTabs(updatedTabs);
      setActiveTabId(newTabId);
      setActiveInsight(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading insight:", error);
      setLoading(false);
      setActiveInsight(null);
      alert("Error loading insight. Please check console for details.");
    }
  };

  // Handle drilldown - load a new insight and tab
  const handleDrilldown = async (jsonFile: string, title: string) => {
    try {
      debugLog(`Drilling down into: ${jsonFile}, title: ${title}`);
      setLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch(`/data/insights/${jsonFile}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch drilldown data: ${response.status} ${response.statusText}`);
      }
      
      const data: InsightData = await response.json();
      debugLog('Drilldown data loaded successfully:', data);

      // Check if this corresponds to a predefined starred insight
      const starredId = JSON_TO_STARRED_ID_MAP[jsonFile];
      const isStarred = starredId ? starredInsightIds.includes(starredId) : false;
      
      // Create a new tab for this drilldown
      const newTabId = uuidv4();
      const newTab: Tab = {
        id: newTabId,
        title: data.display_name || title,
        insight: data,
        isPinned: false,
        isStarred
      };
      
      // Add the new tab, but respect the max of 4 tabs
      const updatedTabs = [...tabs];
      if (updatedTabs.length >= 4) {
        // Remove the oldest tab
        updatedTabs.shift();
      }
      updatedTabs.push(newTab);
      
      setTabs(updatedTabs);
      setActiveTabId(newTabId);
      setActiveInsight(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading drilldown:", error);
      setLoading(false);
      alert("Error loading drilldown. Please check console for details.");
    }
  };

  // Helper function to extract JSON file from insight
  const extractJsonFileFromInsight = (insight: InsightData): string => {
    // First try to get from drilldowns
    if (insight.drilldowns && insight.drilldowns.length > 0) {
      return insight.drilldowns[0].jsonFile;
    }
    
    // Otherwise, try to infer from insight type and cohort
    const type = insight.insight_type?.toLowerCase() || '';
    const cohort = insight.cohort?.toLowerCase() || '';
    
    // Look for clues in the insight type and cohort
    if (cohort.includes('er+/her2-')) {
      if (cohort.includes('medicare') && cohort.includes('by site')) {
        return 'breast-cancer-cdk46-medicare-by-site.json';
      } else if (cohort.includes('medicare') && cohort.includes('by regimen')) {
        return 'breast-cancer-cdk46-medicare-by-regimen.json';
      } else if (cohort.includes('site b') && cohort.includes('by regimen')) {
        return 'breast-cancer-cdk46-siteb-by-regimen.json';
      } else if (cohort.includes('site b') && cohort.includes('by provider')) {
        return 'breast-cancer-cdk46-siteb-by-provider.json';
      } else if (cohort.includes('by regimen')) {
        return 'breast-cancer-cdk46-by-regimen.json';
      } else if (cohort.includes('by site')) {
        return 'breast-cancer-cdk46-by-site.json';
      } else if (cohort.includes('by payer')) {
        return 'breast-cancer-cdk46-by-payer.json';
      } else if (cohort.includes('by age')) {
        return 'breast-cancer-cdk46-medicare-abemaciclib-by-age.json';
      } else {
        return 'breast-cancer-cdk46.json';
      }
    } else if (cohort.includes('nsclc')) {
      if (cohort.includes('by payer')) {
        return 'nsclc-pd1-by-payer.json';
      } else {
        return 'nsclc-pd1.json';
      }
    }
    
    // Default fallback
    return 'custom-insight.json';
  };

  // Find or create a starred insight ID for a tab
  const getOrCreateStarredId = (tab: Tab): string => {
    // If the insight has an ID, use that directly as it's most reliable
    if (tab.insight.id) {
      debugLog(`Found insight with ID: ${tab.insight.id}, using it directly`);
      return tab.insight.id;
    }
    
    // Otherwise, fall back to previous methods
    // Try to find a matching insight in predefined or custom insights
    const jsonFile = extractJsonFileFromInsight(tab.insight);
    
    // Combine predefined and custom insights
    const allStarredInsights = {
      ...PREDEFINED_INSIGHTS,
      ...customStarredInsights
    };
    
    // First, look for a direct match by JSON file
    for (const [id, info] of Object.entries(allStarredInsights)) {
      if (info.jsonFile === jsonFile) {
        debugLog(`Found exact jsonFile match for ${jsonFile}, using ID ${id}`);
        return id;
      }
    }
    
    // If not found by JSON, check for match by insight type
    for (const [id, info] of Object.entries(PREDEFINED_INSIGHTS)) {
      if (tab.insight.insight_type?.toLowerCase().includes(info.insightType)) {
        debugLog(`Found insight_type match for ${tab.insight.insight_type}, using ID ${id}`);
        return id;
      }
    }
    
    for (const [id, info] of Object.entries(customStarredInsights)) {
      if (tab.insight.insight_type === info.insightType) {
        debugLog(`Found custom insight_type match for ${tab.insight.insight_type}, using ID ${id}`);
        return id;
      }
    }
    
    // If no match, create a new custom starred insight
    const insightType = tab.insight.insight_type || tab.title;
    
    // Use the insight's ID if available, otherwise use the json file name
    const idBase = tab.insight.id ? 
      tab.insight.id : 
      jsonFile ? 
        jsonFile.replace('.json', '').replace(/[^a-zA-Z0-9]/g, '') : 
        tab.title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toLowerCase();
    
    const newId = `custom-${idBase}-${Date.now()}`;
    
    // Create a descriptive title that accurately reflects the actual JSON content
    let displayTitle = "";
    
    // First try to use the display_name if available
    if (tab.insight.display_name) {
      displayTitle = tab.insight.display_name;
    }
    // Otherwise generate a title based on the cohort
    else if (tab.insight.cohort) {
      const cohortParts = tab.insight.cohort.split(',');
      if (cohortParts.length > 1) {
        // Keep the main type and the analysis dimension (e.g., "by Site")
        const mainType = cohortParts[0].trim();
        const lastPart = cohortParts[cohortParts.length - 2].trim(); // Get the analysis dimension
        displayTitle = `${mainType} (${lastPart})`;
      } else {
        displayTitle = tab.insight.cohort;
      }
    } else if (tab.title && tab.insight.insight_type) {
      displayTitle = `${tab.title} (${tab.insight.insight_type})`;
    } else {
      displayTitle = tab.title;
    }
    
    debugLog(`Created display title: "${displayTitle}" for JSON file: ${jsonFile}`);
    
    // Create a new tracker with improved title and the specific JSON file
    const newTracker: InsightTracker = {
      id: newId,
      jsonFile: jsonFile || 'custom-insight.json',
      title: tab.insight.display_name || displayTitle,
      insightType
    };
    
    debugLog(`Creating new starred insight with ID ${newId} and jsonFile ${newTracker.jsonFile}`);
    
    // Add to our custom insights
    setCustomStarredInsights(prev => ({
      ...prev,
      [newId]: newTracker
    }));
    
    return newId;
  };

  // Handle sidebar starred insight selection
  const handleStarredInsightSelect = async (insightId: string) => {
    debugLog('Starred insight selected:', insightId);
    
    // First check if this is a predefined starred insight
    let insightInfo = PREDEFINED_INSIGHTS[insightId];
    
    // If not, check custom starred insights
    if (!insightInfo && customStarredInsights[insightId]) {
      insightInfo = customStarredInsights[insightId];
    }
    
    if (!insightInfo) {
      console.error('Unknown starred insight ID:', insightId);
      alert("Error loading starred insight. Unknown insight ID.");
      return;
    }
    
    const { jsonFile, insightType, title: insightTitle } = insightInfo;
    debugLog(`Loading insight with jsonFile: ${jsonFile}, type: ${insightType}`);
    
    // Check if we already have a tab for this insight by matching the JSON file first
    const existingTabIndex = tabs.findIndex(tab => {
      // First try to match by insight ID if available
      if (tab.insight.id && tab.insight.id === insightId) {
        return true;
      }
      
      // Then try to match by JSON file if we can extract it
      const tabJsonFile = extractJsonFileFromInsight(tab.insight);
      if (tabJsonFile && tabJsonFile === jsonFile) {
        return true;
      }
      
      // Fall back to insight type matching
      if (tab.insight.insight_type?.toLowerCase().includes(insightType)) {
        return true;
      }
      
      return false;
    });
    
    if (existingTabIndex >= 0) {
      // If we already have a tab for this insight, just activate it
      debugLog('Found existing tab for this insight, activating it');
      setActiveTabId(tabs[existingTabIndex].id);
      setActiveInsight(tabs[existingTabIndex].insight);
    } else {
      // Otherwise load the insight and create a new tab
      debugLog('Loading starred insight from file:', jsonFile);
      setLoading(true);
      try {
        const response = await fetch(`/data/insights/${jsonFile}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch starred insight: ${response.status} ${response.statusText}`);
        }
        
        const data: InsightData = await response.json();
        debugLog('Starred insight data loaded successfully:', data);
        
        const newTabId = uuidv4();
        const newTab: Tab = {
          id: newTabId,
          title: data.display_name || data.cohort.split(',')[0],
          insight: data,
          isPinned: false,
          isStarred: true // Pre-star insights loaded from the starred insights sidebar
        };
        
        // Add the new tab, respecting the max of 4 tabs
        const updatedTabs = [...tabs];
        if (updatedTabs.length >= 4) {
          updatedTabs.shift(); // Remove the oldest tab
        }
        
        updatedTabs.push(newTab);
        setTabs(updatedTabs);
        setActiveTabId(newTabId);
        setActiveInsight(data);
      } catch (error) {
        console.error("Error loading starred insight:", error);
        debugLog('Error details:', error);
        alert("Error loading starred insight. Please check console for details.");
      }
      setLoading(false);
    }
  };

  // Handle star/unstar tab
  const handleTabStar = (tabId: string, isStarred: boolean) => {
    debugLog(`${isStarred ? 'Starring' : 'Unstarring'} tab:`, tabId);
    
    // Find the tab
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) {
      console.error('Tab not found for starring/unstarring:', tabId);
      return;
    }

    // Update the tab's star status
    const updatedTabs = tabs.map(tab => 
      tab.id === tabId ? { ...tab, isStarred } : tab
    );
    setTabs(updatedTabs);

    // Get a consistent ID for this insight
    const starredId = getOrCreateStarredId(tab);
    
    debugLog(`Tab corresponds to starred insight ID: ${starredId} (${tab.title})`);
    
    // Update the starred insights list
    if (isStarred && !starredInsightIds.includes(starredId)) {
      debugLog('Adding to starred insights:', starredId);
      setStarredInsightIds(prev => [...prev, starredId]);
      
      // CRITICAL FIX: When starring an insight, immediately add it to customStarredInsights
      // Extract the JSON file from the insight
      const jsonFile = extractJsonFileFromInsight(tab.insight);
      
      // Create a new tracker entry if it doesn't exist yet
      if (!customStarredInsights[starredId] && !PREDEFINED_INSIGHTS[starredId]) {
        const displayTitle = tab.insight.display_name || tab.title;
        const newTracker: InsightTracker = {
          id: starredId,
          jsonFile: jsonFile,
          title: displayTitle,
          insightType: tab.insight.insight_type || ''
        };
        
        // Immediately update the customStarredInsights
        setCustomStarredInsights(prev => ({
          ...prev,
          [starredId]: newTracker
        }));
        
        debugLog('Created new starred insight tracker:', newTracker);
      }
    } else if (!isStarred && starredInsightIds.includes(starredId)) {
      debugLog('Removing from starred insights:', starredId);
      setStarredInsightIds(prev => prev.filter(id => id !== starredId));
    }
  };

  // Function to manually reset all starred insights (for debugging)
  const resetStarredInsights = () => {
    localStorage.removeItem(STARRED_IDS_STORAGE_KEY);
    localStorage.removeItem(CUSTOM_INSIGHTS_STORAGE_KEY);
    setStarredInsightIds([]);
    setCustomStarredInsights({});
    // Also reset any starred status on tabs
    const unstarredTabs = tabs.map(tab => ({...tab, isStarred: false}));
    setTabs(unstarredTabs);
    debugLog('All starred insights have been reset');
  };

  // Expose the reset function to window for manual debugging
  // @ts-ignore
  window.resetStarredInsights = resetStarredInsights;

  // Tab management handlers
  const handleTabSelect = (tabId: string) => {
    debugLog('Tab selected:', tabId);
    setActiveTabId(tabId);
    const selectedTab = tabs.find(tab => tab.id === tabId);
    if (selectedTab) {
      setActiveInsight(selectedTab.insight);
    } else {
      console.error('Selected tab not found:', tabId);
    }
  };

  const handleTabClose = (tabId: string) => {
    debugLog('Tab closed:', tabId);
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) {
      console.error('Tab to close not found:', tabId);
      return;
    }
    
    const newTabs = [...tabs];
    newTabs.splice(tabIndex, 1);
    setTabs(newTabs);
    
    // If we closed the active tab, activate another tab
    if (tabId === activeTabId && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
      setActiveInsight(newTabs[newActiveIndex].insight);
    } else if (newTabs.length === 0) {
      setActiveTabId("");
      setActiveInsight(null);
    }
  };

  // In the App component, add a handler for unstarring from the sidebar
  const handleSidebarUnstar = (insightId: string) => {
    debugLog(`Unstarring from sidebar: ${insightId}`);
    
    // Find if we have this insight in a tab
    const tabWithInsight = tabs.find(tab => {
      const tabStarredId = getOrCreateStarredId(tab);
      return tabStarredId === insightId;
    });
    
    if (tabWithInsight) {
      // If the insight is open in a tab, use handleTabStar to unstar it
      handleTabStar(tabWithInsight.id, false);
    } else {
      // Otherwise, just remove it from the starredInsightIds
      setStarredInsightIds(prev => prev.filter(id => id !== insightId));
    }
  };

  // Handle category selection in App component
  const handleCategorySelect = async (category: typeof TOP_INSIGHT_CATEGORIES[0]) => {
    try {
      debugLog('Category selected:', category);
      setLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      debugLog(`Fetching data from: /data/insights/${category.jsonFile}`);
      const response = await fetch(`/data/insights/${category.jsonFile}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data: InsightData = await response.json();
      debugLog('Data loaded successfully:', data);

      // Check if this insight corresponds to a predefined starred insight
      const starredId = JSON_TO_STARRED_ID_MAP[category.jsonFile];
      const isStarred = starredId ? starredInsightIds.includes(starredId) : false;
      
      // Create a new tab for this insight
      const newTabId = uuidv4();
      const newTab: Tab = {
        id: newTabId,
        title: data.display_name || data.cohort.split(',')[0],
        insight: data,
        isPinned: false,
        isStarred
      };
      
      // Add the new tab, but respect the max of 4 tabs
      const updatedTabs = [...tabs];
      if (updatedTabs.length >= 4) {
        // Remove the oldest tab
        updatedTabs.shift();
      }
      updatedTabs.push(newTab);
      
      setTabs(updatedTabs);
      setActiveTabId(newTabId);
      setActiveInsight(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading insight:", error);
      setLoading(false);
      setActiveInsight(null);
      alert("Error loading insight. Please check console for details.");
    }
  };

  // Show splash screen if no insights loaded yet
  if (showSplash) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="m-auto text-center space-y-6">
          <div className="text-5xl font-bold text-blue-600">OncoInsights</div>
          <div className="text-xl text-gray-600">Loading your oncology analytics platform...</div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Combine predefined starred insights with custom ones to get all available starred insights
  const allStarredInsights = {
    ...PREDEFINED_INSIGHTS,
    ...customStarredInsights
  };

  // Filter to only include the starred ones based on starredInsightIds
  const activeStarredInsights = Object.fromEntries(
    Object.entries(allStarredInsights)
      .filter(([id]) => starredInsightIds.includes(id))
  );

  // Show category selection screen if no insights are active
  if (activeInsight === null && tabs.length === 0) {
    return (
      <div className="flex h-screen bg-white text-gray-900 font-sans">
        <SidebarModule 
          onInsightSelect={handleStarredInsightSelect}
          onNavigate={handleNavigate}
          onInsightUnstar={handleSidebarUnstar}
          starredInsights={Object.values(activeStarredInsights).map(info => {
            // Try to find the corresponding insight data to get display_name
            let displayName = info.title;
            
            // If we know the JSON file, try to fetch it and get display_name (for next render)
            if (info.jsonFile) {
              // This is an asynchronous operation that will update for the next render
              fetch(`/data/insights/${info.jsonFile}`)
                .then(response => response.json())
                .then(data => {
                  if (data.display_name && info.title !== data.display_name) {
                    // Update the custom insight title if needed
                    setCustomStarredInsights(prev => ({
                      ...prev,
                      [info.id]: {
                        ...prev[info.id],
                        title: data.display_name
                      }
                    }));
                  }
                })
                .catch(err => console.error(`Error fetching display name for ${info.jsonFile}:`, err));
            }
            
            return {
              id: info.id,
              title: displayName,
              jsonFile: info.jsonFile
            };
          })}
        />
        <main className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 overflow-auto bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-6xl mx-auto p-8 space-y-6 pb-24">
              {/* Beautiful Header with Gradient */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-3">
                  Today's Top Insights
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover actionable insights to optimize your oncology practice performance and patient outcomes
                </p>
              </div>
              
              {/* Grid of Insight Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOP_INSIGHT_CATEGORIES.map(category => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                  >
                    <div className={`p-6 border-b border-gray-100`}>
                      <div className="flex items-center mb-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${category.bgColorClass} flex items-center justify-center mr-4`}>
                          {category.icon === 'chart-line' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.textColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          )}
                          {category.icon === 'cash' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.textColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {category.icon === 'document-text' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.textColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                          {category.icon === 'heart' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.textColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                          {category.icon === 'scale' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.textColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                          )}
                          {category.icon === 'dna' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.textColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8l8 8M16 8l-8 8" />
                            </svg>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-16">{category.description}</p>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 text-right">
                      <span className="text-xs font-medium text-blue-600 flex items-center justify-end">
                        View Insights
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white text-gray-900 font-sans">
      <SidebarModule 
        onInsightSelect={handleStarredInsightSelect}
        onNavigate={handleNavigate}
        onInsightUnstar={handleSidebarUnstar}
        starredInsights={Object.values(activeStarredInsights).map(info => {
          // Try to find the corresponding insight data to get display_name
          let displayName = info.title;
          
          // If we know the JSON file, try to fetch it and get display_name (for next render)
          if (info.jsonFile) {
            // This is an asynchronous operation that will update for the next render
            fetch(`/data/insights/${info.jsonFile}`)
              .then(response => response.json())
              .then(data => {
                if (data.display_name && info.title !== data.display_name) {
                  // Update the custom insight title if needed
                  setCustomStarredInsights(prev => ({
                    ...prev,
                    [info.id]: {
                      ...prev[info.id],
                      title: data.display_name
                    }
                  }));
                }
              })
              .catch(err => console.error(`Error fetching display name for ${info.jsonFile}:`, err));
          }
          
          return {
            id: info.id,
            title: displayName,
            jsonFile: info.jsonFile
          };
        })}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {tabs.length > 0 && (
          <TabManagementModule 
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
            onTabStar={handleTabStar}
          />
        )}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-white to-blue-50">
          <div className="max-w-6xl mx-auto p-4 space-y-4">
            {loading ? (
              <LoadingSimulationModule />
            ) : activeInsight ? (
              <InsightDisplayModule 
                insight={activeInsight} 
                onDrilldown={handleDrilldown}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow border border-gray-200 p-8">
                <div className="text-gray-400 text-lg mb-4">Select a cohort to generate insights</div>
                <div className="text-sm text-gray-500 max-w-md text-center mb-6">
                  Choose a patient population to analyze treatment patterns, identify opportunities, and optimize clinical and financial outcomes.
                </div>
                <button 
                  onClick={() => setShowCohortInput(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Select Cohort
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Cohort Input Float at bottom */}
        {showCohortInput && (
          <div className="bg-white border-t border-gray-200 p-3 shadow-md">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Select Cohort</h3>
                <button 
                  onClick={() => setShowCohortInput(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <CohortInputModule onCohortSelect={handleCohortSelect} />
            </div>
          </div>
        )}
        
        {/* Fixed "New" button when cohort input is hidden */}
        {!showCohortInput && !loading && (
          <button
            className="fixed bottom-4 right-4 z-10 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition"
            onClick={() => setShowCohortInput(true)}
            title="New Insight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
