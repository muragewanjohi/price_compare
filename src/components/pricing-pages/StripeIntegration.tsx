'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  prices: {
    id: string;
    unit_amount: number;
    currency: string;
    recurring: {
      interval: string;
    };
  }[];
}

interface PricingTier {
  id: string;
  name: string;
  price: number;
  billing_period: 'monthly' | 'yearly';
  stripe_product_id?: string;
  stripe_price_id?: string;
}

interface StripeIntegrationProps {
  pageId: string;
  stripeConnectionId?: string;
}

export default function StripeIntegration({ pageId, stripeConnectionId }: StripeIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [stripeProducts, setStripeProducts] = useState<StripeProduct[]>([]);
  const [isConnected, setIsConnected] = useState(!!stripeConnectionId);

  useEffect(() => {
    fetchPricingTiers();
    if (isConnected) {
      fetchStripeProducts();
    }
  }, [pageId, isConnected]);

  const fetchPricingTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('page_id', pageId);

      if (error) throw error;
      setPricingTiers(data || []);
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
    }
  };

  const fetchStripeProducts = async () => {
    try {
      const response = await fetch('/api/stripe/products');
      const data = await response.json();
      setStripeProducts(data.products);
    } catch (error) {
      console.error('Error fetching Stripe products:', error);
    }
  };

  const handleConnectStripe = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkProduct = async (tierId: string, productId: string, priceId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('pricing_tiers')
        .update({
          stripe_product_id: productId,
          stripe_price_id: priceId,
        })
        .eq('id', tierId);

      if (error) throw error;

      setPricingTiers(
        pricingTiers.map((tier) =>
          tier.id === tierId
            ? { ...tier, stripe_product_id: productId, stripe_price_id: priceId }
            : tier
        )
      );
    } catch (error) {
      console.error('Error linking Stripe product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Connect Your Stripe Account</h3>
        <p className="mt-2 text-sm text-gray-500">
          Link your Stripe account to enable payments for your pricing tiers
        </p>
        <div className="mt-6">
          <button
            onClick={handleConnectStripe}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Connecting...' : 'Connect with Stripe'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Stripe Integration</h2>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-500">Connected to Stripe</span>
        </div>
      </div>

      <div className="space-y-6">
        {pricingTiers.map((tier) => (
          <div
            key={tier.id}
            className="border rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{tier.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  ${tier.price} / {tier.billing_period}
                </p>
              </div>
              {tier.stripe_product_id ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Connected
                </span>
              )}
            </div>

            {!tier.stripe_product_id && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Stripe Product
                </label>
                <select
                  onChange={(e) => {
                    const [productId, priceId] = e.target.value.split(':');
                    handleLinkProduct(tier.id, productId, priceId);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={isLoading}
                >
                  <option value="">Select a product...</option>
                  {stripeProducts.map((product) =>
                    product.prices.map((price) => (
                      <option
                        key={`${product.id}:${price.id}`}
                        value={`${product.id}:${price.id}`}
                      >
                        {product.name} - ${price.unit_amount / 100} /{' '}
                        {price.recurring.interval}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 