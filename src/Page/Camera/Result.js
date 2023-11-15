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
function Result({open ,handleOpen,renderedResult}) {
  return (
    <div>
      <Dialog open={open} size="lg" handler={handleOpen} className='bg-black/80 py-5'>
        <DialogBody>
          <div className='flex justify-around items-center gap-10'>
            {Object.keys(renderedResult).length > 0 && (
              <div className='w-1/2'>
                <Suspense fallback={<Spinner/>}>
                  <img src={renderedResult.generations[0].img} alt=""  className='border border-red-500'/>
                </Suspense>
                
              </div>
            )}
            <div className='w-1/3 flex flex-col gap-4'>
              {Object.keys(renderedResult).length > 0 &&
              <div 
                className='p-5 mt-6 bg-contain bg-no-repeat w-10/12 mx-auto border border-red-500'
              >
                <QRCode
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={renderedResult.generations[0].img}
                  viewBox={`0 0 200 200`}
                />
              </div> }
              <div className='mt-8'>
                <img src={process.env.PUBLIC_URL+'/images/scan_info.png'} alt="scan_info" className='max-w-full' />
              </div>
              <div className=" relative mt-6 w-3/4 mx-auto" onClick={handleOpen}>
                <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
                <div className='text-white text-sm font-normal bg-gray-800/40 px-5 py-2 border  border-white/30 flex items-center justify-center text-center ' >選擇另一個模組</div>
              </div>
              <Link to='/' className=" relative mt-2 w-3/4 mx-auto" onClick={handleOpen}>
                <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
                <div className='text-white text-sm font-normal bg-gray-800/40 px-5 py-2 border  border-white/30 flex items-center justify-center text-center ' >回到首頁</div>
              </Link>
            </div>


          </div>

        </DialogBody>
     
      </Dialog>
    </div>
  )
}

export default Result