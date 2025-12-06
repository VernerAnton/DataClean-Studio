import FileDropzone from './components/FileDropzone';
import useDataStore from './store/dataStore';

function App() {
  const { rows, columns, status, error } = useDataStore();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Step 1 of 3</p>
          <h1>Upload your data</h1>
          <p className="subtitle">
            Drop a CSV or Excel file to parse it in your browser. Parsed data will be sent to the cleaning grid in the next step.
          </p>
        </div>
        <div className="status-card">
          <p className="label">Current status</p>
          <p className={`status ${status}`}>{status === 'idle' ? 'Waiting for upload' : status}</p>
          {error ? <p className="error">{error}</p> : null}
          {status === 'ready' ? (
            <p className="meta">{rows.length} rows · {columns.length} columns detected</p>
          ) : null}
        </div>
      </header>

      <main className="main">
        <FileDropzone />
        {status === 'ready' ? (
          <section className="preview">
            <h2>Preview snapshot</h2>
            <p className="subtitle">First five rows parsed in-memory.</p>
            <div className="table">
              <div className="table-header">
                {columns.map((column) => (
                  <span key={column.id}>{column.label}</span>
                ))}
              </div>
              {rows.slice(0, 5).map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="table-row">
                  {columns.map((column) => (
                    <span key={`${rowIndex}-${column.id}`}>
                      {String(row[column.id] ?? '')}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default App;
