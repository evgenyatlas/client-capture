import { useUser } from "./useUser";

export function useUserId() {
    return useUser().id
}