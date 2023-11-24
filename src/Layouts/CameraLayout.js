import React,{useState,useEffect} from 'react'
import { Outlet,useLocation,Link} from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import {getUsernameFromCookie} from '../Helper/Helper'
function CameraLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  const storedUsername = getUsernameFromCookie();
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
 
  return (
    <div 
      className='min-h-[100vh] h-screen md:h-auto relative bg-black text-white bg-repeat bg-center bg-contain'
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL +'/images/bg_border_2.png'})`,
      }}
    >   

        <img 
        src={process.env.PUBLIC_URL+'/images/bg_fui_left.png'} 
        alt="" 
        className='max-w-full flex h-screen md:py-5 left-4 absolute z-0'/>
      

        <img 
          src={process.env.PUBLIC_URL+'/images/bg_fui_right.png'} 
          alt="" 
          className='max-w-full flex h-screen md:py-5 right-3 absolute z-0 '/>
        <div className='w-full md:aspect-[1413/672] flex flex-col h-full md:h-auto justify-between  px-0 md:px-32 pt-4 md:pt-10 relative'>
          <div className='flex justify-between md:h-14  items-start px-10 '>

            {location.pathname === '/camera' ? 
              <div className='w-1/2 md:w-1/4  mt-10 md:mt-0'>
                <Link to='/' className=" " >
                  <Button variant="text" className="flex items-center gap-3 text-white p-0 mb-2 hover:text-red-500 text-base">
                    <FaArrowLeft size={15} />
                    Back 
                  </Button>
                </Link>
                <img src={process.env.PUBLIC_URL+'/images/step1.png'} alt="" className='max-w-full   '/> 
              </div>
              
              :
              <img src={process.env.PUBLIC_URL+'/images/header_left.png'} alt="" className='max-w-screen md:h-full w-[47%] md:w-auto mt-14 md:mt-0'/>
            }
            
            <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/header_right.gif" alt="" className='max-w-screen w-1/2 md:w-auto md:h-full ' />
          </div>
          <div 
            className={`${isMobile ? "h-full ":  "framed" } flex flex-col w-full mx-auto  items-center md:mt-10 py-1 relative `}
          >
            <div className=' w-full md:w-auto absolute top-0 left-0 z-10 right-0'>
              <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/page_fui01_gif.gif" alt="p01" className='max-w-full hidden md:block  ' /> 
              {
                location.pathname === '/camera' && storedUsername && <div className="mt-4  text-white/70 text-xs text-center md:text-left">玩家名稱：{storedUsername}</div>
              }
            </div>
           
            
            <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/page_fui02_gif.gif" alt="p01" className='max-w-full w-[40%] md:w-auto absolute bottom-0 left-0 pl-10 md:pl-0  ' />
            <Outlet />

           
            
          </div>
    
          {isMobile ?
            <img src={process.env.PUBLIC_URL+'/images/page_bottom_mb.png'} alt="p01" className='max-w-full w-full my-4  md:mt-8' />
            :
            <img src={process.env.PUBLIC_URL+'/images/page_bottom.png'} alt="p01" className='max-w-full w-full my-4 md:mt-8' />

          }

      
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