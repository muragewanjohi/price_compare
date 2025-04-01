'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: 'features' | 'pricing' | 'stripe' | 'layout' | 'analytics';
}

interface PrePublishChecklistProps {
  pageId: string;
  onComplete: () => void;
}

export default function PrePublishChecklist({ pageId, onComplete }: PrePublishChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([
    // Features
    { id: 'features-1', label: 'All features listed correctly', checked: false, category: 'features' },
    { id: 'features-2', label: 'Feature descriptions are clear and accurate', checked: false, category: 'features' },
    { id: 'features-3', label: 'Popular tier is clearly marked', checked: false, category: 'features' },
    
    // Pricing
    { id: 'pricing-1', label: 'All prices are accurate', checked: false, category: 'pricing' },
    { id: 'pricing-2', label: 'Monthly/yearly pricing is configured', checked: false, category: 'pricing' },
    { id: 'pricing-3', label: 'Trial period is set up', checked: false, category: 'pricing' },
    
    // Stripe
    { id: 'stripe-1', label: 'Stripe account is connected', checked: false, category: 'stripe' },
    { id: 'stripe-2', label: 'All tiers are linked to Stripe products', checked: false, category: 'stripe' },
    { id: 'stripe-3', label: 'Payment methods are configured', checked: false, category: 'stripe' },
    
    // Layout
    { id: 'layout-1', label: 'Mobile layout is tested', checked: false, category: 'layout' },
    { id: 'layout-2', label: 'CTAs are working correctly', checked: false, category: 'layout' },
    { id: 'layout-3', label: 'Theme colors are consistent', checked: false, category: 'layout' },
    
    // Analytics
    { id: 'analytics-1', label: 'Analytics tracking is added', checked: false, category: 'analytics' },
    { id: 'analytics-2', label: 'Conversion goals are set up', checked: false, category: 'analytics' },
    { id: 'analytics-3', label: 'A/B test tracking is configured', checked: false, category: 'analytics' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleItem = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('pricing_pages')
        .update({ status: 'published' })
        .eq('id', pageId);

      if (error) throw error;
      onComplete();
    } catch (error) {
      console.error('Error publishing page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allChecked = items.every(item => item.checked);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Pre-Publish Checklist</h2>
        <button
          onClick={handlePublish}
          disabled={!allChecked || isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Publishing...' : 'Publish Page'}
        </button>
      </div>

      <div className="space-y-6">
        {['features', 'pricing', 'stripe', 'layout', 'analytics'].map(category => (
          <div key={category} className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 capitalize">
              {category}
            </h3>
            <div className="space-y-2">
              {items
                .filter(item => item.category === category)
                .map(item => (
                  <div key={item.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleItem(item.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      {item.label}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {!allChecked && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Complete all checklist items
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Please review and complete all items before publishing your pricing page.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 