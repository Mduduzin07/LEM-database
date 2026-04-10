"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { PenIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Gathering = {
  _id: string;
  eventName: string;
  date: string;
  time: string;
  dateTime: string;
  location: string;
  organiser: string;
  eventStatus: string;
};

function ActionsCell({ row, onEdit }: { row: any; onEdit: (gathering: Gathering) => void }) {
  const router = useRouter();
  const gathering = row.original as Gathering;

  const deleteGathering = async () => {
    try {
      const response = await fetch(`/api/gatherings/${gathering._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to delete gathering");
        return;
      }

      toast.success("Gathering deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEdit(gathering)}
        className="cursor-pointer"
      >
        <PenIcon className="h-4 w-4" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this gathering?</AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{gathering.eventName}"? This action cannot be undone.
            </p>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteGathering}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Edit Gathering Dialog Component
function EditGatheringDialog({ 
  gathering, 
  open, 
  onClose, 
  onSave 
}: { 
  gathering: Gathering | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    eventName: gathering?.eventName || "",
    date: gathering?.date || "",
    time: gathering?.time || "",
    location: gathering?.location || "",
    organiser: gathering?.organiser || "",
    eventStatus: gathering?.eventStatus || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (gathering) {
      setFormData({
        eventName: gathering.eventName,
        date: gathering.date,
        time: gathering.time,
        location: gathering.location,
        organiser: gathering.organiser,
        eventStatus: gathering.eventStatus,
      });
    }
  }, [gathering]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/gatherings/${gathering?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to update gathering");
        return;
      }

      toast.success("Gathering updated successfully");
      onSave();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Gathering</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              value={formData.eventName}
              onChange={(event) => setFormData({ ...formData, eventName: event.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(event) => setFormData({ ...formData, time: event.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(event) => setFormData({ ...formData, location: event.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organiser">Organiser</Label>
            <select
              id="organiser"
              className="w-full border rounded-md p-2 text-sm"
              value={formData.organiser}
              onChange={(event) => setFormData({ ...formData, organiser: event.target.value })}
              required
            >
              <option value="">Select organiser</option>
              <option value="Pastoral">Pastoral</option>
              <option value="Men's ministry">Men's ministry</option>
              <option value="Women's ministry">Women's ministry</option>
              <option value="Worship team">Worship team</option>
              <option value="Media team">Media team</option>
              <option value="Sunday school">Sunday school</option>
              <option value="Youth">Youth</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventStatus">Event Status</Label>
            <select
              id="eventStatus"
              className="w-full border rounded-md p-2 text-sm"
              value={formData.eventStatus}
              onChange={(event) => setFormData({ ...formData, eventStatus: event.target.value })}
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function GatheringsTable({ data }: { data: Gathering[] }) {
  const router = useRouter();
  const [editingGathering, setEditingGathering] = useState<Gathering | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (gathering: Gathering) => {
    setEditingGathering(gathering);
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    router.refresh();
  };

  const columns: ColumnDef<Gathering>[] = [
    {
      accessorKey: "eventName",
      header: "Event",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.original.date;
        if (!date) return "No date set";
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => {
        const time = row.original.time;
        if (!time) return "No time set";
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      },
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
        const now = new Date();
        const eventDateTime = new Date(row.original.dateTime);
        let status = row.original.eventStatus;

        if (!isNaN(eventDateTime.getTime()) && eventDateTime < now && status === "scheduled") {
          status = "completed";
        }

        const statusColors: Record<string, string> = {
          scheduled: "bg-green-100 text-green-700",
          cancelled: "bg-red-100 text-red-700",
          postponed: "bg-yellow-100 text-yellow-700",
          rescheduled: "bg-blue-100 text-blue-700",
          completed: "bg-gray-200 text-gray-700",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              statusColors[status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionsCell row={row} onEdit={handleEdit} />,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="rounded-xl border bg-white shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 sticky top-0 z-10">
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

            <tbody className="divide-y">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No gatherings found
          </div>
        )}
      </div>

      <EditGatheringDialog
        gathering={editingGathering}
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingGathering(null);
        }}
        onSave={handleSave}
      />
    </>
  );
}