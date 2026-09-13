"use client"

import { Button } from './ui/button'
import { useDashboard } from '@/app/dashboard/dashboard-context'

const WorldPanel = () => {
  const dashboardContext = useDashboard();

  return (
    <div>
      {
        dashboardContext.activeWorld ?
        (
          <div className='flex flex-col items-center gap-2'>
            <h2>{dashboardContext.activeWorld.name}</h2>
          </div>
        ) :
        (
          <div className='flex flex-col items-center gap-2'>
            <h2>You haven't created any worlds yet</h2>
            <Button onClick={() => dashboardContext.setCreateWorldOpen(true)}>Create one</Button>
          </div>
        )
      }
    </div>
  )
}

export default WorldPanel