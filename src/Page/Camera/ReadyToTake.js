import React, { useState, useRef, useEffect, Suspense } from "react";
import {useImage} from '../../Helper/ImageContext'
import { Link } from "react-router-dom";
import {Camera} from "react-camera-pro";
import styled from 'styled-components';
import { FaArrowLeft,FaCameraRetro } from "react-icons/fa";
import { MdCameraswitch, MdPhotoCamera,MdMobileScreenShare, MdClose,MdDownload,MdRefresh,MdReply,MdEast,MdKeyboardReturn } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Resizer from "react-image-file-resizer";
import useProgressiveImg from "../../Helper/useProgressiveImg";


import { Button,Checkbox,Typography } from "@material-tailwind/react";


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
  const [isCameraOpen, setCameraOpen] = useState(false);
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
  const [testMsg, setTestMsg] = useState({
    getNumberOfCameras:""
  });
  
  
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
    //顯示預覽圖 
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // 读取文件并更新选定的图像
        setImage(reader.result);
        setBeforeImage(reader.result)
      };
      reader.readAsDataURL(file);
    }

  }
  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    setImage(null)
    setCameraOpen(false)
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


  const [src, { blur }] = useProgressiveImg(process.env.PUBLIC_URL+'/images/camera_page/tiny.jpeg', ResultImage);
  return (
    <div className="min-h-[100svh] ">
      <div className="absolute top-0 left-0 z-50 ">
        <p>目前螢幕方向：{isLandscape ? "橫式" : "直式"}</p>
      </div>
      <Link to='/' className=" absolute top-5 left-5 " >
        <Button variant="gradient" className="flex items-center gap-3">
          <FaArrowLeft size={15} />
          Back
        </Button>

      </Link>
    <div className="flex flex-col justify-center items-center gap-5 ">
      <Typography variant="h2">拍攝照片</Typography>
      {isCameraOpen ? 
        <div className="flex items-center gap-4">
          <div className=" relative  w-[560px] aspect-[13/9] bg-gray-500 ">
            <Camera ref={camera}  />
          </div>

          <button 
            className="flex items-center gap-3  rounded-full bg-white p-5 shadow-lg shadow-gray-300/50"
            onClick={() => {
              if (camera.current) {
                const photo = camera.current.takePhoto();
                // console.log(photo);
                // setImage(photo);
                handleClick(photo)
                startCountdown()
              }
            }} 
          > <MdPhotoCamera color="black" size={24}/>  </button>
        </div>
      :
        <div className=" relative  w-[560px] aspect-[13/9] border border-gray-500 rounded-md flex flex-col justify-center items-center ">
            <FaCameraRetro size={40} className=" rotate-12 text-gray-200" />
            <div className="text-sm flex flex-col  justify-center items-center mt-6">
              <div>在這邊你可以選擇開啟相機拍攝自己或者</div>
              <div>從電腦上傳一張下相片</div> 
            </div>

        </div>
      }

      <div>
      <div className="flex flex-col gap-2">
        <Button color="white" onClick={toggleCamera}>開啟相機後拍照</Button>
        <input
          type="file"
          accept="image/*"
          onChange={onFilechange}
          style={{ display: 'none' }}
          ref={inputFileRef}

        />
        <Button color="white" onClick={onBtnClick}>上傳圖片</Button>

        {image && (
          <Suspense fallback={<p>Loading</p>}>
            <Link to={'/templates'}>
              <Button color="white">下一步選擇主題</Button>
            </Link>
          </Suspense>

        )}
        {/* <Button color="white" onClick={testFetchPost}>測試運算上傳圖片</Button> */}

      </div>


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
      {image && (
        <Suspense fallback={<p>Loading</p>}>
          <motion.div 
            initial={{ opacity: 0 , translateY:-50}}
            animate={{ opacity: 1 , translateY:10}}
            exit={{ opacity: 0 , translateY:-50 }}
            className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-5">
            <div className="text-sm">Before圖如下：</div> 
            <div className="w-full h-full  ">
              <img src={image} alt="Selected"  className="max-w-full w-full h-auto border-2 border-white rounded-md object-contain " />

            </div>
            {/* 在这里可以进行图像上传或其他操作 */}
          </motion.div>
        </Suspense>
      )}
    </div>
    
    </div>
  )
}

export default ReadyToTake