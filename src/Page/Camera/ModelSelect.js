import React, { useState, useRef, useEffect, Suspense } from 'react'
import Result from './Result';
import { useImage } from '../../Helper/ImageContext';
import { Link } from "react-router-dom";
import { Button,Checkbox,Typography,Spinner } from "@material-tailwind/react";
import { FaArrowLeft,FaCameraRetro } from "react-icons/fa";
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
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/1.png" ,title:'1',id:'1'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/2.png" ,title:'2',id:'2'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/3.png" ,title:'3',id:'3'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/4.png" ,title:'4',id:'4'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/5.png" ,title:'5',id:'5'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/6.png" ,title:'6',id:'6'},

 ]

function ModelSelect() {
  const { beforeImage } = useImage();
  const [swiper, setSwiper] = useState(null);
  const [currentId , setCurrentId] = useState('')
  const [msg,setMsg] = useState('')
  
  const [isRender , setIsRender] = useState(false)
  const [renderedData, setRenderedData] = useState({})
  const [renderedResult, setRenderedResult] = useState({})
  const [startRender , setStartRender] = useState(false)

  const handleOpen = () => setStartRender(!startRender);
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
      setMsg('開始上傳並演算')
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
      setIsRender(false)
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
    <div className="min-h-[100svh] ">
      
      <Link to='/camera' className=" absolute top-5 left-5 " >
        <Button variant="gradient" className="flex items-center gap-3">
          <FaArrowLeft size={15} />
          Back
        </Button>

      </Link>
      {beforeImage?
        <Suspense fallback={<p>Loading</p>}>
          <motion.div 
            initial={{ opacity: 0 , translateY:-50}}
            animate={{ opacity: 1 , translateY:10}}
            exit={{ opacity: 0 , translateY:-50 }}
            className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-5">
            <div className="text-sm">Before圖如下：</div> 
            <div className="w-full h-full  ">
              <img src={beforeImage} alt="Selected"  className="max-w-full w-full h-auto border-2 border-white rounded-md object-contain " />

            </div>
            {/* 在这里可以进行图像上传或其他操作 */}
          </motion.div>
        </Suspense>
        :
        <div className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-5">沒有第一張圖片，請加入圖片</div>
      }
      <div className="flex flex-col justify-center items-center gap-5 ">
        <Typography variant="h2">選擇模組</Typography>
        <div className='w-8/12'>
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
            navigation={true}
            modules={[EffectCoverflow, Pagination,Navigation]}
            className="mySwiper"
          >
            {
              bannerData?.map((item,index)=>{
                return(
                  <SwiperSlide key={'tf'+index}>
                    <img 
                      src={item.url+'?width=500'} 
                      alt="slide" 
                      className={`hover:brightness-105 rounded-md transition-all ${currentId === item.id ? 'border-4 border-amber-500 ' : ''}`}
                      onClick={()=>{
                        setCurrentId(item.id)
                        handleImageClick(index)
                      }}
                    />
                  </SwiperSlide>
                )
              })
            } 


          </Swiper>
    
        </div>
        <Button color="white" onClick={onBtnClick}>開始演算</Button>
        {msg&&(
          <div className='text-amber-500'>{msg}</div>
        )}
        {isRender && <Spinner/>  }
        {Object.keys(renderedResult).length > 0 && (
          <div>
            1
            <img src={renderedResult.generations[0].img} alt="" />
          </div>
        )}
        
      </div>
      <Result open={startRender} handleOpen={handleOpen}/>
      
    </div>
  )
}

export default ModelSelect