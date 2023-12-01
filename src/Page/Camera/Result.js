import React,{Suspense} from 'react'
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
  IconButton
} from "@material-tailwind/react";
import QRCode from "react-qr-code";
function Result({open ,handleOpen,renderedResult,username}) {

  const downloadImage = (imgurl) => {
    const imageUrl = imgurl
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'downloaded-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadImageBlob = (imgurl) => {
    const imageUrl = imgurl;
  
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'downloaded-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error('下載失敗：', error));
  };
  return (
    <div>
      <Dialog open={open} size="lg"  className='bg-black/80 pt-0 -mt-20 md:mt-0 '>
      <DialogHeader className="justify-end mb-0 md:mb-1 pb-0 pt-0">
          <IconButton
            color="white"
            size="sm"
            variant="text"
            onClick={handleOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className='p-0 m-0'>
          <div className='flex flex-col md:flex-row justify-center items-center gap-0 '>

            {Object.keys(renderedResult).length > 0 && (
              <div className='w-3/4 md:w-1/2 relative'>
                <Suspense fallback={<Spinner/>}>
                  {
                    username && 
                    <div className="  text-center bg-black/30 p-3 rounded-md  text-white/70 text-xs my- cursor-pointer">Player name：{username}</div>
                  }
                  <img src={renderedResult.generations[0].img} alt=""  className='border border-red-500'/>
                  <div className='md:hidden text-center text-white/70'>Press and hold to save photo</div>
                  <div onClick={()=>downloadImageBlob(renderedResult.generations[0].img)}
                      className=" absolute text-center bottom-0 right-2  bg-black/30 p-3 rounded-md  text-white/70 text-xs my-2 hidden font-roboto">下載</div>
               
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
                  className='mt-4 md:mt-8  md:bg-contain bg-center bg-no-repeat w-full px-2 py-2 md:px-10 md:py-6 text-sm text-center text-white font-normal'
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL +'/images/scan_info.png'})`,
                  }}
                >
                  Scan QRCODE to download your own AI picture！
                </div>
              </div>


              <div className='flex flex-col w-full md:w-full gap-2 md:gap-0 mt-4 md:mt-0'>

                <div className=" relative md:mt-6 w-3/4 mx-auto" onClick={handleOpen}>
                  <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
                  <div className='text-white text-sm font-normal bg-gray-800/40 px-5 py-2 border  border-white/30 flex items-center justify-center text-center font-roboto' >Choose another module</div>
                </div>
                <Link to='/camera' className=" relative mt-2 w-3/4 mx-auto" onClick={handleOpen}>
                  <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
                  <div className='text-white text-sm font-normal bg-gray-800/40 px-5 py-2 border  border-white/30 flex items-center justify-center text-center font-roboto' >Reshoot</div>
                </Link>
                <Link to='/' className=" relative mt-2 w-3/4 mx-auto" onClick={handleOpen}>
                  <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
                  <div className='text-white text-sm font-normal bg-[#FF0050] px-5 py-2 border  border-white/30 flex items-center justify-center text-center font-roboto' >Home</div>
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