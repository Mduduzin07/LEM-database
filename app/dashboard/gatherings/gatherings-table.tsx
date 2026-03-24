"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Gathering = {
  _id: string;
  eventName: string;
  date: string;
  location: string;
  organiser: string;
  eventStatus: string;
};

export default function GatheringsTable({ data }: { data: Gathering[] }) {
  const columns: ColumnDef<Gathering>[] = [
    {
      accessorKey: "eventName",
      header: "Event",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "organiser",
      header: "Organiser",
    },
    {
      accessorKey: "eventStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.eventStatus;

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold
              ${
                status === "scheduled"
                  ? "bg-green-100 text-green-700"
                  : status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : status === "postponed"
                  ? "bg-yellow-100 text-yellow-700"
                  : status === "rescheduled"
                  ? "bg-pink-300 text-black"
                  : "bg-amber-700 text-white"
              }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl border bg-white shadow overflow-hidden">
      <table className="w-full text-sm">
        
        {/* HEADER */}
        <thead className="bg-slate-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left p-3">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* BODY */}
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t hover:bg-slate-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-3">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          No gatherings found
        </div>
      )}
    </div>
  );
}