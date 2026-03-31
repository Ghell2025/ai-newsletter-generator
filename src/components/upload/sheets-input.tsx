'use client';

import { useState } from 'react';
import { Link2, Loader2, AlertCircle } from 'lucide-react';
import { parseGoogleSheet, extractSheetId } from '@/lib/parsing/sheets-parser';
import { useAppStore } from '@/lib/store';

interface SheetsInputProps {
  onSuccess: () => void;
}

export function SheetsInput({ onSuccess }: SheetsInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setParsedData = useAppStore((s) => s.setParsedData);

  const isValidUrl = extractSheetId(url) !== null;

  const handleImport = async () => {
    if (!isValidUrl) return;
    setError(null);
    setIsLoading(true);
    try {
      const data = await parseGoogleSheet(url);
      setParsedData(data);
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to import sheet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="Paste Google Sheets URL..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
          />
        </div>
        <button
          onClick={handleImport}
          disabled={!isValidUrl || isLoading}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            'Import'
          )}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      <p className="text-xs text-gray-400">
        Sheet must be publicly shared. Expects two tabs: &quot;Prospects&quot; and &quot;Products&quot;.
      </p>
    </div>
  );
}
