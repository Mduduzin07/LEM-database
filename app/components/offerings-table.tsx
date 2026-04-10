"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";

interface Offering {
  _id: string;
  amount: number;
  type: string;
  date: string;
  memberName: string;
  note: string;
}

interface OfferingsTableProps {
  data: Offering[];
  onEdit: (offering: Offering) => void;
  onDelete: (id: string) => void;
}

export default function OfferingsTable({ data, onEdit, onDelete }: OfferingsTableProps) {
  const [sortField, setSortField] = useState<keyof Offering>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (field: keyof Offering) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = data.filter(offering =>
    offering.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offering.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offering.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === "amount") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by member, type, or note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-md border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-600">{sortedData.length} transactions</p>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-1">
                  Date
                  {sortField === "date" && (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort("amount")}>
                <div className="flex items-center gap-1">
                  Amount
                  {sortField === "amount" && (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort("type")}>
                <div className="flex items-center gap-1">
                  Type
                  {sortField === "type" && (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((offering) => (
              <tr key={offering._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(offering.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatCurrency(offering.amount)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                    offering.type === 'tithe' ? 'bg-purple-100 text-purple-700' :
                    offering.type === 'offering' ? 'bg-pink-100 text-pink-700' :
                    offering.type === 'seed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {offering.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {offering.memberName || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {offering.note || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(offering)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(offering._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-3">
        {sortedData.map((offering) => (
          <div key={offering._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-lg font-bold">{formatCurrency(offering.amount)}</p>
                <span className={`px-2 py-1 text-xs rounded-full capitalize inline-block mt-1 ${
                  offering.type === 'tithe' ? 'bg-purple-100 text-purple-700' :
                  offering.type === 'offering' ? 'bg-pink-100 text-pink-700' :
                  offering.type === 'seed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {offering.type}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(offering)} className="text-blue-600">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDelete(offering._id)} className="text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1 mt-2">
              <p>📅 {new Date(offering.date).toLocaleString()}</p>
              {offering.memberName && <p>👤 {offering.memberName}</p>}
              {offering.note && <p>📝 {offering.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}