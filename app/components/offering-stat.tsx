"use client";

import { TrendingUp, Wallet, Church, Leaf, Heart, Gift } from 'lucide-react';
import { Offering } from '@/app/hooks/useOfferings';

interface OfferingStatsEnhancedProps {
  offerings: Offering[];
  total: number;
  getTotalByType?: (type: string) => number; // Make it optional
}

const typeConfig = {
  tithe: { icon: Church, color: 'purple', label: 'Tithes' },
  offering: { icon: Heart, color: 'pink', label: 'Offerings' },
  seed: { icon: Leaf, color: 'green', label: 'Seeds' },
  pledge: { icon: Gift, color: 'orange', label: 'Pledges' },
  thanksgiving: { icon: TrendingUp, color: 'teal', label: 'Thanksgiving' },
};

export default function OfferingStatsEnhanced({ offerings, total, getTotalByType }: OfferingStatsEnhancedProps) {
  // Calculate totals by type if getTotalByType is not provided
  const calculateTotalByType = (type: string) => {
    if (getTotalByType) {
      return getTotalByType(type);
    }
    return offerings
      .filter(o => o.type === type)
      .reduce((sum, o) => sum + o.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Main Total Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Total Offerings</p>
            <p className="text-5xl font-bold">{formatCurrency(total)}</p>
            <p className="text-blue-100 mt-2">{offerings.length} transactions recorded</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Wallet size={48} className="text-white" />
          </div>
        </div>
      </div>

      {/* Type Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(typeConfig).map(([type, config]) => {
          const typeTotal = calculateTotalByType(type);
          const percentage = total > 0 ? (typeTotal / total) * 100 : 0;
          const Icon = config.icon;
          const color = config.color;
          
          return (
            <div key={type} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-${color}-100`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <span className="text-xs font-medium text-gray-500">{percentage.toFixed(1)}%</span>
              </div>
              <p className="text-sm text-gray-600 capitalize">{config.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(typeTotal)}</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 bg-${color}-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}