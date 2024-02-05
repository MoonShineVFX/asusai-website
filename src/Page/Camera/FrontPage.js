import React,{useEffect,useState} from 'react'
import { Link,useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Button,Checkbox,Typography,Input } from "@material-tailwind/react";
import {useImage} from '../../Helper/ImageContext'
import { setUsernameToCookie } from '../../Helper/Helper';
import CustomAlert from "../../Helper/CustomAlert";
function FrontPage({handleClick}) {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const { username, setUsername } = useImage();
  const [isHovered, setHovered] = useState(false)
  const onChange = ({ target }) => setUsername(target.value);
  const handleStart = ()=>{
    if (username.trim() !== '') {
      console.log(username);
      setNotification(null)
      setUsernameToCookie(username);
      setTimeout(()=>{
        navigate("/camera");
      },800)
    } else {
      // 如果 username 是空白，可以在這裡處理錯誤或提醒使用者輸入有效的 username
      setNotification('Please enter your name.');
    }
  }
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
        <div className='flex flex-col justify-between items-center md:justify-center w-full px-0  '>
          {notification && (
            <CustomAlert message={notification} onClose={() => setNotification(null)} />
          )}
          <motion.div 
            className=' relative w-full md:w-4/5 mx-auto flex  my-6 md:my-10 text-center'
          >
            {isMobile ? 
            <motion.img 
              initial={{ opacity: 0, y:  40 }}
              animate={{ opacity: 1 , y:isHovered ? 10:0}}
              exit={{ opacity: 0,y:40 }}
              transition={{ duration: 1.5 }}
              src="https://r2.web.moonshine.tw/msweb/asusaicamera/images/cover_mb.png?width=400" alt="p01" className='max-w-full w-full img_ref mt-10 mb-4 ' />
              :
              <motion.picture
                initial={{ opacity: 0, y:  40 }}
                animate={{ opacity: 1 , y:isHovered ? 10:0}}
                exit={{ opacity: 0,y:40 }}
                transition={{ duration: 1.5 }}
                className='mx-auto '
              >
                <source
                  src='https://r2.web.moonshine.tw/msweb/asusaicamera/images/cover.png?format=webp&width=1280'
                  alt="card-image"
                  className='max-w-full w-full img_ref '
                  type='image/webp'
                />
                <img

                  src='https://r2.web.moonshine.tw/msweb/asusaicamera/images/cover.png?width=1280'
                  alt="card-image"
                  className='max-w-full w-full img_ref '
                />
              </motion.picture>

            }
            

          </motion.div>
          <div className='mt-auto flex flex-col justify-center items-center'>

            <motion.div 
              className='text-xl md:text-2xl font-bold md:my-2 text-gray-200  '
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >Create your gamer card！
            </motion.div>

            <div className='flex my-8 md:my-6 flex-col gap-2 md:flex-row md:gap-0  w-4/5 md:w-full    '>
              <div className="w-full md:w-72">
                <Input type="text" color="white" label="Please enter your name." className=' rounded-none font-roboto' onChange={onChange} />
                
              </div>
              <div 
                className=' relative rounded-r-lg cursor-pointer mx-6 md:mx-0 mt-4 md:mt-0'
                onClick={handleStart}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <div className='sample-heading-3 w-full h-full absolute top-0 z-10 animate-[fadeIn_0.3s_ease-in-out_infinite] hover:animate-none  '></div>
                <div className='bg-gradient-to-b bg-[#FF0050] to-black text-center px-10 py-2 font-bold  border-white/30 font-roboto ' >START</div>
              </div>

            </div>
   

            
            <Typography color="white" className="flex text-xs my-10 md:mt-3 font-normal hidden">
              當您使用本功能時代表您了解並同意
              <Typography
                as="a"
                href="#"
                color="blue"
                className="font-medium transition-colors hover:text-blue-700 text-xs"
              >
                &nbsp;使用者條款與隱私權政策
              </Typography>
              
            </Typography>
          </div>


        </div>

        

        

  
          

     



  )
}

export default FrontPage