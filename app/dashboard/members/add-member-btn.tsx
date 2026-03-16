"use client"

import { RainbowButton } from '@/components/ui/rainbow-button'
import { PlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'


export default function AddMemberButton() {
  return (
    <RainbowButton onClick={()=>redirect("/dashboard/members/add-member")}>
        <PlusIcon/>
        Add new member
    </RainbowButton>
  )
}