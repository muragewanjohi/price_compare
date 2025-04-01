'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

interface ABTest {
  id?: string;
  name: string;
  goal: string;
  traffic_split: number;
  variants: {
    name: string;
    description: string;
    changes: {
      type: 'price' | 'layout' | 'features' | 'cta';
      value: any;
    }[];
  }[];
}

interface ABTestingProps {
  pageId: string;
  currentTest?: ABTest;
}

export default function ABTesting({ pageId, currentTest }: ABTestingProps) {
  const [test, setTest] = useState<ABTest>(
    currentTest || {
      name: '',
      goal: '',
      traffic_split: 50,
      variants: [
        {
          name: 'Control',
          description: 'Original version',
          changes: [],
        },
        {
          name: 'Variant A',
          description: 'Modified version',
          changes: [],
        },
      ],
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTest = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('ab_tests')
        .upsert({
          ...test,
          page_id: pageId,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving A/B test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChange = (variantIndex: number) => {
    const updatedTest = { ...test };
    updatedTest.variants[variantIndex].changes.push({
      type: 'price',
      value: null,
    });
    setTest(updatedTest);
  };

  const handleUpdateChange = (
    variantIndex: number,
    changeIndex: number,
    type: 'price' | 'layout' | 'features' | 'cta',
    value: any
  ) => {
    const updatedTest = { ...test };
    updatedTest.variants[variantIndex].changes[changeIndex] = {
      type,
      value,
    };
    setTest(updatedTest);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">A/B Testing</h2>
        <button
          onClick={handleSaveTest}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Test'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Test Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test Name
            </label>
            <input
              type="text"
              value={test.name}
              onChange={(e) => setTest({ ...test, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Price Anchoring Test"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test Goal
            </label>
            <input
              type="text"
              value={test.goal}
              onChange={(e) => setTest({ ...test, goal: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Increase Pro plan conversions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Traffic Split (%)
            </label>
            <input
              type="number"
              value={test.traffic_split}
              onChange={(e) =>
                setTest({ ...test, traffic_split: Number(e.target.value) })
              }
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-6">
          {test.variants.map((variant, variantIndex) => (
            <div
              key={variantIndex}
              className="border rounded-lg p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Variant Name
                    </label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => {
                        const updatedTest = { ...test };
                        updatedTest.variants[variantIndex].name = e.target.value;
                        setTest(updatedTest);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={variant.description}
                      onChange={(e) => {
                        const updatedTest = { ...test };
                        updatedTest.variants[variantIndex].description =
                          e.target.value;
                        setTest(updatedTest);
                      }}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  {/* Changes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Changes
                    </label>
                    <div className="mt-2 space-y-2">
                      {variant.changes.map((change, changeIndex) => (
                        <div
                          key={changeIndex}
                          className="flex items-center space-x-2"
                        >
                          <select
                            value={change.type}
                            onChange={(e) =>
                              handleUpdateChange(
                                variantIndex,
                                changeIndex,
                                e.target.value as any,
                                change.value
                              )
                            }
                            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="price">Price</option>
                            <option value="layout">Layout</option>
                            <option value="features">Features</option>
                            <option value="cta">CTA</option>
                          </select>
                          <input
                            type="text"
                            value={change.value || ''}
                            onChange={(e) =>
                              handleUpdateChange(
                                variantIndex,
                                changeIndex,
                                change.type,
                                e.target.value
                              )
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Change value"
                          />
                          <button
                            onClick={() => {
                              const updatedTest = { ...test };
                              updatedTest.variants[variantIndex].changes =
                                updatedTest.variants[
                                  variantIndex
                                ].changes.filter((_, i) => i !== changeIndex);
                              setTest(updatedTest);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddChange(variantIndex)}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        + Add Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 