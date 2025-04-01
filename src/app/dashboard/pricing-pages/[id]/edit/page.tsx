'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import PricingTiers from '@/components/pricing-pages/PricingTiers';

const supabase = createClient();

interface PricingPage {
  id: string;
  name: string;
  template: string;
  settings: {
    template: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
    };
    showMonthlyYearlyToggle: boolean;
    showComparisonTable: boolean;
    showFAQ: boolean;
  };
}

interface PricingTier {
  id?: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  cta_text: string;
  cta_url: string;
  is_popular?: boolean;
  monthly_price: number;
  yearly_price: number;
}

export default function EditPricingPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<PricingPage | null>(null);
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageAndTiers = async () => {
      try {
        // Fetch page data
        const { data: pageData, error: pageError } = await supabase
          .from('pricing_pages')
          .select('*')
          .eq('id', params.id)
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          setError('Failed to load pricing page');
          return;
        }

        setPage(pageData);

        // Fetch pricing tiers
        const { data: tiersData, error: tiersError } = await supabase
          .from('pricing_tiers')
          .select('*')
          .eq('pricing_page_id', params.id);

        if (tiersError) {
          console.error('Error fetching tiers:', tiersError);
          // Don't set error state for tiers, just log it
          return;
        }

        setTiers(tiersData || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageAndTiers();
  }, [params.id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!page) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Page Not Found</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>The pricing page you're looking for doesn't exist.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Pricing Page</h1>
          <p className="mt-2 text-sm text-gray-600">
            Customize your pricing page settings and content
          </p>
        </div>

        {/* Page Name */}
        <div className="mb-8">
          <label htmlFor="pageName" className="block text-sm font-medium text-gray-700">
            Page Name
          </label>
          <input
            type="text"
            id="pageName"
            value={page.name}
            onChange={(e) => setPage({ ...page, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Template Settings */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Template Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showMonthlyYearlyToggle"
                checked={page.settings.showMonthlyYearlyToggle}
                onChange={(e) => setPage({
                  ...page,
                  settings: {
                    ...page.settings,
                    showMonthlyYearlyToggle: e.target.checked
                  }
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showMonthlyYearlyToggle" className="ml-2 block text-sm text-gray-900">
                Show Monthly/Yearly Toggle
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showComparisonTable"
                checked={page.settings.showComparisonTable}
                onChange={(e) => setPage({
                  ...page,
                  settings: {
                    ...page.settings,
                    showComparisonTable: e.target.checked
                  }
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showComparisonTable" className="ml-2 block text-sm text-gray-900">
                Show Comparison Table
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showFAQ"
                checked={page.settings.showFAQ}
                onChange={(e) => setPage({
                  ...page,
                  settings: {
                    ...page.settings,
                    showFAQ: e.target.checked
                  }
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="showFAQ" className="ml-2 block text-sm text-gray-900">
                Show FAQ Section
              </label>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Theme Settings</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <input
                type="color"
                id="primaryColor"
                value={page.settings.theme.primaryColor}
                onChange={(e) => setPage({
                  ...page,
                  settings: {
                    ...page.settings,
                    theme: {
                      ...page.settings.theme,
                      primaryColor: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                Secondary Color
              </label>
              <input
                type="color"
                id="secondaryColor"
                value={page.settings.theme.secondaryColor}
                onChange={(e) => setPage({
                  ...page,
                  settings: {
                    ...page.settings,
                    theme: {
                      ...page.settings.theme,
                      secondaryColor: e.target.value
                    }
                  }
                })}
                className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-8">
          <PricingTiers
            pageId={page.id}
            tiers={tiers}
            onTiersChange={setTiers}
          />
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                console.log('Updating page with data:', {
                  name: page.name,
                  settings: page.settings
                });

                const { data, error } = await supabase
                  .from('pricing_pages')
                  .update({
                    name: page.name,
                    settings: page.settings,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', page.id)
                  .select()
                  .single();

                if (error) {
                  console.error('Supabase error:', error);
                  throw error;
                }

                console.log('Update successful:', data);
                toast.success('Pricing page updated successfully!');
              } catch (err) {
                console.error('Error updating page:', err);
                toast.error(err instanceof Error ? err.message : 'Failed to update pricing page');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 