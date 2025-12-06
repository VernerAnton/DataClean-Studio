import { describe, expect, it } from 'vitest';

import useDataStore from './dataStore';

const resetStore = () => useDataStore.setState({ rows: [], columns: [], status: 'idle', error: undefined });

describe('useDataStore', () => {
  it('transitions through parsing and ready states', () => {
    resetStore();

    useDataStore.getState().setParsing();
    expect(useDataStore.getState().status).toBe('parsing');

    const rows = [{ id: '1', name: 'Alice' }];
    const columns = [
      { id: 'id', label: 'id', type: 'string', required: true },
      { id: 'name', label: 'name', type: 'string', required: false },
    ];

    useDataStore.getState().setData(rows, columns);

    expect(useDataStore.getState().rows).toEqual(rows);
    expect(useDataStore.getState().columns).toEqual(columns);
    expect(useDataStore.getState().status).toBe('ready');
    expect(useDataStore.getState().error).toBeUndefined();
  });

  it('records errors and can reset to idle', () => {
    resetStore();

    useDataStore.getState().setError('Parsing failed');
    expect(useDataStore.getState().status).toBe('error');
    expect(useDataStore.getState().error).toBe('Parsing failed');
    expect(useDataStore.getState().rows).toEqual([]);
    expect(useDataStore.getState().columns).toEqual([]);

    useDataStore.getState().reset();
    expect(useDataStore.getState().status).toBe('idle');
    expect(useDataStore.getState().error).toBeUndefined();
  });
});
