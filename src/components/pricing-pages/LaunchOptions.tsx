'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface LaunchOptionsProps {
  pageId: string;
  pageName: string;
  status: 'draft' | 'published';
  url?: string;
}

export default function LaunchOptions({ pageId, pageName, status, url }: LaunchOptionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('pricing_pages')
        .update({ status: 'published' })
        .eq('id', pageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error publishing page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('pricing_pages')
        .update({ status: 'draft' })
        .eq('id', pageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error unpublishing page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const embedCode = `<iframe
  src="${url}"
  width="100%"
  height="800px"
  frameborder="0"
  allow="payment"
></iframe>`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Launch Options</h2>
        {status === 'draft' ? (
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Publishing...' : 'Publish Page'}
          </button>
        ) : (
          <button
            onClick={handleUnpublish}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Unpublishing...' : 'Unpublish Page'}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Page URL */}
        <div>
          <h3 className="text-sm font-medium text-gray-700">Page URL</h3>
          <div className="mt-2 flex rounded-md shadow-sm">
            <input
              type="text"
              readOnly
              value={url || 'Not published yet'}
              className="flex-1 block w-full rounded-md border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {url && (
              <button
                onClick={() => navigator.clipboard.writeText(url)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Copy
              </button>
            )}
          </div>
        </div>

        {/* Embed Code */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Embed Code</h3>
            <button
              onClick={() => setShowEmbedCode(!showEmbedCode)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showEmbedCode ? 'Hide' : 'Show'} embed code
            </button>
          </div>
          {showEmbedCode && (
            <div className="mt-2">
              <div className="relative">
                <pre className="p-4 bg-gray-50 rounded-md overflow-x-auto">
                  <code className="text-sm text-gray-800">{embedCode}</code>
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(embedCode)}
                  className="absolute top-2 right-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analytics */}
        <div>
          <h3 className="text-sm font-medium text-gray-700">Analytics</h3>
          <div className="mt-2 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="track-pageviews"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="track-pageviews" className="ml-2 block text-sm text-gray-900">
                Track page views
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="track-conversions"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="track-conversions" className="ml-2 block text-sm text-gray-900">
                Track conversions
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="track-ab-tests"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="track-ab-tests" className="ml-2 block text-sm text-gray-900">
                Track A/B test results
              </label>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-sm font-medium text-gray-700">Status</h3>
          <div className="mt-2 flex items-center">
            <div
              className={`h-2 w-2 rounded-full ${
                status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span className="ml-2 text-sm text-gray-900 capitalize">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 