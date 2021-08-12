import { useUserValue } from "./useUserValue";

export function useEnergy(): number {
    return useUserValue<number>('energy')
}