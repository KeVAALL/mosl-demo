/* eslint-disable react/prop-types */
// src/ToasterContext.jsx
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToasterContext = React.createContext();

export const ToasterProvider = ({ children }) => (
  <ToasterContext.Provider value={{}}>
    {/* <Toaster position="top-right" /> */}
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    {children}
  </ToasterContext.Provider>
);

export default ToasterContext;
