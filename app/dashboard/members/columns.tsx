"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditMemberDialog from "@/app/components/edit-member-dialog";
import { toast } from "react-toastify";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PenIcon, Trash2Icon } from "lucide-react";

export type Member = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

function ActionsCell({ row }: any) {
  const router = useRouter();
  const member = row.original;
  const [open, setOpen] = useState(false);

  const deleteMember = async () => {
    await fetch(`/api/members/${member._id}`, {
      method: "DELETE",
    });

    router.refresh();
    toast.success("Member deleted successfully");
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        <PenIcon/>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive"><Trash2Icon/></Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this member?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={deleteMember}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditMemberDialog member={member} open={open} setOpen={setOpen} />
    </div>
  );
}

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },

  {
    accessorKey: "lastName",
    header: "Last Name",
  },

  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },

  {
    accessorKey: "address",
    header: "Address",
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;

      if (role === "admin") {
        return <Badge className="bg-red-500 text-white">Admin</Badge>;
      }

      if (role === "pastor") {
        return <Badge className="bg-amber-500 text-black">Pastor</Badge>;
      }

      return <Badge variant="secondary">Member</Badge>;
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
