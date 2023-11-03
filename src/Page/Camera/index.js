import React,{useState} from 'react'
import { motion, AnimatePresence } from "framer-motion";
import ReadyToTake from './ReadyToTake'
import FrontPage from './FrontPage'
function Index() {
  
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [showModalSelectPage, setShowModalSelectPage] = useState(false);
  const [showCameraPage , setShowCameraPage] = useState(false)
  const handleButtonClick = () => {
    setIsButtonVisible(false);
    setTimeout(() => setShowModalSelectPage(true), 500);
  };
  const handleBackButtonClick = () => {
    setShowCameraPage(false);
    setTimeout(() => setIsButtonVisible(true), 500);
  };

  const handleModelSelected = ()=>{

  }
  return (
    <div className='text-white '>  

      <AnimatePresence>
        {
          isButtonVisible && <FrontPage handleClick={handleButtonClick} /> 
        }
        {
          showModalSelectPage && <div>Model</div>
        }
        {
          showCameraPage && <ReadyToTake handleBackClick={handleBackButtonClick}/>
        }
      </AnimatePresence>





    </div>
  )
}

export default Index