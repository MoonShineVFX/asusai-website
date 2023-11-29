import React, { useState, useRef, useEffect, Suspense } from 'react'
import Result from './Result';
import { useImage } from '../../Helper/ImageContext';
import { Link } from "react-router-dom";
import { Button,Checkbox,Typography,Spinner } from "@material-tailwind/react";
import { FaArrowLeft,FaCameraRetro,FaCheck } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import {getUsernameFromCookie} from '../../Helper/Helper'
import Resizer from "react-image-file-resizer";
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
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/7.jpg" ,title:'MODULE 7', subtitle:"Introduction to module 7",id:'7'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/8.jpg" ,title:'MODULE 8', subtitle:"Introduction to module 8",id:'8'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/9.jpg" ,title:'MODULE 9', subtitle:"Introduction to module 9",id:'9'},
  {url:"https://moonshine.b-cdn.net/msweb/asusaicamera/templates/10.jpg" ,title:'MODULE 10', subtitle:"Introduction to module 10",id:'10'},

 ]

function ModelSelect() {
  const storedUsername = getUsernameFromCookie();
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
  const { beforeImage } = useImage();
  const [swiper, setSwiper] = useState(null);
  const [currentId , setCurrentId] = useState('1')
  // console.log(currentId)
  const [msg,setMsg] = useState('')
  
  const [isRender , setIsRender] = useState(false)
  const [renderedData, setRenderedData] = useState({})
  const [renderedResult, setRenderedResult] = useState({})
  const [showRender , setShowRender] = useState(false)
  
  const handleOpen = () => setShowRender(!showRender);
  const handleImageClick = (index) =>{
    swiper.slideTo(index)
  }
  const needsCompression = (file, maxSize, maxDimension) => {
    return file.size > maxSize || (file.width > maxDimension || file.height > maxDimension);
  }
  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          resolve({
            width: this.width,
            height: this.height,
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  const onBtnClick= async ()=>{
    
    if (!beforeImage) {
      setMsg('錯誤：必須先拍攝或上傳圖片。')
      return
    }
    if(!currentId){
      // console.log('no')
      setMsg('錯誤：必須選擇一個模組。')
      return
    }
      setMsg(null)
      setMsg('正在上傳圖片..')
      setIsRender(true)

    
    // setStartRender(true)
    //fetch API 上傳運算
    //POST https://faceswap.rd-02f.workers.dev/images 上傳圖片
    //GET https://faceswap.rd-02f.workers.dev/images/<id> 取得圖片
    var file = dataURLtoFile(beforeImage,'image.jpg')
    const { width, height } = await getImageDimensions(file);
    console.log(width, height)
    let compressFiles
    
    //容量 尺寸
   
    if(needsCompression(file, 2 * 1024 * 1024, 2000)) {

      console.log('需要壓縮')
      compressFiles = await resizeFile(file);
      setMsg('正在壓縮圖片。')
    }else{
      compressFiles = file
    }

    const formData = new FormData();
    formData.append('source_image', compressFiles); 
    formData.append("command_type", currentId);
    formData.append("username", storedUsername ? storedUsername : ' ');

    fetch('https://faceswap.rd-02f.workers.dev/images', {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    })
    .then(response => {
      console.log(response)
      if(response.ok){

        return response.json()
      }else{
        setMsg('發生錯誤，請重新上傳圖片。')
      }
     
    })
    .then(responseData => {
      // console.log(responseData)
      if(responseData.message){
        setMsg('發生錯誤，請重新上傳圖片。')
        return
      }
      setRenderedData(responseData)
      setIsRender(true)
      setMsg(null)
      
      setTimeout(() => {
        setMsg('Ai演算中，請等待結果。')
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
      // console.log(responseData)
     
      setTimeout(() => {
        if(responseData.restarted>=5){
          setMsg('逾時錯誤，請重新上傳圖片。')
          return
        }
        if(responseData.finished === 0){
          getResulImage(id)
        }

        if(responseData.finished ===1){
          setRenderedResult(responseData)
          setShowRender(true)
          setIsRender(false)
          setMsg('')
          updatedData(id,responseData.generations[0].img)
          return
        }
      }, 1000);

    })
    .catch(error => {
      console.error(error);
    });

  }
  const updatedData = (id,url)=>{
    const formData = new FormData();
    formData.append('swap_image', url); 
    formData.append("horde_id", id);

    fetch('https://faceswap.rd-02f.workers.dev/swap_data', {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    })
    .then(response => {
      if(response.status === 200){
        console.log('uploaded')
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
  const resizeFile = (file) => 
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000, // 設置圖像的最大寬度
        1000, // 設置圖像的最大高度
        'JPEG', // 設置圖像的格式
        70, // 設置圖像的質量
        0, // 設置圖像的旋轉角度
        (uri) => {
          resolve(uri);
        },
        'file' // 設置返回的圖像格式
      );
    });
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
    <div className="flex flex-col justify-between items-center my-3 md:my-10 w-full h-full">
      

      {beforeImage?
        <Suspense fallback={<p>Loading</p>}>
          <motion.div 
            initial={{ opacity: 0 , translateY:-50}}
            animate={{ opacity: 1 , translateY:10}}
            exit={{ opacity: 0 , translateY:-50 }}
            className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-10 hidden">
            <div className="text-sm">你的圖片：</div> 
            <div className="w-full h-full  ">
              <img src={beforeImage} alt="Selected"  className="max-w-full w-full h-auto border-2 border-white rounded-md object-contain " />

            </div>
            {/* 在这里可以进行图像上传或其他操作 */}
          </motion.div>
        </Suspense>
        :
        <div className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-5 text-xs">請記得上傳照片才可以換臉</div>
      }
        <div className='w-full md:w-[80%] mx-auto relative mt-5 md:mt-0'>
          <Swiper
            onSwiper={setSwiper}
            onSlideChange={() => {
              setCurrentId(String(swiper.activeIndex+1))
            }}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            breakpoints={{
              420: {
                slidesPerView: 1.5,
                spaceBetween:10
              },
              768: {
                slidesPerView: 3,
                spaceBetween:20
              },
              1024:{
                slidesPerView: 3,
                spaceBetween:20
              }
            }}
            slidesPerView={1.4}
            coverflowEffect={{
              rotate: ` ${isMobile?  20 : 0}`,
              stretch: ` ${isMobile?  10 : 20}`,
              depth:` ${isMobile?  500 : 500}`,
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
                    <div className=' relative '>
                      <div className=' relative w-full'>
                        <img 
                          src={item.url+'?width=350'} 
                          alt="slide" 
                          className={` max-w-full hover:brightness-110 rounded-md transition-all ${currentId === item.id ? 'drop-shadow-[0px_10px_15px_rgba(255,255,255,0.55)] brightness-110 ' : ''}`}
                          onClick={()=>{
                            handleImageClick(index)
                          }}
                        />
                        <div className='w-[94%] absolute top-2 -left-5 z-10 pointer-events-none hidden'>
                          <img src={process.env.PUBLIC_URL+'/images/image_border.png'} alt="" className='max-w-full w-full ' />

                        </div>
                        {
                          currentId === item.id && <div className='absolute top-0 right-0 text-[#AD86E5]'><GiCheckMark size={34}  className=' ' /></div>
                        }
                      </div>

                      <div className=' absolute -bottom-2 -left-10 z-20 bg-gradient-to-r p-2 from-black/90 via-black/70 hidden '>
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
            <img src={process.env.PUBLIC_URL+'/images/arrow_left.png'} alt=""  className="slideprev2 cursor-pointer " 
     
            />
            <img src={process.env.PUBLIC_URL+'/images/arrow_right.png'} alt=""  className="slidenext2 cursor-pointer " 

            />
          </div>
    
        </div>
        {beforeImage? 
          <div className=" relative mt-4 cursor-pointer" onClick={onBtnClick}>
            <div className='sample-heading-3 w-full h-full absolute top-0 z-10   animate-[fadeIn_0.3s_ease-in-out_infinite] hover:animate-none   '></div>
            <div className='bg-gradient-to-b bg-[#FF0050] to-[#000] px-10 py-2 border  border-white/30 flex items-center gap-2 font-roboto' >開始演算</div>
          </div>
          :
          <div className=" relative mt-4 cursor-default" onClick={onBtnClick}>
            <div className='bg-gradient-to-b bg-[#888] to-[#000] px-10 py-2 border  border-white/30 flex items-center gap-2 ' >未找到可運算的圖片</div>
            <div className='text-sm font-normal text-white/60 text-center mt-3'>請重新拍照或上傳圖片。</div>
          </div>
        }


        {isRender && 
          <div className='fixed  inset-0 w-full h-screen bg-black/50 z-30 backdrop-blur-sm'>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            exit={{ opacity: 0 }}
            className=' absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2'
          >
            <div className='w-[400px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
              <img src={process.env.PUBLIC_URL+'/images/loading.png'} alt="" className='animate-spin'/>
            </div>
            


            <div className='w-[350px] '>
              <div className='pt-[100%] relative border border-red-500 rounded-full overflow-hidden'>
                <img src={beforeImage} alt="Selected"  className=" brightness-[0.2] absolute aspect-square top-0 left-0 object-cover w-full h-full rounded-full  " />
                <div className='absolute bottom-10 left-1/2 -translate-x-1/2  z-40 w-full text-center '>
                  {msg && !msg.includes('錯誤') && (
                    <motion.div 
                      initial={{ opacity: 0,y:10 }}
                      animate={{ opacity: 1,y:0}}
                      exit={{ opacity: 0,y:10}}
                      className='text-white/80 '>{msg}</motion.div>
                  )}
                  {
                    storedUsername && msg && !msg.includes('錯誤') &&
                    <div className="  text-white/70 text-xs z-10">玩家名稱：{storedUsername}</div>
                  }
                  {
                    msg && msg.includes('錯誤') &&
                      <div  className='mt-4 p-2 bg-[#FF0050]/70 flex flex-col items-center'>
                        <div className='text-white '>{msg}</div>
                        <div className='text-xs text-white/90 mt-2'>可能是不支援的格式或不清楚的圖</div>
                        <Link to='/camera' className=' px-3  py-2 text-xs rounded-lg border-white/50 my-3 bg-black/20 hover:bg-black/40 font-roboto '>回到上一步驟</Link> 
                      </div>
                  }

                </div>
              </div>
            </div>

          </motion.div>
        
          </div>
        }

        
      
      <Result open={showRender} handleOpen={handleOpen} renderedResult={renderedResult} username={storedUsername}/>
      
    </div>
  )
}

export default ModelSelect