import React from 'react'
import { Outlet} from 'react-router-dom';


function CameraLayout() {
  return (
    <div className='h-[100svh] relative bg-black text-white'>
      <Outlet />
    </div>
  )
}

export default CameraLayout