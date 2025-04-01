'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const supabase = createClient();

const templates = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Simple, clean pricing table with monthly/yearly toggle',
    preview: '/templates/basic.png',
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Feature-rich pricing with comparison table and FAQ section',
    preview: '/templates/pro.png',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Customizable enterprise pricing with contact form',
    preview: '/templates/enterprise.png',
  },
];

export default function NewPricingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [pageName, setPageName] = useState('');

  const handleCreatePage = async () => {
    if (!selectedTemplate || !pageName) {
      toast.error('Please select a template and enter a page name');
      return;
    }

    try {
      setIsLoading(true);
      
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        toast.error('Authentication error. Please try logging in again.');
        return;
      }

      if (!user) {
        toast.error('Please log in to create a pricing page');
        return;
      }

      // First, let's verify the pricing_pages table exists and we can query it
      const { error: tableCheckError } = await supabase
        .from('pricing_pages')
        .select('id')
        .limit(1);

      if (tableCheckError) {
        console.error('Table check error:', tableCheckError);
        toast.error('Error accessing pricing pages. Please contact support.');
        return;
      }

      // Create the pricing page
      const { data, error: insertError } = await supabase
        .from('pricing_pages')
        .insert([
          {
            name: pageName,
            template: selectedTemplate,
            user_id: user.id,
            owner_type: 'user',
            status: 'draft',
            settings: {
              template: selectedTemplate,
              theme: {
                primaryColor: '#4F46E5',
                secondaryColor: '#1E293B',
              },
              showMonthlyYearlyToggle: true,
              showComparisonTable: selectedTemplate !== 'basic',
              showFAQ: selectedTemplate === 'pro' || selectedTemplate === 'enterprise',
            },
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error(insertError.message || 'Error creating pricing page');
        return;
      }

      if (!data) {
        toast.error('No data returned after creating page');
        return;
      }

      toast.success('Pricing page created successfully!');
      router.push(`/dashboard/pricing-pages/${data.id}/edit`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Pricing Page</h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose a template and customize it to match your brand
          </p>
        </div>

        {/* Page Name Input */}
        <div className="mb-8">
          <label htmlFor="pageName" className="block text-sm font-medium text-gray-700">
            Page Name
          </label>
          <input
            type="text"
            id="pageName"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., SaaS Pricing, Product Plans"
          />
        </div>

        {/* Template Selection */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative rounded-lg border p-6 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-indigo-500 ring-2 ring-indigo-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-100 rounded-md">
                {/* Template preview image would go here */}
                <div className="flex items-center justify-center h-full text-gray-400">
                  Preview
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{template.description}</p>
            </div>
          ))}
        </div>

        {/* Create Button */}
        <div className="mt-8">
          <button
            onClick={handleCreatePage}
            disabled={isLoading || !selectedTemplate || !pageName}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Create Page'
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 