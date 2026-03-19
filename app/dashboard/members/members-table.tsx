"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddMemberButton from "./add-member-btn";

import { columns, Member } from "./columns";

interface Props {
  data: Member[];
}

export function MembersTable({ data }: Props) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all"); // "all", "admin", "member", "pastor"

  // Get unique roles from data
  const uniqueRoles = ["all", ...new Set(data.map((member) => member.role))];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    
    // Global filter state
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    
    // Column filters
    globalFilterFn: "includesString", // or "includesString" for case-insensitive
    
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Apply role filter manually
  const filteredData = roleFilter === "all" 
    ? table.getRowModel().rows 
    : table.getRowModel().rows.filter(row => row.original.role === roleFilter);

  return (
    <>
      {/* FILTERS SECTION */}
      <div className="flex mx-5 px-2 mb-1 sm:flex-row">
         <div className="flex mr-2 items-center">
        <p className="font-bold text-xl text-violet-600 mr-3">Members</p>
        <AddMemberButton/>
      </div>
        {/* Search Input */}
        <div className="hidden md:flex sm:flex-1  sm:mr-2">
          <Input
            placeholder="Search members by name, email, phone..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full "
          />
        </div>

        {/* Role Filter Dropdown */}
        <div className="hidden md:flex w-full sm:w-48">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {uniqueRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button (optional) */}
        {(globalFilter || roleFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              setGlobalFilter("");
              setRoleFilter("all");
            }}
            className="whitespace-nowrap"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-y-auto max-h-120 relative mx-5">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-slate-300 z-10 shadow-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-3 whitespace-nowrap">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-8 text-gray-500"
                >
                  No members found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between my-2 mx-5">
        {/* Showing text */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} members
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}