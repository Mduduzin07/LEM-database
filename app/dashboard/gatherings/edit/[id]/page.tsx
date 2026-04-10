"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditGatheringPage() {
  const { id } = useParams();
  const router = useRouter();

   const [form, setForm] = useState({
    eventName: "",
    date: "",
    organiser: "",
    location: "",
    status: "",
    
  });

  // Fetch the gathering
  useEffect(() => {
    const fetchGathering = async () => {
      const res = await fetch(`/api/members/${id}`);
      const data = await res.json();

      setForm(data);
    };

    fetchGathering();
  }, [id]);

  // Update gathering
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`/api/gatherings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/gatherings");
    router.refresh();
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Gathering</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
        value={form.eventName}
        onChange={(e) =>
          setForm({ ...form, eventName: e.target.value })
        }
      />

      <Input
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <Input
        value={form.location}
        onChange={(e) =>
          setForm({ ...form, location: e.target.value })
        }
      />

        <Input
          value={form.organiser}
          onChange={(e) =>
            setForm({ ...form, organiser: e.target.value })
          }
        />
        <Input
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        />

       

        <Button type="submit">Update Gathering</Button>
      </form>
    </div>
  );
}
