import React,{useState} from 'react'
import { Outlet,useLocation,Link} from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import {getUsernameFromCookie} from '../Helper/Helper'
function RenderLayout() {
  const storedUsername = getUsernameFromCookie();
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
          className='max-w-full flex h-screen md:py-5 left-2 absolute  z-0'/>
        <img 
          src={process.env.PUBLIC_URL+'/images/bg_fui_right.png'} 
          alt="" 
          className='max-w-full flex h-screen md:py-5 right-2 absolute z-0 '/>
          
        <div className='w-full  px-0 md:px-32 pt-4 md:pt-10 flex flex-col '>
          <div className='flex justify-between items-start md:h-10 px-10 md:px-0 flex-col md:flex-row'>
            <div className='w-full md:w-1/3 mt-0 md:mt-0  order-2 md:order-1'>
              <Link to='/camera' className=" " >
                <Button variant="text" className="flex items-center gap-3 text-white text-base p-0 mb-2 hover:text-red-500">
                  <FaArrowLeft size={15} />
                  Back 
                </Button>
              </Link>
              <div className='flex items-center gap-2'>
                <img src={process.env.PUBLIC_URL+'/images/title_slash.svg'} alt="" className='max-w-full   '/> 
                <div className='text-[#FF0050] text-base font-bold'>STEP2 : Choose a module </div>
              </div>

            </div>
            <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/header_right.gif" alt="" className='max-w-screen   md:h-full w-1/2 md:w-auto  ml-auto order-1 md:order-2 ' />
          </div>
          <div className='mt-7 md:mt-6 relative md:my-10 px-0 md:mx-10'>
            <div className=' w-full md:w-auto  top-0 left-0 z-10 right-0'>
              {
                storedUsername && <div className="mt-1   text-white/70 text-xs text-center md:text-left">Player name：{storedUsername}</div>
              }
            </div>

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