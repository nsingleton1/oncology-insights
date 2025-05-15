import React, { useState, useEffect } from 'react';
import './App.css';
import SidebarModule from './components/SidebarModule';
import InsightDisplayModule from './components/InsightDisplayModule';
import TabManagementModule from './components/TabManagementModule';
import CohortInputModule from './components/CohortInputModule';
import LoadingSimulationModule from './components/LoadingSimulationModule';

// Types
import { InsightData, Tab, CohortPrompt } from './types';

const STARRED_IDS_STORAGE_KEY = 'oncoinsights_starred_ids_v2';

// Top insight categories
const TOP_INSIGHT_CATEGORIES = [
  {
    id: 'care-gaps',
    title: 'Care Gaps',
    description: 'Identify patients missing recommended care steps',
    icon: 'exclamation-circle',
    bgColorClass: 'bg-red-100',
    textColorClass: 'text-red-600',
    jsonFile: 'care-gaps.json'
  },
  {
    id: 'regimen-optimization',
    title: 'Regimen Optimization',
    description: 'Optimize treatment regimens for outcomes and cost',
    icon: 'chart-bar',
    bgColorClass: 'bg-blue-100',
    textColorClass: 'text-blue-600',
    jsonFile: 'regimen-optimization.json'
  },
  {
    id: 'clinical-outcomes',
    title: 'Clinical Outcomes',
    description: 'Analyze outcomes by provider, site, and regimen',
    icon: 'heart',
    bgColorClass: 'bg-purple-100',
    textColorClass: 'text-purple-600',
    jsonFile: 'clinical-outcomes.json'
  },
  {
    id: 'financial-performance',
    title: 'Financial Performance',
    description: 'Identify opportunities to reduce costs and improve revenue',
    icon: 'currency-dollar',
    bgColorClass: 'bg-green-100',
    textColorClass: 'text-green-600',
    jsonFile: 'financial-performance.json'
  },
  {
    id: 'provider-variation',
    title: 'Provider Variation',
    description: 'Reduce unwarranted variation in oncology care',
    icon: 'user-group',
    bgColorClass: 'bg-yellow-100',
    textColorClass: 'text-yellow-600',
    jsonFile: 'provider-variation.json'
  },
  {
    id: 'biomarker-testing',
    title: 'Biomarker Testing Compliance',
    description: 'Optimize precision medicine through improved biomarker testing rates',
    icon: 'dna',
    bgColorClass: 'bg-teal-100',
    textColorClass: 'text-teal-600',
    jsonFile: 'biomarker-compliance.json'
  }
];

function App() {
  const [activeInsight, setActiveInsight] = useState<InsightData | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showCohortInput, setShowCohortInput] = useState<boolean>(false);
  const [starredInsightIds, setStarredInsightIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STARRED_IDS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

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

  const handleCategorySelect = async (category: typeof TOP_INSIGHT_CATEGORIES[0]) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/data/insights/${category.jsonFile}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data: InsightData = await response.json();
      
      // Create a new tab for this insight
      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        title: category.title,
        insight: data,
        isPinned: false,
        isStarred: starredInsightIds.includes(data.id)
      };
      
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      setActiveInsight(data);
      
    } catch (error) {
      console.error('Error loading insight category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrilldown = async (jsonFile: string, title: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/data/insights/${jsonFile}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data: InsightData = await response.json();
      
      // Create a new tab for this drilldown
      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        title: title,
        insight: data,
        isPinned: false,
        isStarred: starredInsightIds.includes(data.id)
      };
      
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      setActiveInsight(data);
      
    } catch (error) {
      console.error('Error loading drilldown:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCohortSelect = async (prompt: CohortPrompt) => {
    try {
      setLoading(true);
      setShowCohortInput(false);
      
      const response = await fetch(`/data/insights/${prompt.jsonFile}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data: InsightData = await response.json();
      
      // Create a new tab for this insight
      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        title: data.display_name,
        insight: data,
        isPinned: false,
        isStarred: starredInsightIds.includes(data.id)
      };
      
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      setActiveInsight(data);
      
    } catch (error) {
      console.error('Error loading cohort:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSelect = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      setActiveInsight(tab.insight);
    }
  };

  const handleTabClose = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex !== -1) {
      const newTabs = [...tabs];
      newTabs.splice(tabIndex, 1);
      setTabs(newTabs);
      
      // If closing the active tab, select another tab
      if (tabId === activeTabId) {
        if (newTabs.length > 0) {
          // Select the tab to the left, or the first tab if closing the first tab
          const newIndex = Math.max(0, tabIndex - 1);
          setActiveTabId(newTabs[newIndex].id);
          setActiveInsight(newTabs[newIndex].insight);
        } else {
          // No tabs left
          setActiveTabId("");
          setActiveInsight(null);
        }
      }
    }
  };

  const handleTabStar = (tabId: string, isStarred: boolean) => {
    // Update tabs
    const updatedTabs = tabs.map(tab => {
      if (tab.id === tabId) {
        return { ...tab, isStarred };
      }
      return tab;
    });
    setTabs(updatedTabs);
    
    // Update starred insights
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      if (isStarred) {
        setStarredInsightIds(prev => [...prev, tab.insight.id]);
      } else {
        setStarredInsightIds(prev => prev.filter(id => id !== tab.insight.id));
      }
    }
  };

  const handleStarredInsightSelect = async (insightId: string) => {
    // Check if this insight is already open in a tab
    const existingTab = tabs.find(tab => tab.insight.id === insightId);
    if (existingTab) {
      handleTabSelect(existingTab.id);
      return;
    }
    
    // Otherwise, fetch the insight data
    try {
      setLoading(true);
      
      // In a real app, you'd fetch the specific insight by ID
      // For this example, we'll loop through the categories to find the matching file
      for (const category of TOP_INSIGHT_CATEGORIES) {
        try {
          const response = await fetch(`/data/insights/${category.jsonFile}`);
          const data: InsightData = await response.json();
          
          if (data.id === insightId) {
            const newTab: Tab = {
              id: `tab-${Date.now()}`,
              title: category.title,
              insight: data,
              isPinned: false,
              isStarred: true
            };
            
            setTabs(prev => [...prev, newTab]);
            setActiveTabId(newTab.id);
            setActiveInsight(data);
            return;
          }
        } catch (error) {
          console.error(`Error checking category ${category.title}:`, error);
        }
      }
      
      console.error(`Could not find starred insight with ID: ${insightId}`);
    } finally {
      setLoading(false);
    }
  };

  // Determine what to render
  let mainContent;
  
  if (showSplash) {
    mainContent = <LoadingSimulationModule />;
  } else if (loading) {
    mainContent = <LoadingSimulationModule />;
  } else if (showCohortInput) {
    mainContent = (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Generate Custom Insights</h2>
        <div className="w-full max-w-2xl">
          <CohortInputModule onCohortSelect={handleCohortSelect} />
        </div>
      </div>
    );
  } else if (activeInsight && activeTabId) {
    mainContent = (
      <div className="flex flex-col h-full">
        <TabManagementModule 
          tabs={tabs} 
          activeTabId={activeTabId} 
          onTabSelect={handleTabSelect} 
          onTabClose={handleTabClose} 
          onTabStar={handleTabStar}
        />
        <div className="flex-1 overflow-auto">
          <InsightDisplayModule 
            insight={activeInsight} 
            onDrilldown={handleDrilldown} 
          />
        </div>
      </div>
    );
  } else {
    // Home screen with category selection
    mainContent = (
      <div className="flex flex-col h-full p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OncoInsights</h1>
          <p className="text-lg text-gray-600">Select an insight category or create a custom cohort</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {TOP_INSIGHT_CATEGORIES.map(category => (
            <div 
              key={category.id}
              className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => handleCategorySelect(category)}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${category.bgColorClass} flex items-center justify-center mr-4`}>
                  {/* Icon would be here based on category */}
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-800 mb-1">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => setShowCohortInput(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Custom Cohort
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarModule 
        starredInsightIds={starredInsightIds}
        onStarredInsightSelect={handleStarredInsightSelect}
        onHomeClick={() => {
          setActiveInsight(null);
          setActiveTabId("");
          setShowCohortInput(false);
        }}
        onCohortGeneratorClick={() => {
          setActiveInsight(null);
          setActiveTabId("");
          setShowCohortInput(true);
        }}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {mainContent}
      </div>
    </div>
  );
}

export default App; 