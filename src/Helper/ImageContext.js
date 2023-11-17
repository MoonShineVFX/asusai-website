import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export function useImage() {
  return useContext(ImageContext);
}

export function ImageProvider({ children }) {
  const [beforeImage, setBeforeImage] = useState(null);
  const [username, setUsername] = useState('');
  return (
    <ImageContext.Provider value={{ beforeImage, setBeforeImage, username, setUsername }}>
      {children}
    </ImageContext.Provider>
  );
}