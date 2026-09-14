"use client"

import { Button } from './ui/button'
import { useDashboard } from '@/app/dashboard/dashboard-context'

import { redirect } from "next/navigation";


const NoWorldPanel = () => {
  const dashboardContext = useDashboard();

  return (
    dashboardContext.activeWorld ?
    (
      redirect("/dashboard/overview")
    ) :
    (
      <div>
        <div className='flex flex-col items-center gap-2'>
          <h2>You haven't created any worlds yet</h2>
          <Button onClick={() => dashboardContext.setCreateWorldOpen(true)}>Create one</Button>
        </div>
      </div>
    )
  )
}

export default NoWorldPanel