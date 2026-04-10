"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import AddOffering from "@/app/components/add-offering";
import OfferingStatsEnhanced from "@/app/components/offering-stat";
import OfferingCard from "@/app/components/offering-card";
import FilterBar from "@/app/components/filter-bar";
import { useOfferings } from "@/app/hooks/useOfferings";
import { Loader2, LayoutGrid, List } from "lucide-react";

export default function OfferingsPage() {
  const {
    offerings,
    loading,
    filter,
    setFilter,
    addOffering,
    updateOffering,
    deleteOffering,
    getTotal,
  } = useOfferings();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Fixed Header - Doesn't scroll */}
      <div className="flex-shrink-0 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Offerings Management</h1>
              <p className="text-gray-600 mt-1">Manage all your church offerings and donations</p>
            </div>
            <AddOffering onAdd={addOffering} />
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Stats Section */}
          <div className="mb-6">
            <OfferingStatsEnhanced 
              offerings={offerings} 
              total={getTotal()} 
            />
          </div>
          
          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <FilterBar filter={filter} onFilterChange={setFilter} />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
          
          {/* Offerings List/Grid - Scrollable */}
          {offerings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No offerings found</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Offering" to get started</p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8"
              : "space-y-3 pb-8"
            }>
              {offerings.map((offering) => (
                <OfferingCard
                  key={offering._id}
                  offering={offering}
                  onUpdate={updateOffering}
                  onDelete={deleteOffering}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}