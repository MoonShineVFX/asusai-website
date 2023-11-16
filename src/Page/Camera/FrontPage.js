import React,{useEffect,useState} from 'react'
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Button,Checkbox,Typography } from "@material-tailwind/react";
function FrontPage({handleClick}) {
  const [isHovered, setHovered] = useState(false)

  return (
        <div className='flex flex-col justify-between items-center h-full'>
          <motion.div 
            className=' relative w-full md:w-4/5 mx-auto flex aspect-[4/4] md:aspect-[1413/580] mt-10 md:mt-0 '
           
          >
            <motion.img 
              initial={{ opacity: 0, x:  180 }}
              animate={{ opacity: 1 , x:isHovered ? 40:0}}
              exit={{ opacity: 0,x:180 }}
              transition={{ duration: 1.5 }}

              src={process.env.PUBLIC_URL+'/images/person_left.png'} alt="p01" className='max-w-full w-1/2 md:w-[24vw] absolute top-0 left-[5%] md:left-[15%] ' />
            <motion.img
              initial={{ opacity: 0, x:-180 }}
              animate={{ opacity: 1 , x:isHovered ? -40:0}}
              exit={{ opacity: 0,x:-180 }} 
              transition={{ duration: 1.5 }}
              src={process.env.PUBLIC_URL+'/images/person_right.png'} alt="p01" className='max-w-full w-1/2 md:w-[24vw] absolute top-0  right-[5%] md:right-[15%] ' />
          </motion.div>
          <div className='mt-auto flex flex-col justify-center items-center'>

            <motion.div 
              className='text-lg font-bold md:my-0 text-gray-200 '
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >Create your gamer card！
            </motion.div>

            <Link 
              to={'/camera'} 
              className=' relative mt-8'
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className='sample-heading-3 w-full h-full absolute top-0 z-10 animate-[fadeIn_0.3s_ease-in-out_infinite] hover:animate-none  '></div>
              <div className='bg-gradient-to-b bg-[#FF0050] to-black px-10 py-2 font-bold  border-white/30' >START</div>
            </Link>

            
            <Typography color="white" className="flex text-xs my-10 md:mt-3 font-normal">
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