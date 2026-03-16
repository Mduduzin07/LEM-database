"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"

export default function EditMemberForm({ member }: any) {

  const router = useRouter()

  const [form, setForm] = useState(member)

  const updateMember = async () => {

    const res = await fetch(`/api/members/${member._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      toast.success("Member updated")

      router.refresh() // updates dashboard stats
      router.push("/dashboard/members")
    }
  }

  return (
    <div className="max-w-xl space-y-4">

      <Input
        value={form.firstName}
        onChange={(e) =>
          setForm({ ...form, firstName: e.target.value })
        }
      />

      <Input
        value={form.lastName}
        onChange={(e) =>
          setForm({ ...form, lastName: e.target.value })
        }
      />

      <Input
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <Textarea
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />

        <Input
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        />
      <Button onClick={updateMember}>
        Update Member
      </Button>

    </div>
  )
}