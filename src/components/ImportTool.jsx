import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { addItem } from '../utils/db';

const ImportTool = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus({ type: 'info', message: `Selected: ${selectedFile.name}` });
    }
  };

  const processExcel = async () => {
    if (!file) return;

    setLoading(true);
    setStatus({ type: 'info', message: 'Processing file...' });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let successCount = 0;
      for (const row of jsonData) {
        // Simple mapping: Name, Phone, DOB
        // We look for keys containing these words
        const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('name'));
        const phoneKey = Object.keys(row).find(k => k.toLowerCase().includes('phone') || k.toLowerCase().includes('number'));
        const dobKey = Object.keys(row).find(k => k.toLowerCase().includes('dob') || k.toLowerCase().includes('birthday') || k.toLowerCase().includes('date'));

        if (nameKey && phoneKey && dobKey) {
          await addItem('birthdays', {
            name: row[nameKey],
            phone: String(row[phoneKey]),
            dob: row[dobKey],
            importedAt: new Date().toISOString()
          });
          successCount++;
        }
      }

      setStatus({ 
        type: 'success', 
        message: `Successfully imported ${successCount} birthdays!` 
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to process Excel file. Check the format.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-tool">
      <div className="glass glass-card text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload size={48} className="text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Import from Excel</h2>
          <p className="text-text-muted text-sm">
            Upload an Excel (.xlsx) file with columns for Name, Phone, and DOB.
          </p>
        </div>

        <div className="relative">
          <input 
            type="file" 
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            id="excel-upload"
          />
          <label 
            htmlFor="excel-upload"
            className="btn btn-glass w-full border-dashed"
          >
            <FileText size={20} />
            {file ? file.name : "Choose File"}
          </label>
        </div>

        {status.message && (
          <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
            status.type === 'success' ? 'bg-green-500/20 text-green-300' : 
            status.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
          }`}>
            {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {status.message}
          </div>
        )}

        {status.type === 'success' && (
          <button 
            onClick={async () => {
              const { getAllItems } = await import('../utils/db');
              const { syncToBot } = await import('../utils/sync');
              const all = await getAllItems('birthdays');
              try {
                await syncToBot(all);
                alert('Synced successfully with Bot!');
              } catch (e) {
                alert('Failed to sync. Is the Bot running?');
              }
            }}
            className="btn btn-glass w-full mt-2"
          >
            Sync with Automated Bot
          </button>
        )}

        <button 
          onClick={processExcel}
          disabled={!file || loading}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {loading ? "Processing..." : "Start Import"}
        </button>
      </div>
    </div>
  );
};

export default ImportTool;
