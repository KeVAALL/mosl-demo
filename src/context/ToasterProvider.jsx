/* eslint-disable react/prop-types */
// src/ToasterContext.jsx
import React from "react";
import { Toaster } from "react-hot-toast";

const ToasterContext = React.createContext();

export const ToasterProvider = ({ children }) => (
  <ToasterContext.Provider value={{}}>
    <Toaster position="top-right" />
    {children}
  </ToasterContext.Provider>
);

export default ToasterContext;
