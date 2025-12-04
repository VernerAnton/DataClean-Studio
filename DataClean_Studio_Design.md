# DataClean Studio v1 - Project Design Document

## 1. Executive Summary

DataClean Studio is a browser-based utility designed to bridge the gap between messy CSV/Excel data and Salesforce.

**Core Philosophy:** "Client-side First." Processing happens in the user's browser to ensure speed and privacy, with a direct connection to Salesforce via API.

## 2. Technical Architecture & Stack

### Core Framework
- **Runtime:** Browser-based (Single Page Application)
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite (fast HMR, optimized bundling)
- **Styling:** Tailwind CSS (utility-first) + Shadcn/UI (accessible component library) + Lucide React (icons)

### Data Engine (The "Heavy Lifting")
- **Parsing:**
  - `papaparse` for CSV
  - `xlsx` (SheetJS) for Excel files
- **Grid/Table:** TanStack Table (React Table v8). This is crucial. It is headless and highly performant, allowing us to build custom inline editing and validation logic on top of it.
- **State Management:** Zustand. We need a global store to hold the "Raw Data," "Cleaned Data," and "Salesforce Metadata" without prop-drilling.

### Salesforce Integration
- **Library:** JSForce (Browser build)
- **Auth:** OAuth 2.0 User-Agent Flow (Implicit) or PKCE
- **CORS Note:** Direct browser-to-Salesforce API calls often hit CORS issues.
  - **Dev:** Use a local proxy
  - **Prod:** We may need a tiny generic proxy (e.g., a simple Cloudflare Worker or Next.js API route) just to forward requests, but we will attempt direct connection first via Salesforce CORS whitelist settings.

## 3. User Flow (The 3-Step Wizard)

The app will be structured as a linear "Wizard":

### Step 1: Ingestion (Upload)
- **UI:** Large dropzone area
- **Action:** User drops a CSV or XLSX
- **Logic:** File is parsed into JSON. Basic column headers are detected.
- **Outcome:** Transition to Step 2 with data loaded into memory.

### Step 2: The "Clean Room" (Grid View)
- **UI:** Excel-like Data Grid
- **Sidebar Controls:** "Validation Rules" (Toggle switches)
  - Check Emails: Regex validation
  - Check Duplicates: Scan for duplicate rows based on a selected key column
  - Trim Whitespace: Auto-clean option
- **Interaction:**
  - Cells with errors turn Red
  - Hovering shows the error message
  - User can double-click a cell to Inline Edit and fix the data
  - Bulk Actions: "Delete selected rows," "Remove all rows with errors"

### Step 3: Salesforce Bridge (Map & Import)

#### Sub-step 3a: Auth & Selection
- Login to Salesforce via OAuth popup
- Select Target Object (Dropdown: Lead, Contact, Account, Custom...)

#### Sub-step 3b: Mapping
- **Left Column:** CSV Headers
- **Right Column:** Salesforce Fields (fetched dynamically)
- **Auto-Map:** Button to try and fuzzy match names (e.g., "Email Address" → "Email")
- **Validation:** Highlight if a Required Salesforce field is not mapped

#### Sub-step 3c: Execution
- "Start Import" button
- Progress bar (Importing 10 of 500...)
- **Results:** Summary screen showing "450 Success, 50 Errors"
- Download `error_rows.csv` containing only failed records with the Salesforce error message appended

## 4. Component Hierarchy

```
App
├── Navbar (Logo, Steps Indicator)
├── WizardLayout
│   ├── Step1_Upload
│   │   └── FileDropzone
│   ├── Step2_Cleaning
│   │   ├── ValidationSidebar (Controls for rules)
│   │   └── DataGrid (TanStack Table wrapper)
│   │       ├── CellEditor
│   │       └── ErrorTooltip
│   └── Step3_Integration
│       ├── SFAuthButton
│       ├── ObjectSelector
│       ├── MappingBoard (Draggable or Dropdowns)
│       └── ImportProgressModal
└── Footer (Copyright, Version)
```

## 5. Data Structures (TypeScript Interfaces)

### The Row
```typescript
type DataRow = Record<string, any>; // Flexible structure based on CSV headers
```

### The Cell Status
```typescript
interface CellError {
  rowId: string;
  columnId: string;
  type: 'invalid_email' | 'missing_required' | 'duplicate';
  message: string;
}
```

### The Mapping
```typescript
interface FieldMapping {
  csvHeader: string;
  sfFieldName: string;
  sfFieldType: string; // 'string' | 'boolean' | 'date'
  required: boolean;
}
```

## 6. Implementation Task List (Sprint Plan)

### Phase 1: The Local Lab (No Salesforce yet)
1. **Project Setup:** Initialize Vite + React + TS + Tailwind
2. **State Store:** Setup Zustand to hold the `data[]` and `columns[]`
3. **File Ingestion:** Implement FileDropzone using `papaparse`
4. **Data Grid:** Build the table using TanStack Table
   - Implement pagination (virtual scroll if >1000 rows)
   - Implement inline editing (state updates)
5. **Validation Engine:**
   - Create a util function `validateRow(row, rules)`
   - Visual feedback for invalid cells

### Phase 2: Salesforce Connectivity
6. **Auth Module:** Implement JSForce login logic (store Access Token in session/local storage)
7. **Metadata Fetcher:** Query Salesforce Describe API to get fields for Lead/Contact
8. **Mapping UI:** Build the UI to pair CSV columns to SF fields

### Phase 3: The Import Engine
9. **Payload Builder:** Transform local data into Salesforce-ready JSON based on mapping
10. **Batching:** Send data in chunks (e.g., 200 records per batch) to avoid hitting limits or timeouts
11. **Error Handling:** Catch API errors and map them back to specific rows
12. **Result View:** Success summary and Error CSV generation

## 7. Future Considerations (v2+)
- **AI Cleaning:** "LLM, standardize these Job Titles to a specific taxonomy"
- **Undo/Redo Stack:** For the cleaning grid
- **Saved Mappings:** Save `hubspot_export_map` to local storage for reuse

---

**Version:** 1.0  
**Last Updated:** 2025
