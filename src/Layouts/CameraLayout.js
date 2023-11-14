import React,{useState} from 'react'
import { Outlet} from 'react-router-dom';
function CameraLayout() {
  return (
    <div 
      className='h-[100vh] relative bg-black text-white bg-repeat bg-center bg-contain'
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL +'/images/bg_border_2.png'})`,
      }}
    > 
        <img 
          src={process.env.PUBLIC_URL+'/images/bg_fui_left.png'} 
          alt="" 
          className='max-w-full flex h-screen py-5 left-4 absolute '/>
        <img 
          src={process.env.PUBLIC_URL+'/images/bg_fui_right.png'} 
          alt="" 
          className='max-w-full flex h-screen py-5 right-4 absolute '/>
              <div className='w-full aspect-[1413/672]  bg-blue-gray- px-32 pt-10'>
        <div className='flex justify-between h-10'>
          <img src={process.env.PUBLIC_URL+'/images/header_left.png'} alt="" className='max-w-screen '/>
          <img src={process.env.PUBLIC_URL+'/images/header_right.png'} alt="" className='max-w-screen ' />
        </div>
        <div 
          className='framed flex flex-col w-full mx-auto  items-center   bg-no-repeat bg-contain bg-top mt-10 py-1 relative'
        >
          <img src={process.env.PUBLIC_URL+'/images/page_fui01.png'} alt="p01" className='max-w-full absolute top-0 left-0 z-10  ' />
          <img src={process.env.PUBLIC_URL+'/images/page_fui02.png'} alt="p01" className='max-w-full absolute bottom-0 left-0  ' />
          <Outlet />

          

          
        </div>
    
            
        <img src={process.env.PUBLIC_URL+'/images/page_bottom.png'} alt="p01" className='max-w-full w-full mt-8' />

      
        {/* <div className='text-sm text-white/30  text-center p-2'>
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </div> */}

      </div>

        
   
    </div>
  )
}

export default CameraLayout