"use client";

import { Filter, Calendar, X } from 'lucide-react';

interface FilterBarProps {
  filter: { type: string; startDate: string; endDate: string };
  onFilterChange: (filter: any) => void;
}

export default function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const handleReset = () => {
    onFilterChange({ type: 'all', startDate: '', endDate: '' });
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} className="text-gray-500" />
        <h3 className="font-medium">Filters</h3>
        {(filter.type !== 'all' || filter.startDate || filter.endDate) && (
          <button
            onClick={handleReset}
            className="ml-auto text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          value={filter.type}
          onChange={(e) => onFilterChange({ ...filter, type: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Types</option>
          <option value="tithe">Tithe</option>
          <option value="offering">Offering</option>
          <option value="seed">Seed</option>
          <option value="pledge">Pledge</option>
        </select>
        
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => onFilterChange({ ...filter, startDate: e.target.value })}
            className="flex-1 border p-2 rounded"
            placeholder="Start date"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => onFilterChange({ ...filter, endDate: e.target.value })}
            className="flex-1 border p-2 rounded"
            placeholder="End date"
          />
        </div>
      </div>
    </div>
  );
}