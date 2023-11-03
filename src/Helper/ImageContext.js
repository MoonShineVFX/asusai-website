import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export function useImage() {
  return useContext(ImageContext);
}

export function ImageProvider({ children }) {
  const [beforeImage, setBeforeImage] = useState(null);

  return (
    <ImageContext.Provider value={{ beforeImage, setBeforeImage }}>
      {children}
    </ImageContext.Provider>
  );
}