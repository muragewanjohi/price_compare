'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const supabase = createClient();

interface PricingTier {
  id?: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year' | 'one_time';
  currency: string;
  features: string[];
  highlight: boolean;
  sort_order: number;
  stripe_price_id?: string;
  metadata?: Record<string, any>;
}

interface PricingTiersProps {
  pageId: string;
  tiers: PricingTier[];
  onTiersChange: (tiers: PricingTier[]) => void;
}

export default function PricingTiers({ pageId, tiers, onTiersChange }: PricingTiersProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTier = () => {
    const newTier: PricingTier = {
      name: 'New Tier',
      description: '',
      price: 0,
      interval: 'month',
      currency: 'usd',
      features: [],
      highlight: false,
      sort_order: tiers.length,
      metadata: {}
    };
    onTiersChange([...tiers, newTier]);
  };

  const handleUpdateTier = (index: number, field: keyof PricingTier, value: any) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    onTiersChange(updatedTiers);
  };

  const handleAddFeature = (index: number) => {
    const updatedTiers = [...tiers];
    updatedTiers[index].features.push('');
    onTiersChange(updatedTiers);
  };

  const handleUpdateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const updatedTiers = [...tiers];
    updatedTiers[tierIndex].features[featureIndex] = value;
    onTiersChange(updatedTiers);
  };

  const handleRemoveFeature = (tierIndex: number, featureIndex: number) => {
    const updatedTiers = [...tiers];
    updatedTiers[tierIndex].features = updatedTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
    onTiersChange(updatedTiers);
  };

  const handleRemoveTier = (index: number) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    // Update sort_order for remaining tiers
    updatedTiers.forEach((tier, i) => {
      tier.sort_order = i;
    });
    onTiersChange(updatedTiers);
  };

  const handleMoveTier = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === tiers.length - 1)
    ) {
      return;
    }

    const updatedTiers = [...tiers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap sort_order
    [updatedTiers[index].sort_order, updatedTiers[newIndex].sort_order] = 
    [updatedTiers[newIndex].sort_order, updatedTiers[index].sort_order];
    
    // Swap positions in array
    [updatedTiers[index], updatedTiers[newIndex]] = 
    [updatedTiers[newIndex], updatedTiers[index]];
    
    onTiersChange(updatedTiers);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // First, delete existing tiers
      const { error: deleteError } = await supabase
        .from('pricing_tiers')
        .delete()
        .eq('pricing_page_id', pageId);

      if (deleteError) throw deleteError;

      // Then insert new tiers
      const { error: insertError } = await supabase
        .from('pricing_tiers')
        .insert(
          tiers.map(tier => ({
            pricing_page_id: pageId,
            name: tier.name,
            description: tier.description,
            price: tier.price,
            interval: tier.interval,
            currency: tier.currency,
            features: tier.features,
            highlight: tier.highlight,
            sort_order: tier.sort_order,
            stripe_price_id: tier.stripe_price_id,
            metadata: tier.metadata
          }))
        );

      if (insertError) throw insertError;

      toast.success('Pricing tiers saved successfully!');
    } catch (error) {
      console.error('Error saving pricing tiers:', error);
      toast.error('Failed to save pricing tiers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Pricing Tiers</h2>
        <button
          onClick={handleAddTier}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Tier
        </button>
      </div>

      <div className="space-y-6">
        {tiers.map((tier, tierIndex) => (
          <div key={tierIndex} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => handleUpdateTier(tierIndex, 'name', e.target.value)}
                  className="block w-full text-lg font-medium text-gray-900 border-0 focus:ring-0 p-0"
                  placeholder="Tier Name"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tier.highlight}
                    onChange={(e) => handleUpdateTier(tierIndex, 'highlight', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Highlight</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMoveTier(tierIndex, 'up')}
                    disabled={tierIndex === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveTier(tierIndex, 'down')}
                    disabled={tierIndex === tiers.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleRemoveTier(tierIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{tier.currency.toUpperCase()}</span>
                  </div>
                  <input
                    type="number"
                    value={tier.price}
                    onChange={(e) => handleUpdateTier(tierIndex, 'price', parseFloat(e.target.value))}
                    className="block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interval</label>
                <select
                  value={tier.interval}
                  onChange={(e) => handleUpdateTier(tierIndex, 'interval', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                  <option value="one_time">One-time</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={tier.description}
                onChange={(e) => handleUpdateTier(tierIndex, 'description', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={2}
                placeholder="Describe this tier's target audience and value proposition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Features</label>
              <div className="mt-2 space-y-2">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleUpdateFeature(tierIndex, featureIndex, e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Add a feature"
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
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Add Feature
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stripe Price ID</label>
              <input
                type="text"
                value={tier.stripe_price_id || ''}
                onChange={(e) => handleUpdateTier(tierIndex, 'stripe_price_id', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., price_H5ggYwtDq8fqJ"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
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
            'Save Tiers'
          )}
        </button>
      </div>
    </div>
  );
} 