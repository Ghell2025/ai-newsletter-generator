'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Sparkles, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Dropzone } from '@/components/upload/dropzone';
import { SheetsInput } from '@/components/upload/sheets-input';
import { parseExcelBuffer } from '@/lib/parsing/excel-parser';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  const setParsedData = useAppStore((s) => s.setParsedData);
  const [loadingSample, setLoadingSample] = useState(false);

  const goToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const handleLoadSample = async () => {
    setLoadingSample(true);
    try {
      const res = await fetch('/sample-data.xlsx');
      const buffer = await res.arrayBuffer();
      const data = parseExcelBuffer(buffer);
      setParsedData(data);
      router.push('/dashboard');
    } catch {
      setLoadingSample(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 shadow-lg shadow-blue-200">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            AI Newsletter Generator
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Upload your prospects and products. Let AI craft personalized newsletters for each client.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Step 1 — Import your data
            </h2>
            <p className="text-sm text-gray-500">
              Upload an Excel file with two sheets: <strong>Prospects</strong> (Name, Email, Company, Industry, Interests) and <strong>Products</strong> (Name, Description, Category, Image, Features).
            </p>
          </div>

          {/* Dropzone */}
          <div className="mb-6">
            <Dropzone onSuccess={goToDashboard} />
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google Sheets */}
          <div className="mb-6">
            <SheetsInput onSuccess={goToDashboard} />
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Sample Data */}
          <button
            onClick={handleLoadSample}
            disabled={loadingSample}
            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-6 py-4 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 hover:border-blue-300 disabled:opacity-60"
          >
            {loadingSample ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700" />
            ) : (
              <FileSpreadsheet className="h-5 w-5" />
            )}
            Try with sample data (machinery products)
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your data stays in your browser. Nothing is sent to external servers.
        </p>
      </div>
    </div>
  );
}
