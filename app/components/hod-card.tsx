"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Check, Mail, Phone, Calendar, Briefcase, UserCheck } from "lucide-react";
import { HOD } from "@/app/hooks/useHOD";
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

interface HODCardProps {
  hod: HOD;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function HODCard({ hod, onUpdate, onDelete }: HODCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: hod.name,
    email: hod.email || "",
    phone: hod.phone,
    department: hod.department,
    isActive: hod.isActive,
    bio: hod.bio || "",
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      
      const updateData = {
        name: editForm.name,
        ...(editForm.email && { email: editForm.email }),
        phone: editForm.phone,
        department: editForm.department,
        isActive: editForm.isActive,
        bio: editForm.bio,
      };
      await onUpdate(hod._id, updateData);
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
      await onDelete(hod._id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Worship: 'bg-purple-100 text-purple-700',
      Ushering: 'bg-blue-100 text-blue-700',
      Youth: 'bg-green-100 text-green-700',
      Men: 'bg-green-200 text-green-800',
      Women: 'bg-pink-200 text-pink-800',
      Children: 'bg-pink-100 text-pink-700',
      Evangelism: 'bg-orange-100 text-orange-700',
      Prayer: 'bg-indigo-100 text-indigo-700',
      Finance: 'bg-emerald-100 text-emerald-700',
      Media: 'bg-red-100 text-red-700',
      Technical: 'bg-gray-100 text-gray-700',
      Maintenance: 'bg-slate-100 text-slate-700',
      Hospitality: 'bg-amber-100 text-amber-700',
      Transport: 'bg-cyan-100 text-cyan-700',
      Education: 'bg-teal-100 text-teal-700',
      Health: 'bg-rose-100 text-rose-700',
      Outreach: 'bg-lime-100 text-lime-700',
    };
    return colors[department] || 'bg-gray-100 text-gray-700';
  };

  if (isEditing) {
    return (
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Edit HOD</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Name *"
            required
          />
          <input
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Email (Optional)"
          />
          <input
            type="tel"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Phone *"
            required
          />
          <select
            value={editForm.department}
            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Worship">Worship</option>
            <option value="Ushering">Ushering</option>
            <option value="Youth">Youth</option>
            <option value="Children">Children</option>
            <option value="Men">Men's Ministry</option>
            <option value="Women">Women's Ministry</option>
            <option value="Evangelism">Evangelism</option>
            <option value="Prayer">Prayer</option>
            <option value="Finance">Finance</option>
            <option value="Media">Media</option>
            <option value="Technical">Technical</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Transport">Transport</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Outreach">Outreach</option>
          </select>
          <textarea
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Bio (Optional)"
            rows={2}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editForm.isActive}
              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Active</span>
          </label>
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

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck size={20} className="text-blue-600" />
                <h3 className="font-semibold text-lg text-gray-900">{hod.name}</h3>
              </div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${getDepartmentColor(hod.department)}`}>
                {hod.department}
              </span>
              {hod.isActive ? (
                <span className="inline-block ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  Active
                </span>
              ) : (
                <span className="inline-block ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                  Inactive
                </span>
              )}
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
            {hod.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>{hod.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>{hod.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Started: {new Date(hod.startDate).toLocaleDateString()}</span>
            </div>
            {hod.bio && (
              <div className="flex items-start gap-2">
                <Briefcase size={14} className="mt-0.5" />
                <span className="text-gray-500">{hod.bio}</span>
              </div>
            )}
            {hod.responsibilities && hod.responsibilities.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-500 mb-1">Responsibilities:</p>
                <ul className="list-disc list-inside text-xs text-gray-600">
                  {hod.responsibilities.slice(0, 2).map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                  {hod.responsibilities.length > 2 && (
                    <li>+{hod.responsibilities.length - 2} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold">{hod.name}</span> from{" "}
              <span className="font-semibold">{hod.department}</span> department.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}