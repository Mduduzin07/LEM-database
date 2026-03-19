"use client"

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'


export default function AddMemberButton() {
  return (
    <Button  variant="outline" className='size-8 text-violet-600 cursor-pointer' onClick={()=>redirect("/dashboard/members/add-member")}>
        <PlusIcon/>
    </Button>
  )
}