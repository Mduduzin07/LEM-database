"use client";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default function AddGatheringButton() {
  return (
    <div>
      <PlusIcon onClick={()=>redirect("/dashboard/gatherings/add-gathering")} className="text-orange-800 cursor-pointer size-5 ml-2 mt-1 " />
    </div>
  );
}
