import React, { createContext, useContext, useState } from 'react';

// Create the context
const MyContext = createContext();

// Provider component
export const MyProvider = ({ children }) => {
  const [value, setValue] = useState("Initial Value"); // Change as needed

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook for using the context
export const useMyContext = () => useContext(MyContext);
