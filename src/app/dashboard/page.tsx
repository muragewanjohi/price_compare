'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Quick Stats */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-2 text-sm font-medium text-gray-600">Active Pages</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-2 text-sm font-medium text-gray-600">Active Tests</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-2 text-sm font-medium text-gray-600">Total Views</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-2 text-sm font-medium text-gray-600">Conversions</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <button className="p-4 text-left border rounded-lg hover:bg-gray-50">
            <h3 className="mb-1 font-medium">Create Pricing Page</h3>
            <p className="text-sm text-gray-600">Design and launch a new pricing page</p>
          </button>
          
          <button className="p-4 text-left border rounded-lg hover:bg-gray-50">
            <h3 className="mb-1 font-medium">Start A/B Test</h3>
            <p className="text-sm text-gray-600">Create a new pricing test variant</p>
          </button>
          
          <button className="p-4 text-left border rounded-lg hover:bg-gray-50">
            <h3 className="mb-1 font-medium">View Analytics</h3>
            <p className="text-sm text-gray-600">Check your page performance</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 