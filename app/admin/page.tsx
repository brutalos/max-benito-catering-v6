import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Admin Dashboard</h1>
            <p className="text-zinc-600">Manage orders and dispatch Wolt deliveries</p>
          </div>
        </div>
        
        <AdminDashboard />
      </div>
    </div>
  );
}
