import React, { useState, useRef, useEffect, Suspense } from 'react'
import Result from './Result';
import { useImage } from '../../Helper/ImageContext';
import { Link } from "react-router-dom";
import { Button,Checkbox,Typography,Spinner } from "@material-tailwind/react";
import { FaArrowLeft,FaCameraRetro,FaCheck } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

// Import Swiper React components
import { Swiper, SwiperSlide,useSwiper } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { EffectCoverflow, Pagination,Navigation } from 'swiper/modules';
const bannerData = [
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/1.jpg" ,title:'MODULE 1', subtitle:"Introduction to module one",id:'1'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/2.jpg" ,title:'MODULE 2', subtitle:"Introduction to module two",id:'2'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/3.jpg" ,title:'MODULE 3', subtitle:"Introduction to module three",id:'3'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/4.jpg" ,title:'MODULE 4', subtitle:"Introduction to module four",id:'4'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/5.jpg" ,title:'MODULE 5', subtitle:"Introduction to module five",id:'5'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/6.jpg" ,title:'MODULE 6', subtitle:"Introduction to module six",id:'6'},

 ]

function ModelSelect() {
  const { beforeImage } = useImage();
  const [swiper, setSwiper] = useState(null);
  const [currentId , setCurrentId] = useState('')
  const [msg,setMsg] = useState('')
  
  const [isRender , setIsRender] = useState(false)
  const [renderedData, setRenderedData] = useState({})
  const [renderedResult, setRenderedResult] = useState({})
  const [showRender , setShowRender] = useState(false)

  const handleOpen = () => setShowRender(!showRender);
  const handleImageClick = (index) =>{
    swiper.slideTo(index)
  }
  const onBtnClick= ()=>{
    if (!beforeImage) {
      setMsg('錯誤：必須先拍攝或上傳圖片。')
      return
    }
    if(!currentId){
      console.log('no')
      setMsg('錯誤：必須選擇一個模組。')
      return
    }
      setMsg('正在上傳圖片..')
      setIsRender(true)
    // setStartRender(true)
    //fetch API 上傳運算
    //POST https://faceswap.rd-02f.workers.dev/images 上傳圖片
    //GET https://faceswap.rd-02f.workers.dev/images/<id> 取得圖片
    var file = dataURLtoFile(beforeImage,'image.jpg')
    const formData = new FormData();
    formData.append('source_image', file); 
    formData.append("command_type", currentId);

    fetch('https://faceswap.rd-02f.workers.dev/images', {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData)
      setRenderedData(responseData)
      setIsRender(true)
      setMsg('Ai演算中，請等待結果。')
      setTimeout(() => {
        getResulImage(responseData.id)
      }, 500);


    })
    .catch(error => {
      console.error(error);
    });


  }
  const getResulImage = (id) =>{
    // let reid = id
    fetch('https://faceswap.rd-02f.workers.dev/images/'+id, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData)
     

      setTimeout(() => {
        if(responseData.finished === 0){
          getResulImage(id)
        }
        if(responseData.finished ===1){
          setRenderedResult(responseData)
          setShowRender(true)
          setIsRender(false)
          setMsg('')
          return
        }
      }, 1000);

    })
    .catch(error => {
      console.error(error);
    });

  }
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }
  
  return (
    <div className="flex flex-col justify-between items-center ">
      

      {beforeImage?
        <Suspense fallback={<p>Loading</p>}>
          <motion.div 
            initial={{ opacity: 0 , translateY:-50}}
            animate={{ opacity: 1 , translateY:10}}
            exit={{ opacity: 0 , translateY:-50 }}
            className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-10">
            <div className="text-sm">你的圖片：</div> 
            <div className="w-full h-full  ">
              <img src={beforeImage} alt="Selected"  className="max-w-full w-full h-auto border-2 border-white rounded-md object-contain " />

            </div>
            {/* 在这里可以进行图像上传或其他操作 */}
          </motion.div>
        </Suspense>
        :
        <div className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-5">沒有第一張圖片，請加入圖片</div>
      }
        <div className='w-[80%] mx-auto relative'>
          <Swiper
            onSwiper={setSwiper}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={false}
            navigation={{
              nextEl: " .slidenext2",
              prevEl: " .slideprev2"
            }}
            modules={[EffectCoverflow, Pagination,Navigation]}
            className="mySwiper"
          >
            {
              bannerData?.map((item,index)=>{
                return(
                  <SwiperSlide key={'tf'+index}>
                    <div className=' relative'>
                      <div className=' relative'>
                        <img 
                          src={item.url+'?width=500'} 
                          alt="slide" 
                          className={`hover:brightness-105 rounded-md transition-all ${currentId === item.id ? 'border-4 border-amber-500/0 ' : ''}`}
                          onClick={()=>{
                            setCurrentId(item.id)
                            handleImageClick(index)
                          }}
                        />
                        <img src={process.env.PUBLIC_URL+'/images/image_border.png'} alt="" className=' absolute top-0 -left-5 z-10 pointer-events-none' />
                        {
                          currentId === item.id && <div className='absolute top-0 right-0 text-[#AD86E5]'><GiCheckMark size={34}  className=' ' /></div>
                        }
                      </div>

                      <div className=' absolute -bottom-4 -left-8 z-20'>
                        <div className='text-2xl text-red-500'>{item.title}</div>
                        <div className='text-white/50'>{item.subtitle}</div>
                      </div>

                    </div>

                  </SwiperSlide>
                )
              })
            } 


          </Swiper>
          <div className='w-[110%] mx-auto gap-10 justify-between hidden  md:flex absolute top-[40%] -left-[4%] '>
            <img src={process.env.PUBLIC_URL+'/images/arrow_left.png'} alt=""  className="slideprev2 " />
            <img src={process.env.PUBLIC_URL+'/images/arrow_right.png'} alt=""  className="slidenext2 " />

          </div>
    
        </div>
        <div className=" relative mt-4" onClick={onBtnClick}>
          <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
          <div className='bg-gradient-to-b from-[#FF0050] to-[#000] px-10 py-2 border  border-white/30 flex items-center gap-2' >開始演算</div>
        </div>

        {isRender && 
          <div className='fixed  inset-0 w-full h-screen bg-black/50 z-30 backdrop-blur-sm'>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            exit={{ opacity: 0 }}
            className=' absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2'
          >
            <div className='w-[400px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
              <img src={process.env.PUBLIC_URL+'/images/loading.png'} alt="" className='animate-spin'/>
            </div>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full text-center '>
              {msg&&(
                <div className='text-white/50 '>{msg}</div>
              )}
            </div>

            <div className='w-[350px] '>
              <div className='pt-[100%] relative border border-red-500 rounded-full'>
                <img src={beforeImage} alt="Selected"  className=" brightness-[0.2] absolute aspect-square top-0 left-0 object-cover w-full h-full rounded-full  " />

              </div>
            </div>

          </motion.div>
        
          </div>
        }

        
      
      <Result open={showRender} handleOpen={handleOpen} renderedResult={renderedResult}/>
      
    </div>
  )
}

export default ModelSelect