'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Send,
  Download,
  Check,
  Monitor,
  Smartphone,
  Mail,
  Building2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function PreviewPage() {
  const router = useRouter();
  const newsletters = useAppStore((s) => s.newsletters);
  const selectedProspectId = useAppStore((s) => s.selectedProspectId);
  const setSelectedProspectId = useAppStore((s) => s.setSelectedProspectId);

  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (newsletters.length === 0) {
      router.replace('/');
    }
  }, [newsletters, router]);

  if (newsletters.length === 0) return null;

  const currentNewsletter =
    newsletters.find((n) => n.prospectId === selectedProspectId) || newsletters[0];

  const currentIndex = newsletters.findIndex(
    (n) => n.prospectId === currentNewsletter.prospectId
  );

  const goPrev = () => {
    const prev = (currentIndex - 1 + newsletters.length) % newsletters.length;
    setSelectedProspectId(newsletters[prev].prospectId);
  };

  const goNext = () => {
    const next = (currentIndex + 1) % newsletters.length;
    setSelectedProspectId(newsletters[next].prospectId);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentNewsletter.htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentNewsletter.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${currentNewsletter.prospectCompany.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen flex-col animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Newsletter Preview</h1>
            <p className="text-xs text-gray-500">
              {newsletters.length} personalized newsletters generated
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 text-sm sm:flex">
          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
            Upload
          </span>
          <span className="text-gray-300">&rarr;</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
            Dashboard
          </span>
          <span className="text-gray-300">&rarr;</span>
          <span className="rounded-full bg-blue-700 px-3 py-1 font-medium text-white">
            Preview
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Prospects
            </h2>
            <div className="space-y-1">
              {newsletters.map((nl) => (
                <button
                  key={nl.prospectId}
                  onClick={() => setSelectedProspectId(nl.prospectId)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition-all ${
                    nl.prospectId === currentNewsletter.prospectId
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mail
                      className={`h-4 w-4 flex-shrink-0 ${
                        nl.prospectId === currentNewsletter.prospectId
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{nl.prospectName}</div>
                      <div className="flex items-center gap-1 truncate text-xs opacity-60">
                        <Building2 className="h-3 w-3" />
                        {nl.prospectCompany}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1 pl-6">
                    {nl.matchedProducts.slice(0, 2).map((mp) => (
                      <span
                        key={mp.id}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500"
                      >
                        {mp.category}
                      </span>
                    ))}
                    {nl.matchedProducts.length > 2 && (
                      <span className="text-[10px] text-gray-400">
                        +{nl.matchedProducts.length - 2}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main preview area */}
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-100">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {currentNewsletter.prospectName}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {currentNewsletter.prospectCompany}
                </span>
              </div>
              <button
                onClick={goNext}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <div className="mr-3 flex rounded-lg border border-gray-200 p-0.5">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`rounded-md p-1.5 transition-all ${
                    viewMode === 'desktop'
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`rounded-md p-1.5 transition-all ${
                    viewMode === 'mobile'
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy HTML
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handleSend}
                className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-blue-800"
              >
                {sent ? (
                  <>
                    <Check className="h-4 w-4" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email preview iframe */}
          <div className="flex flex-1 items-start justify-center overflow-auto p-6">
            <div
              className={`flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ${
                viewMode === 'desktop' ? 'w-full max-w-[640px]' : 'w-[375px]'
              }`}
            >
              {/* Mock email client header */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-gray-400">
                  {currentNewsletter.subject}
                </div>
              </div>
              {/* Email meta */}
              <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
                <div>
                  <span className="font-medium text-gray-700">To:</span>{' '}
                  {currentNewsletter.prospectName} &lt;{currentNewsletter.prospectEmail}&gt;
                </div>
                <div>
                  <span className="font-medium text-gray-700">Subject:</span>{' '}
                  {currentNewsletter.subject}
                </div>
              </div>
              {/* Iframe */}
              <iframe
                key={currentNewsletter.prospectId}
                srcDoc={currentNewsletter.htmlContent}
                className="w-full border-0"
                style={{ minHeight: '700px', height: '85vh' }}
                sandbox="allow-same-origin"
                title={`Newsletter for ${currentNewsletter.prospectCompany}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {sent && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-fade-in">
          <div className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
            <Check className="h-4 w-4 text-green-400" />
            Email sent to {currentNewsletter.prospectEmail}
          </div>
        </div>
      )}
    </div>
  );
}
