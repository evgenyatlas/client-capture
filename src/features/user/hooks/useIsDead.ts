import { useUserValue } from "./useUserValue";

export function useIsDead(): boolean {
    return useUserValue<boolean>('dead')
}