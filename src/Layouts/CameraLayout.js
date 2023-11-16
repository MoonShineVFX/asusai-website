import React,{useState,useEffect} from 'react'
import { Outlet,useLocation,Link} from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@material-tailwind/react";

function CameraLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
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
        className='max-w-full flex h-screen py-5 left-4 absolute '/>
      

        <img 
          src={process.env.PUBLIC_URL+'/images/bg_fui_right.png'} 
          alt="" 
          className='max-w-full flex h-screen py-5 right-4 absolute '/>
        <div className='w-full md:aspect-[1413/672] flex flex-col h-full md:h-auto justify-between  px-10 md:px-32 pt-10'>
          <div className='flex justify-between h-10  items-start'>

          {location.pathname === '/camera' ? 
            <div className='w-1/4'>
              <Link to='/' className=" " >
                <Button variant="text" className="flex items-center gap-3 text-white p-0 mb-2 hover:text-red-500 text-base">
                  <FaArrowLeft size={15} />
                  Back 
                </Button>
              </Link>
              <img src={process.env.PUBLIC_URL+'/images/step1.png'} alt="" className='max-w-full w-[60%] '/> 
            </div>
            
            :
            <img src={process.env.PUBLIC_URL+'/images/header_left.png'} alt="" className='max-w-screen  w-1/3 md:w-auto'/>
          }
            
            <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/header_right.gif" alt="" className='max-w-screen w-1/3 md:w-auto' />
          </div>
          <div 
            className={`${isMobile ? "h-full ":  "framed" } flex flex-col w-full mx-auto  items-center md:mt-10 py-1 relative`}
          >
            <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/page_fui01_gif.gif" alt="p01" className='max-w-full w-1/2 md:w-auto absolute top-0 left-0 z-10  ' /> 
              
            
            <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/page_fui02_gif.gif" alt="p01" className='max-w-full w-1/2 md:w-auto absolute bottom-0 left-0  ' />
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