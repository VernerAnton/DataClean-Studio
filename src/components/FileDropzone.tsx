import { useCallback, useRef, useState } from 'react';
import useDataStore from '../store/dataStore';
import { parseFile } from '../utils/parseFile';

const FileDropzone = () => {
  const { setParsing, setData, setError, status } = useDataStore();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      setParsing();
      try {
        const { rows, columns } = await parseFile(file);
        setData(rows, columns);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to parse file.';
        setError(message);
      }
    },
    [setParsing, setData, setError],
  );

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      await handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const onBrowseClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      await handleFiles(event.target.files);
    },
    [handleFiles],
  );

  return (
    <div
      className={`dropzone${dragging ? ' dragging' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <h2>Drop a CSV or Excel file</h2>
      <p>Parsing happens in your browser. We only move forward when the file is successfully read.</p>
      <button type="button" onClick={onBrowseClick} disabled={status === 'parsing'}>
        {status === 'parsing' ? 'Parsing…' : 'Browse files'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
    </div>
  );
};

export default FileDropzone;
