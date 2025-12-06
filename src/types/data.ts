// A single row of parsed data keyed by header/column name.
export type DataRow = Record<string, unknown>;

// Basic type inference categories captured during upload to aid validation and mapping.
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'null' | 'unknown';

export interface ColumnDefinition {
  id: string;
  label: string;
  type: ColumnType;
  required?: boolean;
}
