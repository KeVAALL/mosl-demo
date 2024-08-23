import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfile: null,
  isLoggedIn: false,
  token: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      console.log(action);
      state.userProfile = action.payload.userProfile;
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },
    clearProfile: (state) => {
      state.userProfile = null;
      state.isLoggedIn = false;
      state.token = null;
      state.we3key = null;
    },
    setLoginAttempt: (state, action) => {
      state.userProfile = action.payload.userProfile;
      state.token = action.payload.token;
      state.we3key = action.payload.we3_key;
    },
  },
});

export const { setProfile, clearProfile, setGoogleLogin } = userSlice.actions;
export default userSlice.reducer;
