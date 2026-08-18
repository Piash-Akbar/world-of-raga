// src/app/profile/orders/page.tsx
"use client";

import { ShoppingBag, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    date: "2026-02-15",
    total: 299,
    status: "delivered",
    items: ["Raga Yaman — Bandish"],
  },
  {
    id: "ORD-002",
    date: "2026-02-10",
    total: 1499,
    status: "delivered",
    items: ["Mastering Bow Control"],
  },
  {
    id: "ORD-003",
    date: "2026-02-05",
    total: 850,
    status: "shipped",
    items: ["Premium Rosin"],
  },
  {
    id: "ORD-004",
    date: "2026-01-20",
    total: 399,
    status: "delivered",
    items: ["Raga Bhairav — Gat"],
  },
];

const statusColors = {
  delivered: "text-green-400 bg-green-400/10",
  shipped: "text-blue-400 bg-blue-400/10",
  pending: "text-amber-400 bg-amber-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

const statusIcons = {
  delivered: CheckCircle,
  shipped: Clock,
  pending: Clock,
  cancelled: XCircle,
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Order History</h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
            return (
              <div
                key={order.id}
                className="bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 p-6 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold">{order.id}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusColors[order.status as keyof typeof statusColors]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </div>
                    <p className="text-white/40 text-sm mt-1">
                      {order.items.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">৳{order.total}</p>
                    <p className="text-white/30 text-xs flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}