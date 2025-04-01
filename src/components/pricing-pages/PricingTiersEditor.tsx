'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface PricingTier {
  id?: string;
  name: string;
  price: number;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  is_popular?: boolean;
  cta_text: string;
  cta_link?: string;
}

interface PricingTiersEditorProps {
  pageId: string;
  tiers: PricingTier[];
}

export default function PricingTiersEditor({ pageId, tiers: initialTiers }: PricingTiersEditorProps) {
  const [tiers, setTiers] = useState<PricingTier[]>(initialTiers);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);

  const handleAddTier = () => {
    const newTier: PricingTier = {
      name: '',
      price: 0,
      billing_period: 'monthly',
      features: [''],
      cta_text: 'Get Started',
    };
    setTiers([...tiers, newTier]);
    setEditingTier(newTier);
  };

  const handleUpdateTier = async (tier: PricingTier) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('pricing_tiers')
        .upsert({
          ...tier,
          page_id: pageId,
        });

      if (error) throw error;

      setTiers(tiers.map((t) => (t.id === tier.id ? tier : t)));
      setEditingTier(null);
    } catch (error) {
      console.error('Error updating tier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTier = async (tierId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('pricing_tiers')
        .delete()
        .eq('id', tierId);

      if (error) throw error;

      setTiers(tiers.filter((t) => t.id !== tierId));
    } catch (error) {
      console.error('Error deleting tier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeature = (tierIndex: number) => {
    const updatedTiers = [...tiers];
    updatedTiers[tierIndex].features.push('');
    setTiers(updatedTiers);
  };

  const handleUpdateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const updatedTiers = [...tiers];
    updatedTiers[tierIndex].features[featureIndex] = value;
    setTiers(updatedTiers);
  };

  const handleRemoveFeature = (tierIndex: number, featureIndex: number) => {
    const updatedTiers = [...tiers];
    updatedTiers[tierIndex].features = updatedTiers[tierIndex].features.filter(
      (_, index) => index !== featureIndex
    );
    setTiers(updatedTiers);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Pricing Tiers</h2>
        <button
          onClick={handleAddTier}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Tier
        </button>
      </div>

      <div className="space-y-6">
        {tiers.map((tier, tierIndex) => (
          <div
            key={tier.id || tierIndex}
            className="border rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => {
                      const updatedTier = { ...tier, name: e.target.value };
                      setTiers(tiers.map((t) => (t.id === tier.id ? updatedTier : t)));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Basic, Pro, Enterprise"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => {
                          const updatedTier = { ...tier, price: Number(e.target.value) };
                          setTiers(tiers.map((t) => (t.id === tier.id ? updatedTier : t)));
                        }}
                        className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Billing Period
                    </label>
                    <select
                      value={tier.billing_period}
                      onChange={(e) => {
                        const updatedTier = { ...tier, billing_period: e.target.value as 'monthly' | 'yearly' };
                        setTiers(tiers.map((t) => (t.id === tier.id ? updatedTier : t)));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Features
                  </label>
                  <div className="mt-2 space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleUpdateFeature(tierIndex, featureIndex, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="e.g., Feature description"
                        />
                        <button
                          onClick={() => handleRemoveFeature(tierIndex, featureIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddFeature(tierIndex)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={tier.cta_text}
                    onChange={(e) => {
                      const updatedTier = { ...tier, cta_text: e.target.value };
                      setTiers(tiers.map((t) => (t.id === tier.id ? updatedTier : t)));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Get Started, Contact Sales"
                  />
                </div>
              </div>

              <div className="ml-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tier.is_popular}
                    onChange={(e) => {
                      const updatedTier = { ...tier, is_popular: e.target.checked };
                      setTiers(tiers.map((t) => (t.id === tier.id ? updatedTier : t)));
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Mark as Popular
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {tier.id && (
                <button
                  onClick={() => handleDeleteTier(tier.id!)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => handleUpdateTier(tier)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 