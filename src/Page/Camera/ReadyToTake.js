import React, { useState, useRef, useEffect, Suspense,useCallback } from "react";
import {useImage} from '../../Helper/ImageContext'
import { Link } from "react-router-dom";
import {Camera} from "react-camera-pro";
import Webcam from "react-webcam";
import styled from 'styled-components';
import { FaArrowLeft,FaCameraRetro,FaCamera,FaUpload,FaArrowAltCircleRight,FaTimes,FaInfoCircle,FaTh,FaCheck } from "react-icons/fa";
import { MdCameraswitch, MdPhotoCamera,MdMobileScreenShare, MdClose,MdDownload,MdRefresh,MdReply,MdEast,MdKeyboardReturn } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Resizer from "react-image-file-resizer";
import useProgressiveImg from "../../Helper/useProgressiveImg";


import { Button,Checkbox,Typography,IconButton,Alert } from "@material-tailwind/react";
import CustomAlert from "../../Helper/CustomAlert";
import {getUsernameFromCookie} from '../../Helper/Helper'

const ResultImagePreview = styled.div`
  width: 300px;
  height: 800px;
  ${({ ResultImage }) => (ResultImage ? `background-image:  url(${ResultImage});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position:absolute;
  @media (max-width: 400px) {
    width: 50px;
    height: 120px;
  }
`;
function ReadyToTake({handleBackClick}) {
  const storedUsername = getUsernameFromCookie();
  const [isCameraOpen, setCameraOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [waitImage, setwaitImage] = useState(false);
  const [ResultImage, setResultImage] = useState(null);
  const [shareMsg, setShareMsg] = useState("");
  const [showFlashImage, setShowFlashImage] = useState(false);
  const camera = useRef(null);
  const [token, setToken] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [timerId, setTimerId] = useState(null);
  const countdownRef = useRef(countdown);
  const [isLandscape, setIsLandscape] = useState(false);
  const { setBeforeImage } = useImage();
  const [notification, setNotification] = useState(null);
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png','image/bmp'];
  const [ isCameraInfo,setIsCameraInfo] = useState(false)
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
  const [testMsg, setTestMsg] = useState({
    getNumberOfCameras:""
  });

  //webcamRef
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // setImg(imageSrc);
    handleClick(imageSrc)
  }, [webcamRef]);
  
  const initialVideoConstraints = {
    width: 520,
    height: 520 ,
    facingMode: "user",
    mirrored:true
  };
  const [videoConstraints, setVideoConstraints] = useState(initialVideoConstraints);
  const swapCamera = ()=>{
    setVideoConstraints({
      ...videoConstraints,
      facingMode: videoConstraints.facingMode === 'user' ? 'environment' : 'user',
      mirrored: videoConstraints.mirrored === true ? false : true
    });
  }
  //flow open camera
  const toggleCamera = () => {
    setCameraOpen(!isCameraOpen);
    setImage(null)
  };
  //flow upload local image
  const inputFileRef = useRef( null );
  const onFilechange = ( e ) => {
    /*Selected files data can be collected here.*/
    const file = e.target.files[0];
    console.log(file)
    if (!file) return
    if (!allowedImageTypes.includes(file.type)) {
      setNotification('Only BMP, JPEG, JPG, and PNG image files are allowed.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setNotification('File size should be less than 12MB.');
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // 读取文件并更新选定的图像
        const tempImage = new Image();
        tempImage.src = reader.result;
        tempImage.onload = () => {
          // 检查图片尺寸
          if (tempImage.width > 4096 || tempImage.height > 4096) {
            setNotification('Image dimensions should be 4096x4096 or smaller.');
          } else {
            // 更新选中的图像
            setImage(reader.result);
            setBeforeImage(reader.result);
          }
        };
      };
      reader.readAsDataURL(file);
    }

  }
  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    setImage(null)
    // setCameraOpen(false)
    inputFileRef.current.click();
  }
  const testFetchPost = (photo)=>{
    const formData = new FormData();
    formData.append('source_image', photo); 
    formData.append("command_type", "1");

    fetch('https://faceswap.rd-02f.workers.dev/images', {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData)
    })
    .catch(error => {
      console.error(error);
    });
  }
  //flow Camera shot
  const handleClick = async (photo)=>{
    // setShowFlashImage(true);
    // setTimeout(() => setShowFlashImage(true), 200);
    // setTimeout(() => setShowFlashImage(false), 220); // 秒後隱藏圖片
    // setTimeout(() => setwaitImage(true), 300);
    processCameraImage(photo)
    // fetchAiRenderApi(photo)
  }
  const processCameraImage = async (photo) =>{
    const files = await base64toFileList(photo)
    const compressFiles = await resizeFile(files[0]);
    const formData = new FormData();
    formData.append('image', compressFiles); 
    formData.append('token', token); 
    console.log(compressFiles)
    setSelectedImage(compressFiles);

    //顯示預覽圖
    if (compressFiles) {
      const reader = new FileReader();
      reader.onload = () => {
        // 读取文件并更新选定的图像
        setImage(reader.result);
        setBeforeImage(reader.result)
      };
      reader.readAsDataURL(compressFiles);
    }

  }


  //再算一次
  const handleReRender = async ()=>{
    setTimeout(() => setResultImage(null), 200);
    fetchAiRenderApi(image)
  }
  const startCountdown = async() => {
    if (countdownRef.current === 15) {
      setTimerId(
        setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000)
      );
    }
  };

  const cancelCountdown = async() => {
    clearInterval(timerId);
    setCountdown(15);
    setTimerId(null);
  };
  const restartCountdown = () => {
    clearInterval(timerId);
    setCountdown(15);
    setTimerId(null);
    startCountdown();
  };

  const fetchAiRenderApi= async(photo)=>{
    // const binaryImage = await atob(photo.split(",")[1]);
    // console.log(photo)
    const files = await base64toFileList(photo)
    const compressFiles = await resizeFile(files[0]);
    // console.log(image)
    const formData = new FormData();
    formData.append('image', compressFiles); 
    formData.append('token', token); 
    // console.log(files[0])
    console.log(compressFiles)


    // 使用Fetch API上傳圖片
    // fetch('https://camera.moonshot.today/gen', {
    //   method: 'POST',
    //   body: formData
    // })
    // .then(response => response.json())
    // .then(responseData => {
    //   cancelCountdown()
    //   console.log( responseData.substring(0, responseData.length - 2).slice(6));
    //   setResultImage(responseData.substring(0, responseData.length - 2).slice(6))
    //   getNewGToken()
    // })
    // .catch(error => {
    //   console.error(error);
    // });
  }
  function base64toFileList(base64String) {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const file = new File(byteArrays,  "image.jpeg", { type: 'image/jpeg' });
  
    return [file];
  }
  const resizeFile = (file) => 
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300, // 設置圖像的最大寬度
        400, // 設置圖像的最大高度
        'JPEG', // 設置圖像的格式
        70, // 設置圖像的質量
        0, // 設置圖像的旋轉角度
        (uri) => {
          resolve(uri);
        },
        'file' // 設置返回的圖像格式
      );
    });

  const handleCloseClick = async() =>{
    setwaitImage(false)
    setResultImage(null)
    cancelCountdown()
  }
  //給分享圖片
  const handleShare = async () => {
    const imgUrl = document.querySelector('.resultImage').src
    console.log(imgUrl)
    try {
      if (navigator.share) {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const filesArray = [new File([blob], 'image.jpg', { type: 'image/jpeg' })];
        const shareData = {
          files: filesArray,
        };
        await navigator.share(shareData);
      } else {
        console.log('Web Share API not supported');
        setShareMsg('如果是桌面瀏覽器不支援分享功能')
      }
    } catch (error) {
      if (error.toString().includes('AbortError')) {
        console.log('取消分享')
      }
      console.error('Error sharing:', error);
      // setShareMsg('Error sharing:'+ error)
    }
  };
  //下載圖片
  const handleDownloadImage = async ()=>{
    const imgUrl = document.querySelector('.resultImage').src
    fetch(imgUrl)
    .then(response => {
      if (response.ok) {
        return response.blob();
      }
      throw new Error('Network response was not ok.');
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'image.jpg');
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch(error => {
      console.error('Error downloading image: ', error);
    });
  }
  const getNewGToken = async ()=>{
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute('6Lf2JiElAAAAALbuDb9WVQYIiUIcyUi4W9bbToHU', { action: 'submit' })
        .then(token => setToken(token));
    });
  }

  //recaptcha
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://www.google.com/recaptcha/api.js?render=6Lf2JiElAAAAALbuDb9WVQYIiUIcyUi4W9bbToHU';
  //   script.async = true;
  //   script.defer = true;
  //   script.addEventListener('load', () => {
  //     getNewGToken()
  //   });
  //   document.head.appendChild(script);

  // }, []);
  useEffect(() => {
    if (countdown === 0) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [countdown, timerId]);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: landscape)");

    function handleOrientationChange(mq) {
      if (mq.matches) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    }

    handleOrientationChange(mediaQuery);
    mediaQuery.addListener(handleOrientationChange);

    return () => {
      mediaQuery.removeListener(handleOrientationChange);
    };
  }, []);
  useEffect(()=>{
    setIsCameraInfo(true)

    const timeoutId = setTimeout(() => {
      setIsCameraInfo(false);
    }, 10000);

    return () => {
      // 在組件卸載時清除 timeout，避免潛在的記憶體洩漏
      clearTimeout(timeoutId);
    };
  },[])
  


  const [src, { blur }] = useProgressiveImg(process.env.PUBLIC_URL+'/images/camera_page/tiny.jpeg', ResultImage);
  return (
    <div className='flex flex-col w-full justify-between items-center gap-4  my-10 md:my-0'>

      
      {notification && (
        <CustomAlert message={notification} onClose={() => setNotification(null)} />
      )}
      {isCameraOpen ? 
        <div className="flex  items-center gap-4 relative w-full">
            
          <Alert open={isCameraInfo} className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-10/12  md:w-auto   ">
            <div className="flex items-center gap-2 w-full">
              <FaInfoCircle /> <div>請拿下眼鏡、帽子等配件，並將臉部對準參考線。</div>
            </div>
            
          </Alert>

          <div 
            className=" relative w-full  md:w-1/2 mx-auto  bg-gray-500 md:aspect-[16/9]"
            style={{clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'}}
          >

            {!image &&
              <div className="w-full h-full  top-0 z-10 absolute  ">
                <img src={process.env.PUBLIC_URL+'/images/headframe_white.png'} alt="" className="w-full h-full object-cover " />
              </div>
            }

           
            {image && (
              <div 
                className="z-10 absolute bg-black/70 w-full h-full bg-cover bg-no-repeat bg-center flex justify-center items-center  "
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL +'/images/headframe_red.png'})`,
                }}
              >  
                <motion.div 
                  initial={{ opacity: 0,y:-10 }} 
                  animate={{ opacity: 1,y:0}}
                  exit={{ opacity: 0,y:0 }}
                  className="w-[250px] relative">
                  <div className="pt-[80%]  aspect-[4/4.2] md:aspect-[13/10] relative ">
                    <img src={image} alt="Selected"  className="absolute top-0 left-0 object-cover w-full h-full rounded-md border-0 border-white   " />
                  </div>
                  <div className=" absolute top-1 right-1 z-20 ">
                    <IconButton size="sm" className="rounded-full bg-[#FF0050] "  onClick={()=>setImage(null)}>
                      <FaTimes size={16} />
                    </IconButton>
                  </div>     
                </motion.div>
   
              </div>
            )}

            
           {isMobile ? <Webcam ref={webcamRef} facingMode= 'user' mirrored={true} videoConstraints={videoConstraints} /> :  <Webcam ref={webcamRef} mirrored={true} width={1000}    />} 
          </div>
          {
           isMobile ?
            (<>{image ? 
            <motion.div 
              key='1'
              initial={{ opacity: 0, x:  '-50%',y:-10 }}
              animate={{ opacity: 1 , x: '-50%', y:0}}
              exit={{ opacity: 0,x:'-50%' ,y:-10}}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-24 md:-bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center  gap-10 ">
              <button 
                className="flex items-center  rounded-full bg-gray-800   p-5 shadow-lg shadow-gray-300/40  "
                onClick={()=>setImage(null)}
              > 
                <FaArrowLeft color="" size={24}/>  
              </button>
              <Link 
                to={'/templates'} 
                className="flex items-center  rounded-full bg-[#FF0050]   p-5 shadow-lg shadow-gray-300/40  "
              > 
                <FaCheck color="" size={24}/>  
              </Link>
            </motion.div>
            : 
            <motion.div 
              key='2'
              initial={{ opacity: 0, x:  '-50%',y:-10 }}
              animate={{ opacity: 1 , x: '-50%',y:-0}}
              exit={{ opacity: 0,x:'-50%',y:-10 }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-24 md:-bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center  gap-3 ">
              <button 
                className="flex items-center  rounded-full bg-gray-800   p-5 shadow-lg shadow-gray-300/40  "
                onClick={onBtnClick}
              > 
                <FaTh color="" size={24}/>  
              </button>
              <button 
                className="flex items-center  rounded-full bg-[#FF0050]   p-5 shadow-lg shadow-gray-300/40  "
                onClick={capture} 
              > 
                <MdPhotoCamera color="" size={24}/>  
              </button>
              <button 
                className="flex items-center  rounded-full bg-gray-800   p-5 shadow-lg shadow-gray-300/40  "
                onClick={swapCamera} 
              > 
                <MdCameraswitch color="" size={24}/>  
              </button>
                
    
              </motion.div>
            }</>)
           :
            (
              <motion.div className="absolute -bottom-24 md:-bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center  gap-3 ">
                <button 
                  className="flex items-center  rounded-full bg-[#FF0050]   p-5 shadow-lg shadow-gray-300/40  "
                  onClick={capture} 
                > 
                  <MdPhotoCamera color="" size={24}/>  
                </button>
              </motion.div>
            )
          }
          
          


        </div>
      :
      <motion.div className=' relative w-full md:w-4/5 mx-auto flex  aspect-[4/4] md:aspect-[1413/580] mt-10 md:mt-0'>
        <motion.img 
          initial={{ opacity: 0, x:  0 }}
          animate={{ opacity: 1 , x: 0}}
          exit={{ opacity: 0,x:0 }}
          transition={{ duration: 1.5 }}

          src={process.env.PUBLIC_URL+'/images/person_left.png'} alt="p01" className='max-w-full w-1/2 md:w-[24vw] absolute top-0 left-[5%] md:left-[15%]  ' />
        <motion.img
          initial={{ opacity: 0, x:0 }}
          animate={{ opacity: 1 , x:0}}
          exit={{ opacity: 0,x:0 }} 
          transition={{ duration: 1.5 }}
          src={process.env.PUBLIC_URL+'/images/person_right.png'} alt="p01" className='max-w-full w-1/2 md:w-[24vw] absolute top-0  right-[5%] md:right-[15%]  ' />
        {image && (
          <Suspense fallback={<p>Loading</p>}>
            <motion.div 
              initial={{ opacity: 0,  y:-80,  x:'-50%'}}
              animate={{ opacity: 1,y:40, x:'-50%' }}
              exit={{ opacity: 0,y:-80,  x:'-50%' }}
              className="w-[180px] aspect-video flex flex-col  absolute top-0 left-1/2 ">
                <img src={image} alt="Selected"  className="max-w-full w-full h-auto border-2 border-white rounded-md object-contain " />
                <div className="text-center text-xs text-white/70 mt-2">你的圖片</div>

            </motion.div>
          </Suspense>
        )}
        </motion.div>
      }

        <div className="flex flex-col md:flex-row items-center gap-10 mt-10 md:mt-10">
          <div className="flex flex-col gap-6">
            <div className=" relative cursor-pointer hidden " onClick={toggleCamera}>
              <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100  '></div>
              <div className='bg-gradient-to-b from-[#444] to-[#111] px-10 py-2 border  border-white/30 flex justify-center items-center gap-2 ' ><FaCamera />{isCameraOpen? 'Turn off camera' : 'Take a picture'}</div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onFilechange}
              style={{ display: 'none' }}
              ref={inputFileRef}

            />
            <div className=" relative hidden md:block" onClick={onBtnClick}>
              <div className='sample-heading-3 w-full h-full absolute top-0 z-10   opacity-0 hover:opacity-100 cursor-pointer  '></div>
              <div className='bg-gradient-to-b from-[#444] to-[#111] px-10 py-2 border  border-white/30 flex justify-center items-center gap-2' ><FaUpload />Upload a picture</div>
            </div>



          </div>
            {image && (
              <Suspense fallback={<p>Loading</p>}>
                <motion.div
                  initial={{ opacity: 0}}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hidden md:block"
                >
                  <Link to={'/templates'} className=" relative">
                    <div className='sample-heading-3 w-full h-full absolute top-0 z-10   animate-[fadeIn_0.3s_ease-in-out_infinite] hover:animate-none cursor-pointer  '></div>
                    <div className='bg-gradient-to-b bg-[#FF0050] to-[#000] px-10 py-2 border  border-white/30 flex items-center gap-2' >下一步選擇主題 <FaArrowAltCircleRight /></div>
                  </Link>
                </motion.div>
              </Suspense>

            )}
        </div>



      
      {showFlashImage && (
          <div className=" absolute top-0 w-full h-full z-50 bg-white overflow-hidden">
            <img
              src={process.env.PUBLIC_URL+'/images/camera_page/whiteflash4.png'}
              alt="Flash Image"
              className="scale-150 overflow-hidden"
              
            />
          </div>
        )}

    
    </div>
  )
}

export default ReadyToTake