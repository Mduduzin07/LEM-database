"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ArrowLeftIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { SpinningText } from "@/components/ui/spinning-text";
import { useRouter } from "next/navigation";

interface MemberDetails {
  firstName: string;
  lastName: string;
  gender: string;
  email?: string;
  address: string;
  phone: string;
  role: string;
}

export default function AddMemberForm() {
  const router = useRouter();

  const [form, setForm] = useState<MemberDetails>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  const submit = async () => {
    const { firstName, lastName, phone, address, role, email } = form;

    // Validate required details first
    if (!firstName || !lastName || !phone || !address || !role) {
      return toast.error("Required fields are missing");
    }

    if (phone.length !== 10) {
      return toast.error("Phone must be 10 digits");
    } else if (firstName.length < 3 || lastName.length < 3) {
      toast.error("Names must be at least 3 characters");
    }

    // Email validation
    if (email && !email.includes("@")) {
      return toast.error("Please enter a valid email address");
    }

    try {
      const res = await fetch("/api/members", {
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

      toast.success("Member added successfully");

      // After the member has been added, clear form
      setForm({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        phone: "",
        address: "",
        role: "",
      });

      // refresh dashboard
      router.refresh();

      // redirect back
      router.push("/dashboard/members");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full mx-2 my-10 sm:w-2/5">
        <CardTitle>
          <a href="/dashboard/members">
            <span className="w-40 ml-5 rounded-md flex items-center hover:bg-black hover:text-white">
              <ArrowLeftIcon className="px-1" />
              Back to members
            </span>
          </a>
        </CardTitle>

        <CardContent>
          <Input
            required
            id="firstName"
            className="my-3"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          <Input
            required
            id="lastName"
            className="my-3"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <select
            required
            id="gender"
            className="my-3 w-full border rounded-md p-2 text-slate-600"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Please select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <Input
            id="email"
            className="my-3"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Input
            required
            className="my-3"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Textarea
            required
            id="address"
            className="my-3 min-h-25"
            placeholder="Enter the address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <select
            required
            id="role"
            className="text-slate-600 my-3 w-full border rounded-md p-2"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="">Please select Role</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="pastor">Pastor</option>
          </select>

          <RainbowButton onClick={submit}>Add Member</RainbowButton>
        </CardContent>
      </Card>

      <SpinningText
        radius={6}
        className="hidden w-1/3 text-2xl text-black animate-[spin_40s_linear_infinite] 
        drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
      >
        Liberation • and • Empowerment • Ministries •
      </SpinningText>
    </div>
  );
}
