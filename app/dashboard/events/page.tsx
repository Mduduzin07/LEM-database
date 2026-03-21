"use client";

import { Button } from "@/components/ui/button";

export default function Events() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-4">
        
        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Create Event
        </h1>

        {/* FORM */}
        <form className="space-y-3">
          
          <input
            type="text"
            placeholder="Event name"
            className="w-full border rounded-md p-2 text-sm md:text-base"
          />

          <input
            type="date"
            className="w-full border rounded-md p-2 text-sm md:text-base"
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full border rounded-md p-2 text-sm md:text-base"
          />

          <select
            className="w-full border rounded-md p-2 text-sm md:text-base text-slate-600"
          >
            <option value="">Select organiser</option>
            <option value="pastoral">Pastoral</option>
            <option value="men">Men's ministry</option>
            <option value="women">Women's ministry</option>
            <option value="worship">Worship team</option>
            <option value="media">Media team</option>
            <option value="school">Sunday school</option>
            <option value="youth">Youth</option>
          </select>

          <select
            className="w-full border rounded-md p-2 text-sm md:text-base text-slate-600"
          >
            <option value="">Select event status</option>
            <option value="scheduled">Event scheduled</option>
            <option value="cancelled">Event cancelled</option>
            <option value="postponed">Event postponed</option>
            <option value="rescheduled">Event rescheduled</option>
          </select>

          {/* BUTTON */}
          <Button className="w-full mt-2">
            Save Event
          </Button>
        </form>
      </div>
    </div>
  );
}