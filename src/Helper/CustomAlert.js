import React, { useState } from "react";
import { Alert, Button } from "@material-tailwind/react";
import { FaInfoCircle } from "react-icons/fa";
const CustomAlert = ({ message, onClose }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  return (
    <>
      {open && (
        <Alert open={open} onClose={handleClose} className=" absolute top-0  w-3/4  md:w-1/2 z-10  ">
          <div className="flex items-center gap-2">
            <FaInfoCircle /> <div>{message}</div>
          </div>

        </Alert>
      )}
    </>
  );
};

export default CustomAlert;