"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  // Fetch the member
  useEffect(() => {
    const fetchMember = async () => {
      const res = await fetch(`/api/members/${id}`);
      const data = await res.json();

      setForm(data);
    };

    fetchMember();
  }, [id]);

  // Update member
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/members");
    router.refresh();
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Member</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          placeholder="First Name"
        />

        <Input
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          placeholder="Last Name"
        />

        <Input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />

        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone"
        />

        <Textarea
          id="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
        />

        <Button type="submit">Update Member</Button>
      </form>
    </div>
  );
}
