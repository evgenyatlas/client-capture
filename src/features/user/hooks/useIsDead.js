import { useUserValue } from "./useUserValue";

export function useIsDead() {
    return useUserValue('dead')
}