# UI Fixes Documentation

## Cohort Selector Dropdown Fix

### Problem Description

The cohort selector dropdown in the application was expanding downward when opened. This created a usability issue where users could not see all the available options when the dropdown was positioned near the bottom of the screen, as the expanded options would be cut off by the viewport.

### Solution Implemented

We modified the Headless UI `Listbox.Options` component in the `CohortInputModule.tsx` file to make the dropdown expand upward instead of downward.

#### Before (Original Code):

```jsx
<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
  {/* Option items */}
</Listbox.Options>
```

The key issue was the use of `mt-1` (margin-top), which positioned the dropdown below the button with a small margin.

#### After (Fixed Code):

```jsx
<Listbox.Options className="absolute bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
  {/* Option items */}
</Listbox.Options>
```

Key changes:
- Replaced `mt-1` with `mb-1` (changed margin-top to margin-bottom)
- Added `bottom-full` to position the dropdown at the bottom of its container
- Maintained all other styling classes for consistent appearance

### CSS Explanation

- `absolute`: Positions the element based on its closest positioned ancestor
- `bottom-full`: Positions the element at the bottom of its container
- `mb-1`: Adds a small margin at the bottom (space between the dropdown and the button)
- `max-h-60`: Limits the maximum height of the dropdown
- `w-full`: Makes the dropdown the same width as its container
- `overflow-auto`: Adds scrollbars when content exceeds the container's dimensions

### Removed Non-functional Options

We also updated the `predefinedPrompts` array to remove options that referenced deleted or non-existent JSON files:

#### Before:

```javascript
const predefinedPrompts: CohortPrompt[] = [
  {
    id: '1',
    text: 'HR+/HER2- breast cancer patients who started on a CDK4/6 inhibitor in 1L between 2022 and 2024',
    jsonFile: 'breast-cancer-cdk46.json'
  },
  // 7 more options...
];
```

#### After:

```javascript
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

This update:
1. Reduced the number of options from 8 to 4
2. Updated the text descriptions to be more informative
3. Ensured all options linked to valid, existing JSON files
4. Made the dropdown content specific to the biomarker testing feature

### Testing

The fix was tested by running the development server with `npm start` and verifying:

1. The dropdown now expands upward when clicked
2. All options are visible regardless of screen position
3. Selection functionality works correctly
4. Only the biomarker-related cohort options are shown
5. Each option correctly links to its corresponding JSON file

### Browser Compatibility

This solution uses standard Tailwind CSS classes and should work in all modern browsers that support CSS positioning. The implementation does not rely on any experimental features or browser-specific workarounds. 