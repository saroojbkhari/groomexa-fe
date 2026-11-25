import { useDispatch as useReduxDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";

/** Typed `useDispatch`: knows about our thunks. */
const useDispatch = useReduxDispatch.withTypes<AppDispatch>();

export default useDispatch;
