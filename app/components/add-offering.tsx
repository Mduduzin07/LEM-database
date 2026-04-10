"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

interface AddOfferingProps {
  onAdd: (data: any) => Promise<void>;
}

export default function AddOffering({ onAdd }: AddOfferingProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    type: "offering",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    memberName: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    // Validate amount
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const offeringData = {
        amount: Number(form.amount),
        type: form.type,
        date: `${form.date}T${form.time}`,
        memberName: form.memberName,
        note: form.note,
      };

      // Wait for the onAdd function to complete
      await onAdd(offeringData);

      // Only close and reset if successful
      setOpen(false);
      setForm({
        amount: "",
        type: "offering",
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        memberName: "",
        note: "",
      });
      
    } catch (err) {
      console.error("Error in form submission:", err);
      // Error is already handled in the hook with toast
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
        + Add Offering
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
                <h2 className="text-xl font-bold">Add Offering</h2>
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
                    Amount (R)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    required
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offering Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tithe">Tithe</option>
                    <option value="offering">Offering</option>
                    <option value="seed">Seed</option>
                    <option value="pledge">Pledge</option>
                    <option value="thanksgiving">Thanksgiving</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Name (Optional)
                  </label>
                  <input
                    placeholder="Enter member name"
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    value={form.memberName}
                    onChange={(e) => setForm({ ...form, memberName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (Optional)
                  </label>
                  <textarea
                    placeholder="Add a note..."
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 resize-none"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Offering"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}