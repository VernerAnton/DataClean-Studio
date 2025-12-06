export type DataRow = Record<string, unknown>;

export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'null' | 'unknown';

export interface ColumnDefinition {
  id: string;
  label: string;
  type: ColumnType;
  required?: boolean;
}
