import { useState } from "react";
import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";

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
    <div className="App">
     <div>1123</div>
     <div className="user-input-section">
          <input
            type="text"
            placeholder="Enter name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleAddUser} disabled={!name.trim()}>
            Add User
          </button>
        </div>

        <h2>{response}</h2>
    </div>
  );
}

export default App;
