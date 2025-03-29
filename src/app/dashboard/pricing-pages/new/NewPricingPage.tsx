'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
    if (!selectedTemplate || !pageName) return;

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
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
            },
          },
        ])
        .select()
        .single();

      if (error) throw error;
      router.push(`/dashboard/pricing-pages/${data.id}/edit`);
    } catch (error) {
      console.error('Error creating pricing page:', error);
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