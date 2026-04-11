"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import AddHOD from "@/app/components/add-hod";
import HODCard from "@/app/components/hod-card";
import HODFilter from "@/app/components/hod-filter";
import HODStats from "@/app/components/hod-stats";
import { useHOD } from "@/app/hooks/useHOD";
import { Loader2 } from "lucide-react";

export default function HODPage() {
  const {
    hods,
    loading,
    filter,
    setFilter,
    addHOD,
    updateHOD,
    deleteHOD,
    getDepartments,
    getActiveCount,
    getInactiveCount,
  } = useHOD();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Heads of Departments</h1>
            <p className="text-gray-600 mt-1">Manage all department leaders and their responsibilities</p>
          </div>
          <AddHOD onAdd={addHOD} />
        </div>

        <HODStats 
          hods={hods}
          activeCount={getActiveCount()}
          inactiveCount={getInactiveCount()}
          departments={getDepartments()}
        />

        <HODFilter 
          filter={filter}
          onFilterChange={setFilter}
          departments={getDepartments()}
        />

        {hods.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-6">
            <p className="text-gray-500">No department heads found</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add HOD" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {hods.map((hod) => (
              <HODCard
                key={hod._id}
                hod={hod}
                onUpdate={updateHOD}
                onDelete={deleteHOD}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}