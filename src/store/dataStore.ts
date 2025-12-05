import { create } from 'zustand';
import type { ColumnDefinition, DataRow } from '../types/data';

type Status = 'idle' | 'parsing' | 'ready' | 'error';

interface DataState {
  rows: DataRow[];
  columns: ColumnDefinition[];
  status: Status;
  error?: string;
  setParsing: () => void;
  setData: (rows: DataRow[], columns: ColumnDefinition[]) => void;
  setError: (message: string) => void;
  reset: () => void;
}

const useDataStore = create<DataState>((set) => ({
  rows: [],
  columns: [],
  status: 'idle',
  error: undefined,
  setParsing: () => set({ status: 'parsing', error: undefined }),
  setData: (rows, columns) => set({ rows, columns, status: 'ready', error: undefined }),
  setError: (message) => set({ status: 'error', error: message, rows: [], columns: [] }),
  reset: () => set({ status: 'idle', rows: [], columns: [], error: undefined }),
}));

export default useDataStore;
