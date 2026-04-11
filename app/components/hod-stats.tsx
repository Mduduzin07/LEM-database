"use client";

import { Users, UserCheck, UserX, Briefcase } from "lucide-react";
import { HOD } from "@/app/hooks/useHOD";

interface HODStatsProps {
  hods: HOD[];
  activeCount: number;
  inactiveCount: number;
  departments: string[];
}

export default function HODStats({ hods, activeCount, inactiveCount, departments }: HODStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total HODs</p>
            <p className="text-2xl font-bold text-gray-900">{hods.length}</p>
          </div>
          <Users className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active HODs</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
          <UserCheck className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Inactive HODs</p>
            <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
          </div>
          <UserX className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Departments</p>
            <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
          </div>
          <Briefcase className="h-8 w-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
}