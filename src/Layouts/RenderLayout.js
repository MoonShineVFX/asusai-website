import React,{useState} from 'react'
import { Outlet,useLocation,Link} from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
function RenderLayout() {
  return (
    <div 
      className='min-h-[100vh] relative bg-black text-white bg-repeat bg-center bg-contain '
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
          
        <div className='w-full  px-10 md:px-32 pt-10 flex flex-col '>
          <div className='flex justify-between items-start h-10'>
            <div className='w-1/3 md:w-1/3'>
              <Link to='/camera' className=" " >
                <Button variant="text" className="flex items-center gap-3 text-white text-base p-0 mb-2 hover:text-red-500">
                  <FaArrowLeft size={15} />
                  Back 
                </Button>
              </Link>
              <img src={process.env.PUBLIC_URL+'/images/step2.png'} alt="" className='max-w-full h-full '/> 
            </div>
            <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/header_right.gif" alt="" className='max-w-screen  w-1/3 md:w-auto' />
          </div>
          <div className='mt-6 relative py-1'>
            <Outlet />
          </div>


          
          <div className='mt-auto'>
            <img src={process.env.PUBLIC_URL+'/images/page_bottom.png'} alt="p01" className='max-w-full w-full mt-auto ' />
          </div>

      
        {/* <div className='text-sm text-white/30  text-center p-2'>
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </div> */}

      </div>

        
   
    </div>
  )
}

export default RenderLayout