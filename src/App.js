import { useState } from "react";
import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";
import { ImageProvider } from "./Helper/ImageContext";
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import CameraLayout from "./Layouts/CameraLayout";
import Home from './Page/Camera/FrontPage'
import ModelSelect from './Page/Camera/ModelSelect'
import Camera from './Page/Camera/ReadyToTake'
import Result from './Page/Camera/ModelSelect'
function App() {
  const [name, setName] = useState(""); // State to hold the input value
  const [response, setResponse] = useState("");
  const handleAddUser = async () => {
    try {
      const addUserFunction = httpsCallable(functions, "addUser");
      const result = await addUserFunction({ name });

      if (result.data.success) {
        setResponse(result.data.message);
        setName(""); // Clear the name field on successful addition
      } else {
        setResponse("Failed to add user.");
      }
    } catch (error) {
      setResponse("An error occurred.");
      console.error(
        "There was an error calling the addUser Firebase function",
        error
      );
    }
  };
  return (
    <ImageProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CameraLayout />} >
          <Route path="" element={<Home />} />
          <Route path="Camera" element={<Camera />} />
          <Route path="templates" element={<ModelSelect />} />
          <Route path="result" element={<Result />} />
      
        </Route>
      </Routes>
 
    </BrowserRouter>
    </ImageProvider>
  );
}

export default App;
