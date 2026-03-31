'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Users,
  Package,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { GenerationEvent } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const parsedData = useAppStore((s) => s.parsedData);
  const isGenerating = useAppStore((s) => s.isGenerating);
  const setIsGenerating = useAppStore((s) => s.setIsGenerating);
  const generationProgress = useAppStore((s) => s.generationProgress);
  const setGenerationProgress = useAppStore((s) => s.setGenerationProgress);
  const addNewsletter = useAppStore((s) => s.addNewsletter);
  const setSelectedProspectId = useAppStore((s) => s.setSelectedProspectId);
  const newsletters = useAppStore((s) => s.newsletters);
  const setNewsletters = useAppStore((s) => s.setNewsletters);

  const [currentProspectName, setCurrentProspectName] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!parsedData) {
      router.replace('/');
    }
  }, [parsedData, router]);

  if (!parsedData) return null;

  const { prospects, products } = parsedData;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsDone(false);
    setCompletedIds(new Set());
    setNewsletters([]);
    setGenerationProgress({ current: 0, total: prospects.length });

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospects, products }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.replace(/^data: /, '').trim();
          if (!trimmed) continue;

          const event: GenerationEvent = JSON.parse(trimmed);

          if (event.type === 'start') {
            setCurrentProspectName(event.prospectName || null);
            setGenerationProgress({
              current: event.current || 0,
              total: event.total || prospects.length,
            });
          } else if (event.type === 'complete' && event.newsletter) {
            addNewsletter(event.newsletter);
            setCompletedIds((prev) => new Set([...prev, event.prospectId!]));
          } else if (event.type === 'done') {
            setIsDone(true);
            setIsGenerating(false);
          }
        }
      }
    } catch {
      setIsGenerating(false);
    }
  };

  const handleViewNewsletters = () => {
    if (newsletters.length > 0) {
      setSelectedProspectId(newsletters[0].prospectId);
    }
    router.push('/preview');
  };

  const progressPercent =
    generationProgress.total > 0
      ? (generationProgress.current / generationProgress.total) * 100
      : 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Review your data, then generate newsletters</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 text-sm sm:flex">
          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
            Upload
          </span>
          <span className="text-gray-300">&rarr;</span>
          <span className="rounded-full bg-blue-700 px-3 py-1 font-medium text-white">
            Dashboard
          </span>
          <span className="text-gray-300">&rarr;</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-400">
            Preview
          </span>
        </div>
      </div>

      {/* Data Tables */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Prospects Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Prospects</h2>
            <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {prospects.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Industry</th>
                  <th className="px-5 py-3">Needs</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'} ${completedIds.has(p.id) ? 'bg-green-50/50' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.company}</div>
                      <div className="text-xs text-gray-400">{p.email}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{p.industry}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.interests.map((interest) => (
                          <span
                            key={interest}
                            className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <Package className="h-5 w-5 text-indigo-500" />
            <h2 className="font-semibold text-gray-900">Products</h2>
            <span className="ml-auto rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {products.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="mt-0.5 text-xs text-gray-400 line-clamp-1">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Generation Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {!isGenerating && !isDone && (
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Ready to generate
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              AI will match your products to each prospect&apos;s needs and generate personalized newsletters with product images.
            </p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" />
              Generate Newsletters
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Generating...</h3>
              <span className="text-sm text-gray-500">
                {generationProgress.current} of {generationProgress.total}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-2">
              {prospects.map((p) => {
                const isCompleted = completedIds.has(p.id);
                const isCurrent = currentProspectName === p.name && !isCompleted;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all ${
                      isCompleted
                        ? 'bg-green-50 text-green-700'
                        : isCurrent
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-200" />
                    )}
                    <span className={isCompleted || isCurrent ? 'font-medium' : ''}>
                      {p.name}
                    </span>
                    <span className="text-xs opacity-60">{p.company}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isDone && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              All newsletters generated!
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              {newsletters.length} personalized product newsletters are ready to preview.
            </p>
            <button
              onClick={handleViewNewsletters}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              View Newsletters
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
