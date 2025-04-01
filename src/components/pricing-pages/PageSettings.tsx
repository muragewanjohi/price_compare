'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface PageSettingsProps {
  pageId: string;
  settings: {
    template: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
    };
    showMonthlyYearlyToggle?: boolean;
    showComparisonTable?: boolean;
    showFAQ?: boolean;
    customCSS?: string;
    metaTitle?: string;
    metaDescription?: string;
  };
}

export default function PageSettings({ pageId, settings: initialSettings }: PageSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateSettings = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('pricing_pages')
        .update({ settings })
        .eq('id', pageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Page Settings</h2>

      {/* Theme Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Theme Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    theme: { ...settings.theme, primaryColor: e.target.value },
                  });
                }}
                className="h-8 w-8 rounded border-gray-300"
              />
              <input
                type="text"
                value={settings.theme.primaryColor}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    theme: { ...settings.theme, primaryColor: e.target.value },
                  });
                }}
                className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="color"
                value={settings.theme.secondaryColor}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    theme: { ...settings.theme, secondaryColor: e.target.value },
                  });
                }}
                className="h-8 w-8 rounded border-gray-300"
              />
              <input
                type="text"
                value={settings.theme.secondaryColor}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    theme: { ...settings.theme, secondaryColor: e.target.value },
                  });
                }}
                className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Display Options</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showMonthlyYearlyToggle}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  showMonthlyYearlyToggle: e.target.checked,
                });
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Show Monthly/Yearly Toggle
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showComparisonTable}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  showComparisonTable: e.target.checked,
                });
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Show Feature Comparison Table
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showFAQ}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  showFAQ: e.target.checked,
                });
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Show FAQ Section
            </label>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              type="text"
              value={settings.metaTitle || ''}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  metaTitle: e.target.value,
                });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Pricing Plans - Your Company Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              value={settings.metaDescription || ''}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  metaDescription: e.target.value,
                });
              }}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Choose the perfect plan for your needs. Compare features and pricing to find the best option for your business."
            />
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Custom CSS</h3>
        <div>
          <textarea
            value={settings.customCSS || ''}
            onChange={(e) => {
              setSettings({
                ...settings,
                customCSS: e.target.value,
              });
            }}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
            placeholder="/* Add your custom CSS here */"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpdateSettings}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 