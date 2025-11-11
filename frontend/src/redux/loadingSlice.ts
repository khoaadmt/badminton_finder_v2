import { createSlice } from "@reduxjs/toolkit";
import { LoadingState } from "../interface";

const initialState: LoadingState = {
  show: false,
  message: "",
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoading(state, action) {
      state.show = true;
      state.message =
        action.payload || "Máy chủ đang khởi động, vui lòng chờ...";
    },
    hideLoading(state) {
      state.show = false;
      state.message = "";
    },
  },
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
