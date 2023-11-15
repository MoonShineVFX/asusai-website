import React, { useState } from "react";
import { Alert, Button } from "@material-tailwind/react";

const CustomAlert = ({ message, onClose }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  return (
    <>
      {open && (
        <Alert open={open} onClose={handleClose} className=" absolute top-0 w-1/2 z-10 ">
          {message}

        </Alert>
      )}
    </>
  );
};

export default CustomAlert;