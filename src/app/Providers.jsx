"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";

/*
  This component wraps the entire app
  and makes Redux available everywhere
*/
export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
