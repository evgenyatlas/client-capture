import { useUser } from "./useUser";

export function useUserId(): string {
    return useUser().id
}