import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  SELECTED_PROJECT: null,
};
const projectSlice = createSlice({
  name: "SELECTED_PROJECT",
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.SELECTED_PROJECT = action.payload.selectedProject;
    },
    clearSelectedProject: (state) => {
      state.SELECTED_PROJECT = null;
    },
  },
});

export const { setSelectedProject, clearSelectedProject } =
  projectSlice.actions;
export default projectSlice.reducer;
