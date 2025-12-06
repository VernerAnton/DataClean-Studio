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

## Available scripts
- `npm run dev` — start the Vite dev server.
- `npm run build` — create a production build.
- `npm run preview` — preview the production build locally.
- `npm test` — run the Vitest suite.
- `npm run typecheck` — run a type-only check with `tsc --noEmit`.

## Testing
- Run the unit tests:
  ```bash
  npm test
  ```
- Optional: run a type-only check (no emit):
  ```bash
  npm run typecheck
  ```

## Step 1: Upload & Parse
- Drag-and-drop CSV or Excel files into the upload dropzone (or browse to select a file).
- Parsing occurs in the browser using PapaParse (CSV) and SheetJS (Excel).
- On success, the global store is populated with rows and columns, and a small preview of the first rows is shown.
- Columns capture inferred types (string/number/boolean/date/null/unknown) to smooth validation in later steps.
- Errors surface inline, preventing navigation to the next step until resolved.

See `DataClean_Studio_Design.md` for the full project plan and how Step 1 hands off to the cleaning grid.

## Merge conflict tips
- If you see conflict markers (<<<<<<< / ======= / >>>>>>>), keep the sections that document available scripts and the column type inference notes for uploads.
- Ensure `package.json` preserves the `test` and `typecheck` scripts alongside `dev`, `build`, and `preview` when resolving conflicts.
- Keep the column type definitions in `src/types/data.ts` aligned with the parsing utility so uploads retain inferred metadata for later validation.
