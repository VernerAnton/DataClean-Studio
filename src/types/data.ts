export type DataRow = Record<string, unknown>;

export interface ColumnDefinition {
  id: string;
  label: string;
  required?: boolean;
}
