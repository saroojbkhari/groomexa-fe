import { useSelector as useReduxSelector } from "react-redux";
import type { RootState } from "@/state/store";

/** Typed `useSelector`: `useSelector((state) => state.auth)` autocompletes. */
const useSelector = useReduxSelector.withTypes<RootState>();

export default useSelector;
