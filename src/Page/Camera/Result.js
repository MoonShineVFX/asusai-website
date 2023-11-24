import React,{Suspense} from 'react'
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner
} from "@material-tailwind/react";
import QRCode from "react-qr-code";
function Result({open ,handleOpen,renderedResult,username}) {
  return (
    <div>
      <Dialog open={open} size="lg" handler={handleOpen} className='bg-black/80 py-5'>
        <DialogBody>
          <div className='flex flex-col md:flex-row justify-center items-center gap-0'>
            {Object.keys(renderedResult).length > 0 && (
              <div className='md:w-1/2 relative'>
                <Suspense fallback={<Spinner/>}>
                  <img src={renderedResult.generations[0].img} alt=""  className='border border-red-500'/>
                  {
                    username && 
                    <div className=" absolute text-center bottom-0 right-2  bg-black/30 p-3 rounded-md  text-white/70 text-xs my-2">玩家名稱：{username}</div>
                  }
                </Suspense>
                
              </div>
            )}
            <div className='3/12 hidden md:block'>
              <img src={process.env.PUBLIC_URL+'/images/redline.svg'} alt="" className='  w-full md:-translate-y-20 translate-y-0 ' />
            </div>
             
            <div className='w-full md:w-1/3 flex md:flex-col md:gap-4 items-center justify-center'>
              <div className='hidden md:flex flex-col w-1/2 md:w-full  '>
                {Object.keys(renderedResult).length > 0 &&
                  <div 
                    className='p-3 md:p-5 bg-contain bg-no-repeat md:w-full mx-auto border border-red-500 relative'
                  >
                    <QRCode
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={renderedResult.generations[0].img}
                      viewBox={`0 0 200 200`}
                    />

                  
                  </div> }
                <div 
                  className='mt-4 md:mt-8  md:bg-contain bg-center bg-no-repeat w-full px-2 py-2 mx:px-10 md:py-6 text-sm text-center text-white font-normal'
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL +'/images/scan_info.png'})`,
                  }}
                >
                  掃描上方 QRCODE 即可下載屬於你的 AI 圖片！
                </div>
              </div>



              <div className='flex flex-col w-full md:w-full gap-2 md:gap-0 mt-10 md:mt-0'>

                <div className=" relative md:mt-6 w-3/4 mx-auto" onClick={handleOpen}>
                  <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
                  <div className='text-white text-sm font-normal bg-gray-800/40 px-5 py-2 border  border-white/30 flex items-center justify-center text-center ' >選擇另一個模組</div>
                </div>
                <Link to='/camera' className=" relative mt-2 w-3/4 mx-auto" onClick={handleOpen}>
                  <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
                  <div className='text-white text-sm font-normal bg-gray-800/40 px-5 py-2 border  border-white/30 flex items-center justify-center text-center ' >重新拍照</div>
                </Link>
                <Link to='/' className=" relative mt-2 w-3/4 mx-auto" onClick={handleOpen}>
                  <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
                  <div className='text-white text-sm font-normal bg-[#FF0050] px-5 py-2 border  border-white/30 flex items-center justify-center text-center ' >回到首頁</div>
                </Link>
              </div>

            </div>


          </div>

        </DialogBody>
     
      </Dialog>
    </div>
  )
}

export default Result