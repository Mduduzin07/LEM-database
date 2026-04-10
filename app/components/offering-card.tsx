"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Check, Calendar, User, FileText } from "lucide-react";
import { Offering } from "@/app/hooks/useOfferings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OfferingCardProps {
  offering: Offering;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  viewMode?: "grid" | "list";
}

export default function OfferingCard({ offering, onUpdate, onDelete, viewMode = "grid" }: OfferingCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    amount: offering.amount,
    type: offering.type,
    memberName: offering.memberName || '',
    note: offering.note || '',
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdate(offering._id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await onDelete(offering._id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      tithe: 'bg-purple-100 text-purple-700',
      offering: 'bg-pink-100 text-pink-700',
      seed: 'bg-green-100 text-green-700',
      pledge: 'bg-orange-100 text-orange-700',
      thanksgiving: 'bg-teal-100 text-teal-700',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (isEditing) {
    return (
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Edit Offering</h3>
        <div className="space-y-3">
          <input
            type="number"
            value={editForm.amount}
            onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
          />
          <select
            value={editForm.type}
            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="tithe">Tithe</option>
            <option value="offering">Offering</option>
            <option value="seed">Seed</option>
            <option value="pledge">Pledge</option>
            <option value="thanksgiving">Thanksgiving</option>
          </select>
          <input
            type="text"
            value={editForm.memberName}
            onChange={(e) => setEditForm({ ...editForm, memberName: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Member name"
          />
          <textarea
            value={editForm.note}
            onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Note"
            rows={2}
          />
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Check size={16} />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view mode
  if (viewMode === "list") {
    return (
      <>
        <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="font-bold text-gray-900">R {offering.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${getTypeColor(offering.type)} capitalize`}>
                  {offering.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm text-gray-700">{new Date(offering.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Member</p>
                <p className="text-sm text-gray-700">{offering.memberName || "Anonymous"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the offering of{" "}
                <span className="font-semibold">R {offering.amount.toLocaleString()}</span>
                {offering.memberName && (
                  <> from <span className="font-semibold">{offering.memberName}</span></>
                )}.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Grid view mode (default)
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                R {offering.amount.toLocaleString()}
              </p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${getTypeColor(offering.type)} capitalize`}>
                {offering.type}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 border-t pt-3 mt-2">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{new Date(offering.date).toLocaleString()}</span>
            </div>
            {offering.memberName && (
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{offering.memberName}</span>
              </div>
            )}
            {offering.note && (
              <div className="flex items-start gap-2">
                <FileText size={14} className="mt-0.5" />
                <span className="text-gray-500">{offering.note}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the offering of{" "}
              <span className="font-semibold">R {offering.amount.toLocaleString()}</span>
              {offering.memberName && (
                <> from <span className="font-semibold">{offering.memberName}</span></>
              )}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}