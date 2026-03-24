"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MorphingText } from "@/components/ui/morphing-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ArrowLeftIcon } from "lucide-react";
import { Luckiest_Guy } from "next/font/google";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const luckiest = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
});

interface GatheringDetails {
  eventName: string;
  date: string;
  organiser: string;
  eventStatus: string;
  location: string;
}

export default function AddMemberForm() {
  const router = useRouter();

  const [form, setForm] = useState<GatheringDetails>({
    eventName: "",
    date: "",
    organiser: "",
    eventStatus: "",
    location: "",
  });

  
    const submit = async () => {
       const { eventName,date,organiser,eventStatus,location } = form;
   
       if (!eventName||!date||!organiser||!eventStatus||!location) {
         return toast.error("Required fields are missing");
       }
   
       if (eventName.length <5) {
         return toast.error("Event name must be at least 5 characters");
       } else if (location.length < 5) {
         toast.error("Location must be at least 5 characters");
       }
   
      
   
       try {
         const res = await fetch("/api/gatherings", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(form),
         });
   
         if (!res.ok) {
           const data = await res.json();
           toast.error(data.error);
           return;
         }
   
         toast.success("Event added successfully");
   
         setForm({
           eventName: "",
           date: "",
           location: "",
           organiser: "",
           eventStatus: "",
           
         });
   
         router.refresh();
         router.push("/dashboard/gatherings");
       } catch (error) {
         toast.error("Something went wrong");
       }
     };
  

  return (
    <div className="min-h-screen flex flex-col items-center bg-linear-to-br from-slate-400 to-slate-100 px-4">
      <Card className=" relative w-full max-w-sm mt-40 sm:mt-3 md:max-w-sm md:max-h-200 lg:max-w-sm max-h-135 shadow-xl border-0 bg-white/95">
        <CardTitle className="">
          <div>
            <MorphingText
              texts={["Liberation", "&", "Empowerment", "Ministries"]}
              className={`${luckiest.className} text-3xl lg:text-3xl xl:text-3xl font-bold text-center`}
            />
          </div>
          <div className="absolute top-17 left-5 sm:top-24 sm:left-4 text-slate-600">
            <Button
              onClick={() => redirect("/dashboard/gatherings")}
              variant="outline"
              className="flex items-center cursor-pointer"
            >
              <ArrowLeftIcon className="size-5" />
              back to gatherings
            </Button>
          </div>
        </CardTitle>

        <CardContent className="px-4 flex-1">
          <div className="space-y-2">
            <Input
              required
              placeholder="Event name"
              value={form.eventName}
              onChange={(e) => setForm({ ...form, eventName: e.target.value })}
              className=" text-gray-500 h-9 text-sm lg:h-8 lg:text-xs"
            />

            <Input
              required
              type="date"
              placeholder="Event date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="text-gray-500 h-9 text-sm lg:h-8 lg:text-xs"
            />

            <Input
              required
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="text-gray-500 h-9 text-sm lg:h-8 lg:text-xs"
            />

            <select
              className="text-slate-600 w-full border rounded-md p-2 text-xs md:text-sm text-slate-600"
              value={form.organiser}
              onChange={(e) => setForm({ ...form, organiser: e.target.value })}
            >
              <option value="">Select organiser</option>
              <option value="pastoral">Pastoral</option>
              <option value="Men's ministry">Men's ministry</option>
              <option value="Women's ministry">Women's ministry</option>
              <option value="Worship team">Worship team</option>
              <option value="Media team">Media team</option>
              <option value="Sunday school">Sunday school</option>
              <option value="youth">Youth</option>
            </select>

            <select
              className="text-gray-500 w-full border rounded-md p-2 text-sm md:text-sm text-slate-600"
              value={form.eventStatus}
              onChange={(e) => setForm({ ...form, eventStatus: e.target.value })}
            >
              <option value="">Select event status</option>
              <option value="scheduled">Event scheduled</option>
              <option value="cancelled">Event cancelled</option>
              <option value="postponed">Event postponed</option>
              <option value="rescheduled">Event rescheduled</option>
            </select>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-1">
          <RainbowButton onClick={submit} className="w-full text-sm py-1.5">
            Add Event
          </RainbowButton>
        </CardFooter>
      </Card>

      <div className="lg:hidden mt-6 text-center">
        <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          <p className="text-sm font-medium text-amber-700">
            Liberation & Empowerment Ministries
          </p>
        </div>
      </div>
    </div>
  );
}