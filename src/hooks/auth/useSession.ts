import useSelector from "@/hooks/common/useSelector";

/** The current session: `status` (unknown until the startup refresh finishes) and the logged-in `user`. */
export default function useSession() {
  return useSelector((state) => state.auth);
}
