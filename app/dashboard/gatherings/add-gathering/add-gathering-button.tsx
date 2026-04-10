"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default function AddGatheringButton() {
  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        className="text-orange-800 cursor-pointer"
        onClick={() => redirect("/dashboard/gatherings/add-gathering")}
       >
        <PlusIcon
          
        />
      </Button>
    </div>
  );
}
