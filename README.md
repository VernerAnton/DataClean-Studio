# DataClean Studio

A client-side-first data cleaning and Salesforce import assistant built with React and Vite.

## Getting started
1. Install Node.js 18+ and npm.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Testing
- Run the unit tests:
  ```bash
  npm test
  ```

## Step 1: Upload & Parse
- Drag-and-drop CSV or Excel files into the upload dropzone (or browse to select a file).
- Parsing occurs in the browser using PapaParse (CSV) and SheetJS (Excel).
- On success, the global store is populated with rows and columns, and a small preview of the first rows is shown.
- Errors surface inline, preventing navigation to the next step until resolved.
