import { configureStore } from "@reduxjs/toolkit";
import whiteBoardSliceReducer from "../features/whiteBoardSlice";

export const store = configureStore({
  reducer: {
    WhiteBoard: whiteBoardSliceReducer,
  },
})