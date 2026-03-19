"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"

export default function EditMemberDialog({ member, open, setOpen }: any) {

  const router = useRouter()

  const [form, setForm] = useState({
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    gender:member.gender,
    phone: member.phone,
    address: member.address,
    role: member.role
  })

 const updateMember = async () => {

  const res = await fetch(`/api/members/${member._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  })

  const data = await res.json()

  console.log("UPDATED MEMBER:", data)

  if (!res.ok) {
    toast.error("Update failed")
    return
  }

  setOpen(false)

  router.refresh()

  toast.success("Member updated successfully")
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
         <span>
          <p className="text-xs text-slate-500">First name</p>
           <Input className="mb-1 "
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
          />
         </span>
         <span>
          <p className="text-xs  text-slate-500">Last name</p>
           <Input className="mb-1"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
          />
         </span>
         <span>
          <p className="text-xs text-slate-500">Gender</p>
           <select
            required
            id="gender"
            className="w-full mb-1 text-sm p-1 border rounded-md text-slate-600"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option className="px-4 text-xs" value="">Please select gender</option>
            <option className="px-4 text-xs" value="male">Male</option>
            <option className="px-4 text-xs" value="female">Female</option>
          </select>
         </span>
         <span>
          <p className="text-xs text-slate-500">Email</p>
           <Input className="mb-1"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
         </span>
         <span>
          <p className="text-xs text-slate-500">Phone</p>
           <Input className="mb-1"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
         </span>
         <span>
          <p className="text-xs text-slate-500">Address</p>
           <Input className="mb-1"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
         </span>
         <span>
          <p className="text-xs text-slate-500">Role</p>
           <select
            required
            id="gender"
            className="w-full mb-1 text-sm p-1 border rounded-md text-slate-600"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option className="px-4 text-xs" value="">Please select role</option>
            <option className="px-4 text-xs" value="male">Admin</option>
            <option className="px-4 text-xs" value="male">Member</option>
            <option className="px-4 text-xs" value="leader">Leader</option>
            <option className="px-4 text-xs" value="female">Pastor</option>
          </select>
         </span>


          <Button onClick={updateMember}>
            Update Member
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  )
}