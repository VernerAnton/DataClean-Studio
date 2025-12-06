import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { ColumnDefinition, ColumnType, DataRow } from '../types/data';

export interface ParsedResult {
  rows: DataRow[];
  columns: ColumnDefinition[];
}

const inferColumnType = (value: unknown): ColumnType => {
  if (value === null) return 'null';
  if (value instanceof Date) return 'date';
  const valueType = typeof value;
  if (valueType === 'string') return 'string';
  if (valueType === 'number') return 'number';
  if (valueType === 'boolean') return 'boolean';
  return 'unknown';
};

const normalizeColumns = (rows: DataRow[]): ColumnDefinition[] => {
  const firstRow = rows.find((row) => Object.keys(row).length > 0) ?? {};
  return Object.keys(firstRow).map((key) => ({
    id: key,
    label: key,
    type: inferColumnType(firstRow[key]),
  }));
};

const parseCsvFile = (file: File): Promise<ParsedResult> =>
  new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length) {
          reject(new Error(result.errors[0].message));
          return;
        }
        const rows = result.data as DataRow[];
        resolve({ rows, columns: normalizeColumns(rows) });
      },
      error: (error) => reject(error),
    });
  });

const parseExcelFile = async (file: File): Promise<ParsedResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = (XLSX.utils.sheet_to_json(sheet, { defval: '' }) as DataRow[]) ?? [];
  return { rows, columns: normalizeColumns(rows) };
};

export const parseFile = async (file: File): Promise<ParsedResult> => {
  const extension = file.name.toLowerCase();
  if (extension.endsWith('.csv')) {
    return parseCsvFile(file);
  }

  if (extension.endsWith('.xlsx') || extension.endsWith('.xls')) {
    return parseExcelFile(file);
  }

  throw new Error('Unsupported file type. Please upload a CSV or Excel file.');
};
