'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  User, 
  Phone, 
  MapPin,
  RefreshCcw,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatchingOrder, setDispatchingOrder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetch('/api/admin/orders');

      if (!ordersRes.ok) throw new Error('Failed to fetch data');

      const ordersData = await ordersRes.json();

      setOrders(ordersData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDispatch = async (orderId: string) => {
    if (!confirm('Dispatch Wolt courier for this order?')) return;
    
    setDispatchingOrder(orderId);
    try {
      const res = await fetch('/api/admin/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Dispatch failed');

      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDispatchingOrder(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCcw className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const stats = [
    { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Dispatched', value: orders.filter(o => o.status === 'DISPATCHED').length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total', value: orders.length, icon: Package, color: 'text-zinc-600', bg: 'bg-zinc-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} p-6 rounded-2xl border border-white/50 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-zinc-900">Recent Orders</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">#{order.id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString()}</div>
                      <div className="text-sm font-semibold text-zinc-900 mt-1">€{order.totalAmount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium text-zinc-900">{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <Phone className="w-3 h-3" />
                        {order.customerPhone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{order.customerStreet}, {order.customerCity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-zinc-100 text-zinc-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.woltTrackingUrl ? (
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-zinc-500 uppercase">Wolt Tracking</div>
                          <a 
                            href={order.woltTrackingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium underline underline-offset-2"
                          >
                            Track Order
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {order.deliveryStatus && (
                            <div className="text-[10px] text-zinc-400 font-medium uppercase">{order.deliveryStatus}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-400 italic">No tracking info</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === 'PENDING' ? (
                        <button 
                          onClick={() => handleDispatch(order.id)}
                          disabled={dispatchingOrder === order.id}
                          className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2 ml-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {dispatchingOrder === order.id ? (
                            <RefreshCcw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Truck className="w-4 h-4" />
                          )}
                          Dispatch
                        </button>
                      ) : order.status === 'DISPATCHED' ? (
                        <span className="text-blue-600 font-medium text-sm flex items-center justify-end gap-1">
                          <Truck className="w-4 h-4" />
                          In Transit
                        </span>
                      ) : (
                        <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
