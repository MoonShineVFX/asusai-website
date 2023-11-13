import React,{useEffect} from 'react'
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Button,Checkbox,Typography } from "@material-tailwind/react";
function FrontPage({handleClick}) {
  useEffect(()=>{
    fetch('https://moonshine.b-cdn.net/msweb/test_imgs/t1.png')
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.onload = () => {
          console.log("Image width: ", image.width);
          console.log("Image height: ", image.height);
        };
        console.log(blob)
      });
  },[])
  return (
    <div >
      <div className='   flex flex-col w-full items-center px-5 z-50 landscape:mb-20 landscape:px-20 landscape:justify-center'>
        <motion.div 
          className='text-[3.2rem] font-black  leading-tight'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        > 
          <div>Homepage </div>
          <div>AI Camera</div>   
        </motion.div>
        <motion.div 
          className='text-lg font-bold my-4 text-gray-200 '
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >這是起始頁 下一頁是拍照或選照片！</motion.div>
        <Link to={'/camera'}>
          <Button color="white">開始旅程</Button>
        </Link>

        <div>
          <Typography color="white" className="flex font-medium">
            當您使用本網頁時代表您了解並同意
            <Typography
              as="a"
              href="#"
              color="blue"
              className="font-medium transition-colors hover:text-blue-700"
            >
              &nbsp;使用者條款與隱私權政策
            </Typography>
            .
          </Typography>
        </div>

      </div>

      {/* <div className='text-sm text-white/30  text-center p-2'>
        This site is protected by reCAPTCHA and the Google
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </div> */}

    </div>
  )
}

export default FrontPage