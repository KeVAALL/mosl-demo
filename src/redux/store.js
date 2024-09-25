import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import menuReducer from "./slices/menuSlice";
import projectReducer from "./slices/projectSlice";
import { encryptTransform } from "redux-persist-transform-encrypt";

const rootReducer = combineReducers({
  user: userReducer,
  menu: menuReducer,
  project: projectReducer,
});

const encryptor = encryptTransform({
  secretKey: "@mosl-2-0-2-4", // Replace with your secret key
  onError: function (error) {
    // Handle the error
    console.error("Encryption Error:", error);
  },
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
