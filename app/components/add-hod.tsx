"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface AddHODProps {
  onAdd: (data: any) => Promise<void>;
}

const departments = [
  "Worship",
  "Ushering",
  "Youth",
  "Children",
  "Evangelism",
  "Prayer",
  "Finance",
  "Media",
  "Technical",
  "Maintenance",
  "Hospitality",
  "Transport",
  "Education",
  "Health",
  "Outreach",
];

export default function AddHOD({ onAdd }: AddHODProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    startDate: new Date().toISOString().split("T")[0],
    bio: "",
    responsibilities: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!form.name || !form.phone || !form.department || !form.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const responsibilitiesList = form.responsibilities
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r);

      await onAdd({
        name: form.name,
        email: form.email,
        phone: form.phone,
        department: form.department,
        startDate: form.startDate,
        bio: form.bio,
        responsibilities: responsibilitiesList,
        isActive: true,
      });

      setOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        department: "",
        startDate: new Date().toISOString().split("T")[0],
        bio: "",
        responsibilities: "",
      });
    } catch (err) {
      console.error("Error adding HOD:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        + Add HOD
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 p-6 shadow-xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Head of Department</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    required
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsibilities (comma-separated)
                  </label>
                  <textarea
                    placeholder="e.g., Oversee worship team, Plan services, Train musicians"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    value={form.responsibilities}
                    onChange={(e) =>
                      setForm({ ...form, responsibilities: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio (Optional)
                  </label>
                  <textarea
                    placeholder="Brief description about the HOD"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Head of Department"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
