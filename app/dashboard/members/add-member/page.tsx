"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ArrowLeftIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { redirect, useRouter } from "next/navigation";
import { MorphingText } from "@/components/ui/morphing-text";
import { Button } from "@/components/ui/button";
import { Luckiest_Guy } from "next/font/google";

interface MemberDetails {
  firstName: string;
  lastName: string;
  gender: string;
  email?: string;
  address: string;
  phone: string;
  role: string;
}

const luckiest = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
});

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

    if (!firstName || !lastName || !phone || !address || !role) {
      return toast.error("Required fields are missing");
    }

    if (phone.length !== 10) {
      return toast.error("Phone must be 10 digits");
    } else if (firstName.length < 3 || lastName.length < 3) {
      toast.error("Names must be at least 3 characters");
    }

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

      setForm({
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        phone: "",
        address: "",
        role: "",
      });

      router.refresh();
      router.push("/dashboard/members");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-linear-to-br from-slate-400 to-slate-100 px-4">
      
      <Card className="relative w-full max-w-sm mt-40 sm:mt-3 md:max-w-sm md:max-h-200 lg:max-w-sm max-h-135 shadow-xl border-0 bg-white/95">
        <CardTitle className="">
          <div>
            <MorphingText
          texts={["Liberation", "&", "Empowerment", "Ministries"]}
          className={`${luckiest.className} text-3xl lg:text-3xl xl:text-3xl font-bold text-center`}
        />
        </div>
          <div className="absolute top-17 left-5  sm:top-24 sm:left-4  text-slate-600">
            <Button onClick={()=>redirect('/dashboard/members')} variant="outline" className="flex items-center cursor-pointer ">
              <ArrowLeftIcon className="size-5"/>
              back to members
            </Button>
          </div>
    
        </CardTitle>

        <CardContent className="px-4 flex-1">
          <div className="space-y-2">
            <Input
              required
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="h-9 text-sm lg:h-8 lg:text-xs"
            />

            <Input
              required
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="h-9 text-sm lg:h-8 lg:text-xs"
            />

            <select
              className="w-full border rounded-md p-1.5 text-slate-600 bg-white h-9 text-sm"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <Input
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-9 text-sm lg:h-8 lg:text-xs"
            />

            <Input
              required
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              className="h-9 text-sm lg:h-8 lg:text-xs"
            />

            <Textarea
              required
              rows={3}
              className="max-h-16 lg:max-h-12 text-sm lg:text-xs"
              placeholder="Enter the address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <select
              className="w-full border rounded-md p-1.5 text-slate-600 bg-white h-9 text-sm"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="leader">Leader</option>
              <option value="pastor">Pastor</option>
            </select>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-1">
          <RainbowButton onClick={submit} className="w-full text-sm py-1.5">
            Add Member
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
