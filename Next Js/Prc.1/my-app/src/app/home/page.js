import ProtectedRoutes from '@/components/protectedRoutes'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoutes>
      <div>home</div>
    </ProtectedRoutes>
  )
}

export default page