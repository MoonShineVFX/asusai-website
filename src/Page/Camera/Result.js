import React from 'react'
import { useImage } from '../../Helper/ImageContext';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner
} from "@material-tailwind/react";
function Result({open ,handleOpen}) {
  return (
    <div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>.</DialogHeader>
        <DialogBody>
          可以改成黑底 然後算圖的效果
          下方放qrocde
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>關閉</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>再選一次模組</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default Result