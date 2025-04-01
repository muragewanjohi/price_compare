'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface PricingTier {
  id: string;
  name: string;
  price: number;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  is_popular?: boolean;
  cta_text: string;
  cta_link?: string;
}

interface PageSettings {
  template: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  showMonthlyYearlyToggle?: boolean;
  showComparisonTable?: boolean;
  showFAQ?: boolean;
  customCSS?: string;
}

interface PreviewPanelProps {
  pageId: string;
  pageData: {
    name: string;
    settings: PageSettings;
    pricing_tiers: PricingTier[];
  };
}

export default function PreviewPanel({ pageId, pageData }: PreviewPanelProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isMobile, setIsMobile] = useState(false);

  const renderPricingTiers = () => {
    return pageData.pricing_tiers.map((tier) => (
      <div
        key={tier.id}
        className={`relative rounded-lg border p-6 ${
          tier.is_popular
            ? 'border-indigo-500 ring-2 ring-indigo-500'
            : 'border-gray-200'
        }`}
      >
        {tier.is_popular && (
          <span className="absolute top-0 -translate-y-1/2 bg-indigo-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Most Popular
          </span>
        )}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">{tier.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
            <span className="text-gray-500">/{tier.billing_period}</span>
          </div>
          <ul className="mt-6 space-y-4">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-500">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <button
            className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-medium text-white ${
              tier.is_popular
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-800 hover:bg-gray-900'
            }`}
          >
            {tier.cta_text}
          </button>
        </div>
      </div>
    ));
  };

  const renderComparisonTable = () => {
    if (!pageData.settings.showComparisonTable) return null;

    const allFeatures = Array.from(
      new Set(
        pageData.pricing_tiers.flatMap((tier) => tier.features)
      )
    );

    return (
      <div className="mt-12">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                {pageData.pricing_tiers.map((tier) => (
                  <th
                    key={tier.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allFeatures.map((feature) => (
                <tr key={feature}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {feature}
                  </td>
                  {pageData.pricing_tiers.map((tier) => (
                    <td
                      key={tier.id}
                      className="px-6 py-4 whitespace-nowrap text-center"
                    >
                      {tier.features.includes(feature) ? (
                        <svg
                          className="h-5 w-5 text-green-500 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFAQ = () => {
    if (!pageData.settings.showFAQ) return null;

    return (
      <div className="mt-12">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900">
              What payment methods do you accept?
            </h4>
            <p className="mt-2 text-sm text-gray-500">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900">
              Can I change my plan later?
            </h4>
            <p className="mt-2 text-sm text-gray-500">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900">
              Do you offer refunds?
            </h4>
            <p className="mt-2 text-sm text-gray-500">
              We offer a 30-day money-back guarantee for all paid plans.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Preview</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobile(false)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                !isMobile
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setIsMobile(true)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                isMobile
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mobile
            </button>
          </div>
          {pageData.settings.showMonthlyYearlyToggle && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Billing:</span>
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  billingPeriod === 'monthly'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  billingPeriod === 'yearly'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yearly
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`border rounded-lg overflow-hidden ${
          isMobile ? 'max-w-sm mx-auto' : ''
        }`}
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {pageData.name}
          </h1>

          <div
            className={`grid gap-6 ${
              isMobile ? 'grid-cols-1' : 'grid-cols-3'
            }`}
          >
            {renderPricingTiers()}
          </div>

          {renderComparisonTable()}
          {renderFAQ()}
        </div>
      </div>
    </div>
  );
} 