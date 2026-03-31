'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { parseExcelBuffer } from '@/lib/parsing/excel-parser';
import { useAppStore } from '@/lib/store';

interface DropzoneProps {
  onSuccess: () => void;
}

export function Dropzone({ onSuccess }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setParsedData = useAppStore((s) => s.setParsedData);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setFileName(file.name);

      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5MB.');
        return;
      }

      if (!file.name.match(/\.xlsx?$/i)) {
        setError('Please upload an Excel file (.xlsx or .xls).');
        return;
      }

      setIsProcessing(true);
      try {
        const buffer = await file.arrayBuffer();
        const data = parseExcelBuffer(buffer);
        setParsedData(data);
        onSuccess();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to parse file.');
      } finally {
        setIsProcessing(false);
      }
    },
    [setParsedData, onSuccess]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200
        ${isDragging
          ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
          : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={onFileSelect}
        className="hidden"
      />

      {isProcessing ? (
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm text-gray-600">Parsing {fileName}...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {error ? (
            <AlertCircle className="h-12 w-12 text-red-400" />
          ) : fileName ? (
            <FileSpreadsheet className="h-12 w-12 text-indigo-500" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          <div>
            <p className="text-base font-semibold text-gray-700">
              {error ? 'Upload failed' : 'Drop your Excel file here'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {error || 'or click to browse (.xlsx)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
