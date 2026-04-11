"use client";

import { Filter, X } from "lucide-react";

interface HODFilterProps {
  filter: { department: string; isActive: string };
  onFilterChange: (filter: any) => void;
  departments: string[];
}

export default function HODFilter({ filter, onFilterChange, departments }: HODFilterProps) {
  const handleReset = () => {
    onFilterChange({ department: 'all', isActive: 'all' });
  };

  const hasActiveFilters = filter.department !== 'all' || filter.isActive !== 'all';

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-gray-500" />
        <h3 className="font-semibold text-gray-900">Filter HODs</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="ml-auto text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={filter.department}
            onChange={(e) => onFilterChange({ ...filter, department: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filter.isActive}
            onChange={(e) => onFilterChange({ ...filter, isActive: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}