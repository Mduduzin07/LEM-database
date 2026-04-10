"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function EditGatheringForm({ gathering, onSuccess }: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    eventName: "",
    date: "",
    time: "",
    location: "",
    organiser: "",
    eventStatus: "",
  });

  // PREFILL: split ISO date into date + time
  useEffect(() => {
    if (gathering?.date) {
      const fullDate = new Date(gathering.date);

      const date = fullDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const time = fullDate.toTimeString().slice(0, 5);  // HH:MM

      setForm({
        ...gathering,
        date,
        time,
      });
    }
  }, [gathering]);

  
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const combinedDate = new Date(`${form.date}T${form.time}`);

      const payload = {
        ...form,
        date: combinedDate.toISOString(), 
      };

      const res = await fetch(`/api/gatherings/${gathering._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update");

      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleUpdate}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Event Name */}
      <Input
        value={form.eventName}
        onChange={(e) =>
          setForm({ ...form, eventName: e.target.value })
        }
        placeholder="Event Name"
      />

      {/* Date */}
      <Input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      {/* Time */}
      <Input
        required
        type="time"
        value={form.time}
        onChange={(e) =>
          setForm({ ...form, time: e.target.value })
        }
        className="text-gray-500 h-9 text-sm lg:h-8 lg:text-xs"
      />

      {/* Location */}
      <Input
        value={form.location}
        onChange={(e) =>
          setForm({ ...form, location: e.target.value })
        }
        placeholder="Location"
      />

      {/* Organiser */}
      <select
        className="w-full border rounded-md p-2 text-xs md:text-sm text-slate-600"
        value={form.organiser}
        onChange={(e) =>
          setForm({ ...form, organiser: e.target.value })
        }
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

      {/* Status */}
      <select
        value={form.eventStatus}
        onChange={(e) =>
          setForm({ ...form, eventStatus: e.target.value })
        }
        className={`w-full px-3 py-2 rounded border
          ${
            form.eventStatus === "Scheduled"
              ? "bg-green-50 text-green-700"
              : form.eventStatus === "Cancelled"
              ? "bg-red-50 text-red-700"
              : form.eventStatus === "Postponed"
              ? "bg-yellow-50 text-yellow-700"
              : form.eventStatus === "Rescheduled"
              ? "bg-blue-50 text-blue-700"
              : form.eventStatus === "Completed"
              ? "bg-gray-200 text-gray-700"
              : "bg-gray-100 text-gray-700"
          }`}
      >
        <option value="Scheduled">Scheduled</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Postponed">Postponed</option>
        <option value="Rescheduled">Rescheduled</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-blue-600"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Gathering"}
      </Button>
    </motion.form>
  );
}